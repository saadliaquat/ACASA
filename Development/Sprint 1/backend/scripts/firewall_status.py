import subprocess
import platform
import json

def check_firewall_status():
    system = platform.system()

    try:
        if system == "Darwin":  # macOS
            result = subprocess.run(
                ["defaults", "read", "/Library/Preferences/com.apple.alf", "globalstate"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode == 0:
                # 0: Off, 1: On (specific services only), 2: Fully enabled
                status = int(result.stdout.strip())
                return {"firewall_enabled": status == 2, "status_code": status}

        elif system == "Linux": 
            # check the status of UFW (Uncomplicated Firewall)
            result = subprocess.run(
                ["sudo", "ufw", "status"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode == 0:
                return {"firewall_enabled": "active" in result.stdout.lower(), "output": result.stdout.strip()}

            # alternatively, check iptables rules
            result = subprocess.run(
                ["sudo", "iptables", "-L"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode == 0:
                return {"firewall_enabled": "Chain" in result.stdout, "output": result.stdout.strip()}

        # elif system == "Windows":  
        #     result = subprocess.run(
        #         ["netsh", "advfirewall", "show", "allprofiles"],
        #         stdout=subprocess.PIPE,
        #         stderr=subprocess.PIPE,
        #         text=True,
        #     )
        #     if result.returncode == 0:
        #         enabled = "state on" in result.stdout.lower()
        #         return {"firewall_enabled": enabled, "output": result.stdout.strip()}

        else:
            return {"error": f"Unsupported operating system: {system}"}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    status = check_firewall_status()
    print(json.dumps(status, indent=2))
