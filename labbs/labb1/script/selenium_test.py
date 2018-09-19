import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class PythonOrgSearch(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.driver = webdriver.Firefox()
    
    @classmethod
    def tearDownClass(self):
        self.driver.close()

    def test_open_page(self):
        #Testing whether page is open
        
            self.driver.get("file:///home/spathatos/Projects/TDP013/labbs/labb1/version_jquery.html")
            self.assertIn("Wittier", self.driver.title)
        
        #Testing whether we can write to the text box
            text_box = self.driver.find_element_by_id("text_post")
            text_box.send_keys("Hello World!")
            self.assertEqual("Hello World!", text_box.get_attribute("value"))

    def test_send_posts(self):
        self.driver.get("file:///home/spathatos/Projects/TDP013/labbs/labb1/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        self.assertEqual("Hello World!", text_box.get_attribute("value"))    
        text_box.send_keys(Keys.RETURN)
        self.assertEqual(len(self.driver.find_elements_by_id("post_0")), 1)
        
        submit = self.driver.find_element_by_id("submit")
        


if __name__ == "__main__":
    unittest.main()
