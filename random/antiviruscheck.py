import subprocess

def check_antivirus():
    try:
        # Run the WMIC command to check for antivirus products
        command = 'wmic /namespace:\\\\root\\SecurityCenter2 path AntiVirusProduct get displayName'
        result = subprocess.run(command, capture_output=True, text=True, shell=True)

        # Capture and process the output
        output = result.stdout.strip()
        
        # Display output based on whether any antivirus products are found
        if 'displayName' in output and len(output.splitlines()) > 1:
            antivirus_list = output.splitlines()[1:]  # Skip the header line
            print("Antivirus products detected:")
            for antivirus in antivirus_list:
                print(f" - {antivirus.strip()}")
        else:
            print("No antivirus products detected.")
    
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the function
check_antivirus()
