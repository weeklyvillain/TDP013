import unittest
import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


USERNAME = "SeleniumTest"
PASSWORD = "asdasd123"

class WittierTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(self):   
        self.driver = webdriver.Firefox()
        
    @classmethod
    def tearDownClass(self):
        self.driver.close()


    def test_01_open_page(self): #Testing whether page is open
        self.driver.get('http://localhost:3000/')
        self.assertIn("Wittier", self.driver.title)

    def test_02_register_success(self):
        self.driver.find_element_by_id("registerDisplayName").clear()
        self.driver.find_element_by_id("registerDisplayName").send_keys("Selenium Test Name")
        self.driver.find_element_by_id("registerUsername").clear()
        self.driver.find_element_by_id("registerUsername").send_keys(USERNAME)
        self.driver.find_element_by_id("registerPassword").clear()
        self.driver.find_element_by_id("registerPassword").send_keys(PASSWORD)
        self.driver.find_element_by_id("registerConfirmedPassword").clear()
        self.driver.find_element_by_id("registerConfirmedPassword").send_keys(PASSWORD)
        self.driver.find_element_by_id("registerSubmit").click()
        
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
        self.driver.find_element_by_id("registerUsername").send_keys(USERNAME)
        self.driver.find_element_by_id("registerPassword").clear()
        self.driver.find_element_by_id("registerPassword").send_keys(PASSWORD)
        self.driver.find_element_by_id("registerConfirmedPassword").clear()
        self.driver.find_element_by_id("registerConfirmedPassword").send_keys(PASSWORD)
        self.driver.find_element_by_id("registerSubmit").click()
        
        WebDriverWait(self.driver, 10).until(
            EC.alert_is_present()
        )

        alertText = Alert(self.driver).text
        Alert(self.driver).accept()
        self.assertEqual("notUniqueLoginName", alertText)	
        
    def test_04_login_fail(self):
        self.driver.find_element_by_id("loginUsername").clear()
        self.driver.find_element_by_id("loginUsername").send_keys(USERNAME)
        self.driver.find_element_by_id("loginPassword").clear()
        self.driver.find_element_by_id("loginPassword").send_keys(PASSWORD[0:-4])
        self.driver.find_element_by_id("loginSubmit").click()

        WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.ID, "wrongComb"), "Wrong Username/Password combination")
        )
        
        self.assertEqual(self.driver.find_element_by_id("wrongComb").text, "Wrong Username/Password combination")

    def test_05_login_success(self):
        self.driver.find_element_by_id("loginUsername").clear()
        self.driver.find_element_by_id("loginUsername").send_keys(USERNAME)
        self.driver.find_element_by_id("loginPassword").clear()
        self.driver.find_element_by_id("loginPassword").send_keys(PASSWORD)
        self.driver.find_element_by_id("loginSubmit").click() 
        self.assertEqual("http://localhost:3000/"+USERNAME, self.driver.current_url)

    def test_06_send_post_fail(self):
        self.driver.find_element_by_id("postForm").send_keys("a"*140)
        self.driver.find_element_by_id("postForm").send_keys("a"*140)
        self.assertEqual(self.driver.find_element_by_id("postForm").get_attribute('value'), "a"*140)

    def test_07_send_post_success(self):
        self.driver.find_element_by_id("postForm").clear()
        self.driver.find_element_by_id("postForm").send_keys("Goodbye Cruel World!")
        self.driver.find_element_by_id("postSubmit").click()
        self.assertEqual(len(self.driver.find_elements_by_xpath("//*[contains(., 'Goodbye Cruel World!')]")), 7)

    def test_08_search_fail(self):
        pass

    def test_09_search_success(self):    
        pass

    def test_10_add_friend_success(self):    
        pass

    def test_11_add_friend_fail(self):    
        pass


if __name__ == "__main__":
    unittest.main()
