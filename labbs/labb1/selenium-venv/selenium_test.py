import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys


class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()

    def test_open_page(self):
        driver = self.driver
        driver.get("file:///home/spathatos/Projects/TDP013/labbs/labb1/index.html")
        self.assertIn("Wittier", driver.title)

    def tearDown(self): 
        self.driver.close()

if __name__ == "__main__":
    unittest.main()