import platform
import subprocess
import json

def check_running_processes():
    """
    Check for running processes and identify potentially risky ones without psutil.
    """
    try:
        system = platform.system()

        if system == "Windows":
            # Use tasklist command to get running processes on Windows
            result = subprocess.check_output(["tasklist"], stderr=subprocess.STDOUT, text=True)
        elif system in ["Linux", "Darwin"]:
            # Use ps command to get running processes on Linux/macOS
            result = subprocess.check_output(["ps", "-e"], stderr=subprocess.STDOUT, text=True)
        else:
            return {"success": False, "error": f"Unsupported operating system: {system}"}

        # Define risky keywords to match against process names
        risky_keywords = [
            "wmic", "regsvr32", "mshta", "schtasks", "rundll32",
            "netstat", "taskkill", "dllhost", "taskmgr", "msiexec",
            "svchostx", "vbc", "fltmgr", "metasploit", "beacon",
            "rms", "downloader", "loader", "updater",
            "crypto", "miner", "xloader"
        ]

        # Search for risky processes in the output
        risky_processes = []
        for line in result.splitlines():
            for keyword in risky_keywords:
                if keyword.lower() in line.lower():
                    # Extract the process name and PID
                    parts = line.split()
                    if system == "Windows":
                        # For Windows, the first column is the name, and the second is the PID
                        process_name = parts[0]
                        process_pid = parts[1] if len(parts) > 1 else "Unknown"
                    else:
                        # For Linux/macOS, the last column is the name, and the second column is the PID
                        process_pid = parts[0]
                        process_name = parts[-1]

                    risky_processes.append({"name": process_name, "pid": process_pid})
                    break

        return {"success": True, "riskyProcesses": risky_processes} if risky_processes else {"success": True, "message": "No risky processes detected."}

    except subprocess.CalledProcessError as e:
        return {"success": False, "error": f"Error executing system command: {e.output}"}
    except Exception as e:
        return {"success": False, "error": f"Error checking running processes: {str(e)}"}

if __name__ == "__main__":
    result = check_running_processes()
    print(json.dumps(result, indent=2))
