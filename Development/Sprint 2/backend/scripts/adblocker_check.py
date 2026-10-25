import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

def test_adblock(browser):
    driver = None
    options = None
    results = {}

    try:
        if browser.lower() == "chrome":
            options = webdriver.ChromeOptions()
            options.add_argument("--headless")  # Run in headless mode
            driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

        elif browser.lower() == "firefox":
            options = webdriver.FirefoxOptions()
            driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options=options)

        else:
            return json.dumps({"error": f"❌ Browser '{browser}' not supported."}, indent=4)

        test_url = "https://ads-blocker.com/testing/"  # Real ad-block test page
        driver.get(test_url)

        try:
            # Adjust class name based on test site inspection
            ad_element = driver.find_element(By.CLASS_NAME, "ad")
            blocked = False  # Ads are visible, meaning no ad blocker
        except:
            blocked = True  # No ads found, meaning AdBlock is working

        results = {
            "browser": browser,
            "url": test_url,
            "ads_blocked": blocked,
            "message": "✅ PASS: Ads are blocked. Adblocker is enabled." if blocked else "❌ FAIL: Ads are visible. No adblock detected."
        }

    except Exception as e:
        results = {"error": f"⚠️ Error: {str(e)}"}

    finally:
        if driver:
            driver.quit()

    return json.dumps(results, indent=4)  # Return JSON output

if __name__ == "__main__":
    print(test_adblock("chrome"))  # Change to "firefox" for Firefox
