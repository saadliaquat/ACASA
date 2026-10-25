import re
import platform
import subprocess
import json

def check_open_ports():
    """
    Check for open ports on the system and return results in JSON format.
    """
    system = platform.system()
    if system not in ["Windows", "Linux"]:
        return {"success": False, "error": f"Open ports check not supported for {system}."}

    try:
        if system == "Linux":
            result = subprocess.check_output(["ss", "-tuln"], stderr=subprocess.STDOUT).decode()
        elif system == "Windows":
            result = subprocess.check_output(["netstat", "-a", "-n", "-o"], stderr=subprocess.STDOUT).decode()

        open_ports = set()
        for line in result.split("\n"):
            match = re.search(r":(\d+)", line) 
            if match:
                open_ports.add(int(match.group(1)))

        return {"success": True, "openPorts": sorted(open_ports) if open_ports else "No open ports found."}
    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"Open ports command failed: {e.output.decode()}"}
    except Exception as e:
        return {"success": False, "error": f"Error checking open ports: {str(e)}"}

if __name__ == "__main__":
    result = check_open_ports()
    print(json.dumps(result, indent=2))
