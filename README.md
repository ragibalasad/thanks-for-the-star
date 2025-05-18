<p align="center"><img src="https://gist.githubusercontent.com/ragibalasad/0005e389abeceb2f21f397f7db21863c/raw/275411a57f60380762891a8f74a737dac1ef755f/thanks_for_the_star.svg"></p>

<h1 align="center">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ragibalasad/thanks-for-the-star?style=for-the-badge&label=%E2%AD%90%20stars&labelColor=24292F&color=FFE66D">
  <img src="https://img.shields.io/github/license/ragibalasad/thanks-for-the-star?style=for-the-badge&label=%F0%9F%93%84%20LICENSE&labelColor=24292F&color=7ED6DF" />
</h1>

<p align="center">
  Automatically follow people who star your repo ✨<br/>
  Give back with a follow, powered by Next.js & GitHub Webhook<br/><br/>

  <div align=center>

##### Star this repo and get an instant follow back 💖

##

  </div>
</p>

A Next.js 14 serverless GitHub webhook API to auto-follow users who star your repo — ported from the Python version to Next.js API route with full secret verification and logging.

## How it works

When someone stars this repo, GitHub sends a webhook that triggers this API. It:

- Validates the webhook signature
- Follows the user by sending a PUT request to `https://api.github.com/user/following/{username}` with the GitHub token in the `Authorization` header (`Bearer <token>`).

## Features

- Secure webhook secret validation
- Instant follow-back of new stargazers
- Simple setup with environment variables
- Logs for success and errors

## Setup

You can set this up yourself to automatically follow users who star your repository.

1. Clone or download this repo

2. Rename `.env.example` to `.env.local` and fill in your values:

```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

- The GitHub token needs the `user:follow` scope.

3. Deploy on Vercel

4. Add the webhook URL to your GitHub repo settings:

```
https://your-vercel-app.vercel.app/api/webhook
```

- Content type: `application/json`
- Secret: same as `GITHUB_WEBHOOK_SECRET`

## Logs & Debugging

Logs are printed in Vercel serverless function console.

## License

BSD-3-Clause license
