import subprocess
import json
import platform

def get_sudo_users():
    """Retrieve the list of users in the sudo (Linux) or admin (macOS) group."""
    system = platform.system()
    try:
        if system == "Linux":
            result = subprocess.run(['getent', 'group', 'sudo'], capture_output=True, text=True, check=True)
            if result.stdout:
                sudo_group = result.stdout.split(':')[3].strip()
                return sudo_group.split(',') if sudo_group else []
        elif system == "Darwin":  # macOS
            result = subprocess.run(['dscl', '.', 'read', '/Groups/admin', 'GroupMembership'], capture_output=True, text=True, check=True)
            if result.stdout:
                return result.stdout.strip().split()[1:]  # Extract usernames
        return []
    except subprocess.CalledProcessError as e:
        print(f"Error retrieving sudo/admin group users: {e}")
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
    """Check for discrepancies between sudo/admin users and authorized users."""
    unauthUsrs = [user for user in sudo_users if user not in authorized_users]
    return len(unauthUsrs) == 0, unauthUsrs

def main():
    # Define the path to the authorized users file
    # authorized_users_file = "authorized_users.txt"

    # Get the list of sudo/admin users
    sudo_users = get_sudo_users()
    
    # Read authorized users from the file
    # authorized_users = read_authorized_users(authorized_users_file)
    authorized_users = ["ammad"]

    # Check for unauthorized privileged users
    result, unauthUsrList = check_privileged_users(sudo_users, authorized_users)
    print(json.dumps({"No unauthorized users": result, "unauthorized_users": unauthUsrList}, indent=2))

if __name__ == "__main__":
    main()
