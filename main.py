"""
This script is designed to run the follow_stargazers.py script in a loop.
"""

import time
from follow_stargazers import main

if __name__ == "__main__":
    print("Starting the follow_stargazers script...")
    while True:
        try:
            main()
        except Exception as e:
            print(f"An error occurred: {e}")
        time.sleep(2)
