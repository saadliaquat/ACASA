import osquery

# Initialize the osquery extension
extension = osquery.Extension()

# Connect to the osquery daemon
extension.open()

# Query the 'disk_encryption' table to check for encryption
query = "SELECT * FROM disk_encryption WHERE status = 'enabled';"
results = extension.query(query)

# Check if encryption is enabled
if results:
    print("Encryption is enabled:")
    for row in results:
        print(f"  - Device: {row['device']}")
        print(f"  - Encryption method: {row['encryption_method']}")
        print(f"  - Status: {row['status']}")
else:
    print("No encryption detected.")

# Close the osquery extension
extension.close()