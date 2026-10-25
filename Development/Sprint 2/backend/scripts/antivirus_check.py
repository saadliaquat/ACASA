import subprocess
import json
import platform
import re

#known antivirus software
KNOWN_ANTIVIRUS_SOFTWARE = [
    "McAfee",
    "Sophos",
    "Avast",
    "Norton",
    "Kaspersky",
    "Bitdefender",
    "Trend Micro",
    "ESET",
    "Webroot",
    "ClamAV",
]

# ddditional keywords to identify security-related applications
SECURITY_KEYWORDS = [
    "antivirus",
    "anti-virus",
    "malware",
    "protection",
    "security",
    "endpoint",
    "scanner",
]


def get_installed_packages_linux():
    try:
        # try dpkg (Debian-based systems)
        result = subprocess.run(
            ["dpkg", "--get-selections"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode == 0:
            return result.stdout

        # if dpkg fails, try rpm (Red Hat-based systems)
        result = subprocess.run(
            ["rpm", "-qa"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode == 0:
            return result.stdout

        # if neither works, raise an exception
        raise Exception("Unsupported package manager. Unable to retrieve installed packages.")
    except Exception as e:
        return {"error": str(e)}


def get_installed_packages_macos():
    try:
        result = subprocess.run(
            ["system_profiler", "SPApplicationsDataType"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode != 0:
            raise Exception(result.stderr)
        return result.stdout
    except Exception as e:
        return {"error": str(e)}



def check_antivirus():
    try:
        system = platform.system()
        if system == "Darwin":  # macOS
            installed_apps = get_installed_packages_macos()
            if isinstance(installed_apps, dict) and "error" in installed_apps:
                return installed_apps

        elif system == "Linux": 
            installed_apps = get_installed_packages_linux()
            if isinstance(installed_apps, dict) and "error" in installed_apps:
                return installed_apps
        else:
            return {"error": f"Unsupported operating system: {system}"}

        # lowercase for easier matching
        installed_apps_lower = installed_apps.lower()

        # check for known antivirus software
        antivirus_found = [
            av
            for av in KNOWN_ANTIVIRUS_SOFTWARE
            if av.lower() in installed_apps_lower
        ]

        # check for security-related keywords
        security_apps_found = [
            app
            for app in installed_apps.splitlines()
            if any(re.search(keyword, app, re.IGNORECASE) for keyword in SECURITY_KEYWORDS)
        ]

        found_apps = list(set(antivirus_found + security_apps_found))

        return {
            "antivirus_installed": bool(found_apps),
            "found": found_apps,
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    result = check_antivirus()
    print(json.dumps(result, indent=2))
    # here is a sample from my terminal if needed to see format in backend - rida
#     {
#   "antivirus_installed": true,
#   "found": [
#     "      Location: /System/Library/Image Capture/Devices/AirScanScanner.app",
#     "    EscrowSecurityAlert:",
#     "      Location: /System/Library/CoreServices/EscrowSecurityAlert.app",
#     "ESET",
#     "    AirScanScanner:"
#   ]
# }
