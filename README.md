# todo-ng
This is a simple to-do web application written in AngularJS. The application communicates with a local MySQL server to perform various tasks such as creating new users, creating new to-dos, and updating a user's to-dos.

<img src="/../master/assets/img/result.PNG" width="80%">

The main goal of this project was to get familiar with GUI testing of Angular apps. I am using Protractor as end-to-end test framework and Jasmine as assertion framework, ie Jasmine provides a way to write assertions. I am testing the user specific page's layout during browser window size changes. When the window size changes for the smaller I make sure that the "add to-do" button is positioned on a separate row as opposed to being aligned right of the description form.

<img src="/../master/assets/img/rwd.PNG" width="80%">

### Project structure
```
.
+-- app
|   +-- account
|   +-- login
|   +-- register
|   +-- todo
+-- assets
|   +-- css
|   +-- img
|   +-- js
|   +-- libs
+-- tests
|   +-- e2e
|   |   +-- js
|   |   +-- login
|   |   +-- register
|   |   +-- todo
|   +-- protractor.config.js
+-- index.html
+-- Gruntfile.js
+-- package.json

```

