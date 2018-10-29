import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class WittierTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(self):   
        self.driver = webdriver.Firefox()
        
    @classmethod
    def tearDownClass(self):
        self.driver.close()


    def test_01_open_page(self): #Testing whether page is open
        self.driver.get('http://127.0.0.1:3000')
        self.assertIn("Wittier", self.driver.title)

    def test_02_register_success(self):
        self.driver.find_element_by_id("registerDisplayName").clear()
        self.driver.find_element_by_id("registerDisplayName").send_keys("Selenium Test Name")
        self.driver.find_element_by_id("registerUsername").clear()
        self.driver.find_element_by_id("registerUsername").send_keys("SeleniumTest")
        self.driver.find_element_by_id("registerPassword").clear()
        self.driver.find_element_by_id("registerPassword").send_keys("asdasd123")
        self.driver.find_element_by_id("registerConfirmedPassword").clear()
        self.driver.find_element_by_id("registerConfirmedPassword").send_keys("asdasd123")
        self.driver.find_element_by_id("registerSubmit") .send_keys(Keys.RETURN)
        
        WebDriverWait(self.driver, 10).until(
            EC.alert_is_present()
        )
        alertText = Alert(self.driver).text
        Alert(self.driver).accept()
        self.assertEqual("Successful Registration! Please login!", alertText)	

    def test_03_register_NotUniqueUsername(self):
        self.driver.find_element_by_id("registerDisplayName").clear()
        self.driver.find_element_by_id("registerDisplayName").send_keys("Selenium Test Name")
        self.driver.find_element_by_id("registerUsername").clear()
        self.driver.find_element_by_id("registerUsername").send_keys("SeleniumTest")
        self.driver.find_element_by_id("registerPassword").clear()
        self.driver.find_element_by_id("registerPassword").send_keys("asdasd123")
        self.driver.find_element_by_id("registerConfirmedPassword").clear()
        self.driver.find_element_by_id("registerConfirmedPassword").send_keys("asdasd123")
        self.driver.find_element_by_id("registerSubmit") .send_keys(Keys.RETURN)
        
        WebDriverWait(self.driver, 10).until(
            EC.alert_is_present()
        )
        alertText = Alert(self.driver).text
        Alert(self.driver).accept()
        self.assertEqual("notUniqueLoginName", alertText)	
        
        
    def test_04_login_fail(self):
        self.driver.find_element_by_id("loginUsername").clear()
        self.driver.find_element_by_id("loginUsername").send_keys("SeleniumTest")
        self.driver.find_element_by_id("loginPassword").clear()
        self.driver.find_element_by_id("loginPassword").send_keys("asdasd123")
        self.driver.find_element_by_id("loginSubmit").send_keys(Keys.RETURN) 
        


if __name__ == "__main__":
    unittest.main()
