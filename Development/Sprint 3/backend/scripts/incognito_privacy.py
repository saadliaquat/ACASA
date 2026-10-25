import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
import datetime

def test_incognito_cookies(browser):
    driver = None
    options = None
    results = {}

    try:
        if browser.lower() == "chrome":
            options = webdriver.ChromeOptions()
            options.add_argument("--incognito")
            options.add_argument("--headless")  # Run in headless mode
            driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

        elif browser.lower() == "firefox":
            options = webdriver.FirefoxOptions()
            options.add_argument("-private")  # Firefox Incognito Mode
            options.add_argument("--headless")
            driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options=options)

        else:
            return json.dumps({"error": f"❌ Browser '{browser}' not supported."}, indent=4)

        test_url = "https://www.google.com"
        driver.get(test_url)

        # Wait to allow cookies to be set
        time.sleep(2)

        cookies = driver.get_cookies()
        cookies_cleared = len(cookies) == 0  # True if no cookies found

        results = {
            "browser": browser,
            "url": test_url,
            "cookies_cleared": cookies_cleared,
            "message": "✅ Incognito mode is clearing cookies correctly." if cookies_cleared else "❌ Incognito mode is NOT clearing cookies.",
            "timestamp": datetime.datetime.now().isoformat()
        }

    except Exception as e:
        results = {"error": f"⚠️ Error: {str(e)}"}

    finally:
        if driver:
            driver.quit()

    return json.dumps(results, indent=4)  # Return JSON output

if __name__ == "__main__":
    print(test_incognito_cookies("chrome"))  # Change to "firefox" for Firefox
