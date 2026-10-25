import platform
import subprocess
import json
import re
import datetime

def parse_process_info(line, system):
    """
    Parse process information from a line of system output.
    """
    try:
        if system == "Windows":
            parts = re.split(r'\s{2,}', line.strip())
            # Ensure line has the necessary fields
            if len(parts) < 6:
                return None
            # Parse CPU and memory if valid
            cpu_percent = float(parts[4].replace("%", "").strip()) if "%" in parts[4] else 0.0
            memory_kb = float(parts[5].replace(",", "").strip()) if parts[5].replace(",", "").isdigit() else 0.0
            return {
                "name": parts[0],
                "pid": parts[1],
                "cpu_percent": cpu_percent,
                "memory_mb": round(memory_kb / 1024, 2)  # Convert KB to MB
            }
        elif system in ["Linux", "Darwin"]:
            parts = re.split(r'\s+', line.strip())
            # Ensure line has the necessary fields
            if len(parts) < 10:
                return None
            return {
                "pid": parts[1],
                "name": parts[10],
                "cpu_percent": float(parts[2]),
                "memory_mb": round(float(parts[3]) / 1024, 2)  # Convert KB to MB
            }
    except (ValueError, IndexError):
        # Return None if parsing fails for a line
        return None

def check_high_resource_usage(cpu_threshold=50.0, memory_threshold=200.0):
    """
    Identify processes that exceed the given CPU or memory usage threshold.
    """
    system = platform.system()

    try:
        if system == "Windows":
            # Use `tasklist` with `/v` for verbose output
            result = subprocess.check_output(["tasklist", "/v"], stderr=subprocess.STDOUT, text=True)
        elif system in ["Linux", "Darwin"]:
            # Use `ps aux` for process details
            result = subprocess.check_output(["ps", "aux"], stderr=subprocess.STDOUT, text=True)
        else:
            return {"success": False, "error": f"Unsupported operating system: {system}"}

        high_resource_processes = []
        for line in result.splitlines()[1:]:  # Skip the header line
            process_info = parse_process_info(line, system)
            if process_info:
                cpu_usage = process_info["cpu_percent"]
                memory_usage = process_info["memory_mb"]
                if cpu_usage > cpu_threshold or memory_usage > memory_threshold:
                    high_resource_processes.append(process_info)

        return {"success": True, "highResourceProcesses": high_resource_processes} if high_resource_processes else {"success": True, "message": "No processes exceeding resource thresholds."}

    except subprocess.CalledProcessError as e:
        return {"success": False,"timestamp":datetime.datetime.now().isoformat(), "error": f"Error executing system command: {e.output}"}
    except Exception as e:
        return {"success": False, "timestamp":datetime.datetime.now().isoformat(),"error": f"Error checking high resource usage: {str(e)}"}

if __name__ == "__main__":
    result = check_high_resource_usage()
    print(json.dumps(result, indent=2))
