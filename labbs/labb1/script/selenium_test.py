import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

CURRENT_PATH = os.path.dirname(
                    os.path.dirname(
                        os.path.abspath(__file__)
                    )
                )

class PythonOrgSearch(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.driver = webdriver.Firefox()
    
    @classmethod
    def tearDownClass(self):
        self.driver.close()

    def test_open_page(self): #Testing whether page is open
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        self.assertIn("Wittier", self.driver.title)
        
    def test_write_in_text_box(self): #Testing whether we can write to the text box
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        self.assertEqual("Hello World!", text_box.get_attribute("value"))

    def test_send_posts(self): #Testing whether we can send a post, both using enter and the submit button
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        self.assertEqual("Hello World!", text_box.get_attribute("value"))    
        text_box.send_keys(Keys.RETURN)
        self.assertEqual("", text_box.get_attribute("value"))  
        self.assertEqual(len(self.driver.find_elements_by_id("post_0")), 1)
        
        submit = self.driver.find_element_by_id("submit")
        text_box.send_keys("Good Bye Cruel World!")
        submit.click()
        self.assertEqual(len(self.driver.find_elements_by_id("post_1")), 1)

    def test_send_empty(self): #Test whether we can send a empty post
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys(Keys.RETURN)
        self.assertEqual(self.driver.find_element_by_id("error_span").text, "Your message is too short!")
 
    def test_send_above_max(self): #Testing whether we can send a post with too many symbols
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!"*14)
        text_box.send_keys(Keys.RETURN)
        self.assertEqual(self.driver.find_element_by_id("error_span").text, "Your message is too long!")

    def test_chronoligical_order(self): #Testing whether posts are in chronological order
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        text_box.send_keys(Keys.RETURN)
        text_box.send_keys("Good Bye Cruel World!")
        text_box.send_keys(Keys.RETURN)

        latest_post = self.driver.find_elements_by_class_name("posts")[0]
        self.assertEqual(latest_post.find_element_by_tag_name("p").text  , "Good Bye Cruel World!")

    def test_read(self): #Test whether posts can be marked as read
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        text_box.send_keys(Keys.RETURN)
        text_box.send_keys("Good Bye Cruel World!")
        text_box.send_keys(Keys.RETURN)
        text_box.send_keys("It's Alive!")
        text_box.send_keys(Keys.RETURN)
        post = self.driver.find_element_by_id("post_1")
        check_box = self.driver.find_element_by_id("read_box_1")
        check_box.click()
        self.assertEqual(post.value_of_css_property("background-color"), "rgb(0, 128, 0)")

    def test_read_unread(self): #Test whether posts can be marked as read then marked as unread
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        text_box.send_keys(Keys.RETURN)
        text_box.send_keys("Good Bye Cruel World!")
        text_box.send_keys(Keys.RETURN)
        text_box.send_keys("It's Alive!")
        text_box.send_keys(Keys.RETURN)
        post = self.driver.find_element_by_id("post_1")
        check_box = self.driver.find_element_by_id("read_box_1")
        check_box.click()
        check_box.click()
        self.assertEqual(post.value_of_css_property("background-color"), "rgb(173, 216, 230)")

    def test_refresh(self): #Testing whether a refresh destroys all posts
        self.driver.get("file://"+CURRENT_PATH+"/version_jquery.html")
        text_box = self.driver.find_element_by_id("text_post")
        text_box.send_keys("Hello World!")
        text_box.send_keys(Keys.RETURN)
        self.driver.refresh()
        self.assertEqual(len(self.driver.find_elements_by_class_name("posts")), 0)

if __name__ == "__main__":
    unittest.main()
