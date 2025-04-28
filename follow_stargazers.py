import requests, time, os
from dotenv import load_dotenv

load_dotenv(override=True)

TOKEN = os.environ["GH_TOKEN"]
GIST_ID = os.environ["GIST_ID"]
OWNER = os.environ["REPO_OWNER"]
REPO = os.environ["REPO_NAME"]
FILENAME = "followed_users.txt"

headers = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github+json"}


def get_followed_users_from_gist():
    url = f"https://api.github.com/gists/{GIST_ID}"
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch gist: {response.status_code}")
    content = response.json()["files"][FILENAME]["content"]
    return set(line.strip() for line in content.splitlines() if line.strip())


def update_gist_with_usernames(followed_users):
    url = f"https://api.github.com/gists/{GIST_ID}"
    existing_users = get_followed_users_from_gist()
    updated_users = existing_users.union(followed_users)
    data = {"files": {FILENAME: {"content": "\n".join(sorted(updated_users))}}}
    response = requests.patch(url, json=data, headers=headers)
    if response.status_code != 200:
        print(f"⚠️ Failed to update gist: {response.status_code} - {response.text}")


def get_stargazers(owner, repo):
    users, page = [], 1
    print("Fetching stargazers...", end="\r")
    while True:
        url = f"https://api.github.com/repos/{owner}/{repo}/stargazers?per_page=100&page={page}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch stargazers: {response.status_code}")
            break
        data = response.json()
        if not data:
            break
        users += [u["login"] for u in data]
        page += 1
        time.sleep(1)
    return users


def follow_user(username):
    url = f"https://api.github.com/user/following/{username}"
    r = requests.put(url, headers=headers)
    if r.status_code == 204:
        print(f"✅ Followed {username}")
        return True
    else:
        print(f"⚠️ Failed to follow {username}: {r.status_code} - {r.text}")
        return False


def main():
    already_followed = get_followed_users_from_gist()
    stargazers = get_stargazers(OWNER, REPO)
    new_users = [u for u in stargazers if u not in already_followed]

    newly_followed = set()

    for u in new_users:
        success = follow_user(u)
        if success:
            newly_followed.add(u)
        time.sleep(0.5)

    if newly_followed:
        print("Updating gist...", end="\r")
        update_gist_with_usernames(newly_followed)
        time.sleep(0.5)

    print("Fetching stargazers...", end="\r")


if __name__ == "__main__":
    main()
