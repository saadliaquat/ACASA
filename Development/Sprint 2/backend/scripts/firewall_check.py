import subprocess
import re
import platform
import json


def get_firewall_rules():
    system = platform.system()

    try:
        if system == "Darwin": 
            # using pfctl to get firewall rules
            result = subprocess.run(
                ["sudo", "pfctl", "-sr"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode != 0:
                raise Exception(result.stderr)
            return result.stdout.splitlines()

        elif system == "Linux":  
            # try to fetch rules using UFW (Uncomplicated Firewall)
            result = subprocess.run(
                ["sudo", "ufw", "status", "numbered"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode == 0:
                return result.stdout.splitlines()

            # Fallback to iptables if UFW is not active
            result = subprocess.run(
                ["sudo", "iptables", "-L"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            if result.returncode == 0:
                return result.stdout.splitlines()

            raise Exception("Neither UFW nor iptables rules could be retrieved.")

        else:
            return {"error": f"Unsupported operating system: {system}"}

    except Exception as e:
        return {"error": str(e)}



def get_rule_keywords():
    if platform.system() == "Darwin": 
        return {
            "whitelist": ["pass"], 
            "blocked": ["block", "deny", "reject"],  
        }
    elif platform.system() == "Linux": 
        return {
            "whitelist": ["ALLOW", "ACCEPT"],  
            "blocked": ["DENY", "DROP", "REJECT"], 
        }
    else:
        return {"whitelist": [], "blocked": []}  # case of unsupported OS


def check_whitelist_rules(firewall_rules):
    keywords = get_rule_keywords()["whitelist"]
    whitelist_rules = []
    for rule in firewall_rules:
        if any(re.search(rf"^({keyword})", rule, re.IGNORECASE) for keyword in keywords):
            whitelist_rules.append(rule)
    return whitelist_rules


def check_blocked_sites(firewall_rules):
    keywords = get_rule_keywords()["blocked"]
    blocked_sites = []
    for rule in firewall_rules:
        if any(re.search(rf"^({keyword})", rule, re.IGNORECASE) for keyword in keywords):
            blocked_sites.append(rule)
    return blocked_sites



if __name__ == "__main__":
    # print("Fetching firewall rules...")
    # firewall_rules = get_firewall_rules()

    # if isinstance(firewall_rules, dict) and "error" in firewall_rules:
    #     print(f"Error: {firewall_rules['error']}")
    # else:
    #     print("Firewall rules retrieved successfully.")
    #     print("Analyzing rules...")

    #     whitelist_rules = check_whitelist_rules(firewall_rules)
    #     blocked_sites = check_blocked_sites(firewall_rules)

    #     if whitelist_rules:
    #         print("\nWhitelist rules found:")
    #         for rule in whitelist_rules:
    #             print(rule)
    #     else:
    #         print("\nNo whitelist rules found in the firewall.")

    #     if blocked_sites:
    #         print("\nBlocked sites or traffic:")
    #         for site in blocked_sites:
    #             print(site)
    #     else:
    #         print("\nNo blocked sites found.")

    firewall_rules = get_firewall_rules()

    if isinstance(firewall_rules, dict) and "error" in firewall_rules:
        print(json.dumps({"success": False, "error": firewall_rules["error"]}))
    else:
        whitelist_rules = check_whitelist_rules(firewall_rules)
        blocked_sites = check_blocked_sites(firewall_rules)

        result = {
            "success": True,
            "whitelistRules": whitelist_rules,
            "blockedSites": blocked_sites,
        }
        print(json.dumps(result, indent=2))
