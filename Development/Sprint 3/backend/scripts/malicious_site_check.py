import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import datetime

# List of Safe Browsing test URLs
test_urls = {
    "Malware Test": "http://testsafebrowsing.appspot.com/s/malware.html",
    "Phishing Test": "http://testsafebrowsing.appspot.com/s/phishing.html"
}

def test_safe_browsing():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in headless mode
    options.add_argument('--disable-gpu')
    options.add_argument('--log-level=3')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    results = {} 

    warning_keywords = ["deceptive site", "malware", "phishing", "harmful", "attackers", "security risk"]

    for test_name, test_url in test_urls.items():
        driver.get(test_url)

        blocked = any(keyword in driver.page_source.lower() for keyword in warning_keywords)

        results[test_name] = {
            "url": test_url,
            "blocked": blocked,
            "message": "✅ Blocked by Safe Browsing" if blocked else "❌ Not Blocked",
            "timestamp": datetime.datetime.now().isoformat()
        }

    driver.quit()

    return json.dumps(results, indent=4)  

if __name__ == "__main__":
    print(test_safe_browsing())
