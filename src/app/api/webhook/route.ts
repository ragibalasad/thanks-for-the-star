import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/verifySignature'
import { followUser } from '@/lib/followUser'
import { updateGistWithUsername } from '@/lib/updateGist'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256')
  const secret = process.env.GITHUB_WEBHOOK_SECRET!

  if (!verifySignature(secret, body, signature)) {
    console.warn('❌ Invalid signature')
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.action !== 'created' || event.repository?.stargazers_count === undefined) {
    console.log('ℹ️ Not a new star event')
    return NextResponse.json({ message: 'Ignored' })
  }

  const username = event.sender?.login
  if (!username) {
    console.warn('❌ No username found in event')
    return NextResponse.json({ message: 'No username found' }, { status: 400 })
  }

  try {
    const updated = await updateGistWithUsername(username)

    if (!updated) {
      console.log(`✅ Already followed: ${username}`)
      return NextResponse.json({ message: 'Already followed' })
    }

    await followUser(username)
    console.log(`🎉 Followed new user: ${username}`)

    return NextResponse.json({ message: `Followed ${username}` })
  } catch (err: any) {
    console.error('🔥 Error:', err.message || err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
