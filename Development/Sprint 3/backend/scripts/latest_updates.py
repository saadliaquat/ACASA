import subprocess
import platform
import json
import datetime

latest_hotfix = "KB5048667"

def check_last_and_latest_updates(hotfix_id=latest_hotfix):
    """
    Check if the specific HotFixID is installed on the system using PowerShell.
    """
    system = platform.system()
    
    if system == "Windows":
        try:
            powershell_command = f'Get-HotFix | Where-Object {{ $_.HotFixID -eq "{hotfix_id}" }}'
            result = subprocess.check_output(["powershell", "-Command", powershell_command], stderr=subprocess.STDOUT).decode()

            if hotfix_id in result:
                return {"success": True, "timestamp": datetime.datetime.now().isoformat(), "message": f"Latest Update: {hotfix_id} is installed."}
            else:
                return {"success": True, "timestamp": datetime.datetime.now().isoformat(), "message": f"Latest Update: {hotfix_id} is not installed."}
        except subprocess.CalledProcessError as e:
            return {"success": False, "timestamp": datetime.datetime.now().isoformat(), "error": f"Error executing the PowerShell command: {e.output.decode()}"}
        except Exception as e:
            return {"success": False, "timestamp": datetime.datetime.now().isoformat(), "error": f"An error occurred: {str(e)}"}
    
    elif system == "Darwin":  # macOS
        try:
            result = subprocess.check_output(["softwareupdate", "--history"], stderr=subprocess.STDOUT).decode()
            status = "Latest macOS updates are installed." if "macOS" in result else "Latest macOS updates are not installed."
            return {"success": True, "timestamp": datetime.datetime.now().isoformat(), "message": status}
        except subprocess.CalledProcessError as e:
            return {"success": False, "timestamp": datetime.datetime.now().isoformat(), "error": f"Error checking macOS updates: {e.output.decode()}"}
        except Exception as e:
            return {"success": False, "timestamp": datetime.datetime.now().isoformat(), "error": f"An error occurred: {str(e)}"}
    
    else:
        return {"success": False, "error": f"Update check not supported for {system}."}

if __name__ == "__main__":
    result = check_last_and_latest_updates()
    print(json.dumps(result, indent=2))
