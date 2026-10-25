import platform
import subprocess
import json
import os
import datetime

def check_running_processes():
    """
    Check for running processes and identify potentially risky ones without psutil.
    """
    try:
        system = platform.system()

        if system == "Windows":
            # Use tasklist command to get running processes on Windows
            result = subprocess.check_output(["tasklist"], stderr=subprocess.STDOUT, text=True)

        elif system == "Linux":
            # Use ps to get running processes on Linux
            result = subprocess.check_output(["ps", "-e", "-o", "pid,command"], stderr=subprocess.STDOUT, text=True)

        elif system == "Darwin":  # macOS
            # Use ps -axo pid,command to get full command names with PIDs
            result = subprocess.check_output(["ps", "-axo", "pid,command"], stderr=subprocess.STDOUT, text=True)

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
            parts = line.split(maxsplit=1)
            if len(parts) < 2:
                continue  # Skip malformed lines

            process_pid = parts[0]
            full_command = parts[1]

            # Extract just the executable name (removing path)
            process_name = os.path.basename(full_command.split()[0])  # Get only the actual executable

            for keyword in risky_keywords:
                if keyword.lower() in process_name.lower():
                    risky_processes.append({"name": process_name, "pid": process_pid})
                    break

        return {"success": True, "riskyProcesses": risky_processes} if risky_processes else {"success": True, "message": "No risky processes detected."}

    except subprocess.CalledProcessError as e:
        return {"success": False,"timestamp":datetime.datetime.now().isoformat(), "error": f"Error executing system command: {e.output}"}
    except Exception as e:
        return {"success": False,"timestamp":datetime.datetime.now().isoformat(), "error": f"Error checking running processes: {str(e)}"}

if __name__ == "__main__":
    result = check_running_processes()
    print(json.dumps(result, indent=2))
