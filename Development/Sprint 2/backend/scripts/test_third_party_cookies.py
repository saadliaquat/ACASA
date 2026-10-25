import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Setup WebDriver with Incognito Mode
options = webdriver.ChromeOptions()
options.add_argument("--incognito")
options.add_argument("--headless")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

results = {
    "third_party_cookies_status": None,
    "message": ""
}

try:
    # Open website to check third-party cookie status
    driver.get("https://www.whatismybrowser.com/detect/are-third-party-cookies-enabled")

    # Wait for the result to load
    wait = WebDriverWait(driver, 10)
    status_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "detected_result")))
    status = status_element.text

    # Validate cookie settings
    if "Disabled" in status:
        results["third_party_cookies_status"] = True
        results["message"] = "✅ Third-party cookies are BLOCKED in Incognito mode"
    else:
        results["third_party_cookies_status"] = False
        results["message"] = "❌ Third-party cookies are NOT blocked in Incognito mode"

except Exception as e:
    results["third_party_cookies_status"] = False
    results["message"] = f"❌ Error: {e}"

finally:
    driver.quit()

# Return the JSON object
print(json.dumps(results, indent=4))
