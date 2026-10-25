'''
    Verify that only authorized users have accounts with privileged access
'''

import subprocess
import json

def get_sudo_users():
    """Retrieve the list of users in the sudo group."""
    try:
        result = subprocess.run(['getent', 'group', 'sudo'], capture_output=True, text=True, check=True)
        if result.stdout:
            sudo_group = result.stdout.split(':')[3].strip()
            return sudo_group.split(',') if sudo_group else []
        else:
            return []
    except subprocess.CalledProcessError as e:
        print(f"Error retrieving sudo group users: {e}")
        return []

def read_authorized_users(file_path):
    """Read authorized users from a file into a list."""
    try:
        with open(file_path, 'r') as file:
            return [line.strip() for line in file.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return []

def check_privileged_users(sudo_users, authorized_users):
    """Check for discrepancies between sudo users and authorized users."""
    # print("Checking privileged users...")
    unauthUsrs = []
    noUnauthUsrsFlag = True
    for user in sudo_users:
        if user not in authorized_users:
            unauthUsrs.append(user)
            noUnauthUsrsFlag = False
    return noUnauthUsrsFlag, unauthUsrs


def main():
    # Define the path to the authorized users file
    # authorized_users_file = "authorized_users.txt"

    # Get the list of sudo users
    sudo_users = get_sudo_users()
    # Read authorized users from the file
    # authorized_users = read_authorized_users(authorized_users_file)


    # 
    authorized_users = ["ammad"]
    #

    # Check for unauthorized privileged users
    result,unauthUsrList = check_privileged_users(sudo_users, authorized_users)
    print(json.dumps({"No unauthorized users":result, "unauthorized_users":unauthUsrList}, indent=2))

if __name__ == "__main__":
    main()