import json
from selenium import webdriver
from selenium.webdriver.common.by import By
import datetime

options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)
driver.get("chrome://settings/security")

results = {
    "safe_browsing_status": None,
    "message": ""
}

try:
    safe_browsing = driver.find_element(By.TAG_NAME, "body").text
    if "Safe Browsing" in safe_browsing:
        results["safe_browsing_status"] = True
        results["message"] = "✅ Safe Browsing is Enabled"
        results["timestamp"]= datetime.datetime.now().isoformat()
    else:
        results["safe_browsing_status"] = False
        results["message"] = "❌ Safe Browsing is Disabled"
        results["timestamp"]= datetime.datetime.now().isoformat()
except:
    results["safe_browsing_status"] = False
    results["message"] = "❌ Could Not Retrieve Safe Browsing Setting"
    results["timestamp"]= datetime.datetime.now().isoformat()

driver.quit()

# Return the JSON object
print(json.dumps(results, indent=4))
