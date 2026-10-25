import osquery
import json

def query_osquery(sql):
    with osquery.ExtensionClient("/path/to/osquery.em") as client:
        response = client.query(sql)
        if response.status.code == 0:
            return response.response
        else:
            print("Error:", response.status.message)
            return None

def inventory_and_baseline_check():
    results = {}

    # 1. System Information
    system_info_query = "SELECT hostname, os_version, hardware_model FROM system_info;"
    system_info = query_osquery(system_info_query)
    results['system_info'] = system_info

    # 2. Installed Software
    software_query = "SELECT name, version, install_location FROM programs;"
    installed_software = query_osquery(software_query)
    results['installed_software'] = installed_software

    # # 3. Security Baseline Check (e.g., firewall, secure boot)
    # security_baseline_query = """
    # SELECT * FROM windows_security_center
    # WHERE antivirus IS NOT NULL OR firewall IS NOT NULL;
    # """
    # security_baseline = query_osquery(security_baseline_query)
    # results['security_baseline'] = security_baseline

    # 4. System Users
    users_query = "SELECT username, description, directory FROM users;"
    system_users = query_osquery(users_query)
    results['system_users'] = system_users

    # Print out the results in JSON format
    print(json.dumps(results, indent=4))

# Run the function
inventory_and_baseline_check()
