import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
import datetime

def test_request_limit(browser):
    driver = None
    options = None
    results = {
        "browser": browser,
        "url": "https://httpbin.org/get",
        "requests_sent": 0,
        "rate_limited": False,
        "rate_limit_at": None,
        "message": ""
    }

    try:
        if browser.lower() == "chrome":
            options = webdriver.ChromeOptions()
            options.add_argument("--headless")
            driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

        elif browser.lower() == "firefox":
            options = webdriver.FirefoxOptions()
            driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()), options=options)

        else:
            return json.dumps({"error": f"❌ Browser '{browser}' not supported."}, indent=4)

        request_count = 50
        for i in range(request_count):
            driver.get(results["url"])
            time.sleep(0.2)  # simulate real behavior

            # check if request limit is reached (429 Too Many Requests)
            try:
                error_message = driver.find_element(By.TAG_NAME, "pre").text
                if "429 Too Many Requests" in error_message:
                    results["rate_limited"] = True
                    results["rate_limit_at"] = i + 1
                    results["message"] = f"⚠️ Rate limit reached at request {i + 1}."
                    results["timestamp"]= datetime.datetime.now().isoformat()
                    break
            except:
                pass  # No error, continue sending requests

            results["requests_sent"] += 1

        if not results["rate_limited"]:
            results["message"] = "✅ No rate limit detected within 50 requests."
            results["timestamp"]= datetime.datetime.now().isoformat()

    except Exception as e:
        results = {"error": f"⚠️ Error: {str(e)}"}

    finally:
        if driver:
            driver.quit()

    return json.dumps(results, indent=4)  # Return JSON output

if __name__ == "__main__":
    print(test_request_limit("chrome"))  # Change to "firefox" for Firefox
