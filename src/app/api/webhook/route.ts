import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/verifySignature'
import { followUser, unfollowUser } from '@/lib/followUser'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256')
  const secret = process.env.GITHUB_WEBHOOK_SECRET!

  if (!verifySignature(secret, body, signature)) {
    console.warn('Invalid signature')
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  const githubEvent = req.headers.get('x-github-event')
  if (githubEvent !== 'star') {
    console.log('Not a star event')
    return NextResponse.json({ message: 'Ignored non-star event' })
  }

  const event = JSON.parse(body)
  const username = event.sender?.login

  if (!['created', 'deleted'].includes(event.action) || !username) {
    console.warn('Irrelevant action or missing username')
    return NextResponse.json({ message: 'Ignored' })
  }

  try {
    console.log(`Received event: ${event.action} from ${username}`)
    
    if (event.action === 'created') {
      await followUser(username)
      console.log(`Followed user: ${username}`) 
    } else if (event.action === 'deleted') {
      await unfollowUser(username)
      console.log(`Unfollowed user: ${username}`) 
    }

    return NextResponse.json({ message: 'Success' })

  } catch (err: any) {
    console.error('Error:', err.message || err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
