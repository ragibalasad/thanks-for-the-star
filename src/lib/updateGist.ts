import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function updateGistWithUsername(username: string): Promise<boolean> {
  const gistId = process.env.GIST_ID!
  const gist = await octokit.gists.get({ gist_id: gistId })
  const file = gist.data.files?.['followed.txt']

  if (!file) throw new Error('followed.txt not found in Gist')

  const followed = file.content?.split('\n') || []
  if (followed.includes(username)) return false

  followed.push(username)

  await octokit.gists.update({
    gist_id: gistId,
    files: {
      'followed.txt': {
        content: followed.join('\n'),
      },
    },
  })

  return true
}
