import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

export async function followUser(username: string) {
  await octokit.request('PUT /user/following/{username}', { username })
}
