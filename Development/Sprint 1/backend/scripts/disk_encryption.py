import platform
import subprocess
import json

def check_disk_encryption():
    """
    Check the status of disk encryption and return results in JSON format.
    """
    system = platform.system()
    if system not in ["Windows", "Linux"]:
        return {"success": False, "error": f"Disk encryption check not supported for {system}."}

    try:
        if system == "Windows":
            result = subprocess.check_output(
                ["manage-bde", "-status"], stderr=subprocess.STDOUT
            ).decode()
            status = "Disk is fully encrypted with BitLocker." if "Fully Encrypted" in result else "Disk is not fully encrypted."
        elif system == "Linux":
            result = subprocess.check_output(
                ["lsblk", "-f"], stderr=subprocess.STDOUT
            ).decode()
            status = "Disk is encrypted with LUKS." if "crypto_LUKS" in result else "Disk is not encrypted with LUKS."

        return {"success": True, "message": status}
    except subprocess.CalledProcessError as e:
        if "access a required resource was denied" in e.output.decode().lower():
            return {"success": False, "error": "Permission denied. Please run the script as Administrator."}
        return {"success": False, "error": f"Disk encryption command failed: {e.output.decode()}"}
    except Exception as e:
        return {"success": False, "error": f"Error checking disk encryption: {str(e)}"}

if __name__ == "__main__":
    result = check_disk_encryption()
    print(json.dumps(result, indent=2))
