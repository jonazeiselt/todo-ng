# todo-ng
This is a simple to-do web application written in AngularJS. The application communicates with a local MySQL server to perform various tasks such as creating new users, creating new to-dos, and updating a user's to-dos.
\
\
<img src="/../master/assets/img/result.PNG" width="80%">
\
\
The main goal of this project was to get familiar with GUI testing of Angular apps. I am using Protractor as end-to-end test framework and Jasmine as assertion framework. In other words, Jasmine provides a way to write assertions. I am testing the user specific page's layout during browser window size changes. When the window size changes for the smaller I make sure that the "add to-do" button is positioned on a separate row as opposed to being aligned right of the description form.
\
\
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

### GUI testing
...

#### Testing layout
In my user specific spec file (tests/e2e/todo/todo.spec.js) I have defined several test cases. One of them tests the layout whenever the window size changes for the smaller. I have included a css rule that the "add to-do" button should position itself on a separate row whenever the screen-width is 780 px and lower. 

tests/e2e/todo/todo.spec.js
```javascript
var RwdAsserter = require("../js/rwd-asserter");
...
var rwdAsserter = new RwdAsserter();
...

let size = await browser.driver.manage().window().getSize();
var screenHeight = size.height;
       
// When width is 780 px or lower the add-to-do button is displayed on a separate row
// according to defined css rules
browser.driver.manage().window().setSize(780, screenHeight);

var layoutObjs = [
  // input positioned on top of layoutObjs[2], to the left of layoutObjs[1]
  { layout: todoPage.priorityInput, onTopOf: [2], toLeftOf: [1] },
  // input positioned on top of layoutObjs[2], to the right of layoutObjs[0]
  { layout: todoPage.descriptionInput, onTopOf: [2], toRightOf: [0] },
  // button positioned below of layoutObjs[0] and [1], same start x-value as layoutObjs[0] 
  // and same end x-value as layoutObjs[1]
  { layout: todoPage.addTodoButton, belowOf: [0,1], start_toStartOf: [0], end_toEndOf: [1] }
];
await rwdAsserter.assertLayout(layoutObjs);

```
As can be seen in the code example above, I am creating an array filled with objects containing the actual web element (web element retrieved via the page object todo.po.js) and some requirement for it to fulfill. For instance, looking at the last object in `layoutObjs` in above code example we can see the requirements (object fields) `belowOf`, `start_toStartOf`, and `end_toEndOf`. In the rwdAsserter's assertLayout method these requirements are being checked. 

Before proceeding, if we try to play with the mind and check if the last object's requirements are fullfilled based on the first picture, we find them indeed to be true. The web element `todoPage.addTodoButton` has to be positioned below web elements `todoPage.priorityInput` and `todoPage.descriptionInput` which it is (`belowOf: [0,1]` where 0 and 1 are layoutObjs' indices, eg `layoutObjs[0]`). The button does also has to start where the priority input starts (same x start value) which looks right on the picture. Lastly the button has to end where the description input ends (same x end value) which also looks like it does. 

The main implementation of the assertLayout method can be found in the following code example.

tests/e2e/js/rwd-asserter.js
```javascript

this.assertLayout = async function (layoutObjs) {
  for (var i = 0; i < layoutObjs.length; i++) {
    var layoutObj = layoutObjs[i];
    // Go through the object's fields
    for (var property in layoutObj) {
      if (layoutObj.hasOwnProperty(property)) {
        var elements = [];
        if (property !== "layout") {
          // This will loop through indices associated with param layoutObjs
          for (var idx in layoutObj[property]) {
            let val = (layoutObj[property])[idx];
            elements.push(layoutObjs[val].element);
          }
        }

        switch (property) {
          case "onTopOf":
            // Make sure that element in layoutObj is placed on top of each element in elements
            await this.assertElementOnTopOf(layoutObj.element, elements);
            break;
          case "belowOf":
            // Make sure that element in layoutObj is placed below each element in elements
            await this.assertElementBelowOf(layoutObj.element, elements);
            break;
          case "toLeftOf":
            // Make sure that element in layoutObj is placed to the left of each element in elements
            await this.assertElementToLeftOf(layoutObj.element, elements);
            break;
          case "toRightOf":
            // Make sure that element in layoutObj is placed to the right of each element in elements
            await this.assertElementToRightOf(layoutObj.element, elements);
            break;
          case "start_toStartOf":
            // Make sure that element in layoutObj is placed in the beginning of each element in elements
            await this.assertElementStartToStartOf(layoutObj.element, elements);
            break;
          case "end_toEndOf":
            // Make sure that element in layoutObj ends at the end of each element in elements
            await this.assertElementEndToEndOf(layoutObj.element, elements);
            break;
        }
      }
    }
  }
};

```
