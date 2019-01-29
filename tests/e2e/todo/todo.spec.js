/** Created by Jonas Eiselt on 2019-01-22. */
var TodoPage = require("../todo/todo.po");
var ElementAsserter = require("../js/element-asserter");
var RwdAsserter = require("../js/rwd-asserter");

describe("Todo test suite", function () {

    var todoPage = new TodoPage();
    var elementAsserter = new ElementAsserter();
    var rwdAsserter = new RwdAsserter();

    var screenSize = { width: 0, height: 0 };
    it("should display todo page", function () {
        todoPage.get("jonazeiselt", "123"); // this has to be correct!
        expect(browser.getCurrentUrl()).toBe(todoPage.getUrl());

        // Maximize window
        browser.driver.manage().window().maximize();
        browser.driver.manage().window().getSize().then(function (size) {
            screenSize.width = size.width;
            screenSize.height = size.height;
        });
    });

    it("testing the panel for adding a todo ", async function () {
        var elements = [todoPage.priorityInput, todoPage.descriptionInput, todoPage.addTodoButton];

        // Is there an add-todo button?
        console.log("\nassertDisplayed");
        await elementAsserter.assertDisplayed(todoPage.addTodoButton, true);

        // Are the elements placed on the same row, next to each other (-> no collision)?
        console.log("assertOnSameRow");
        var allowedPixelOffset = 2;
        await rwdAsserter.assertOnSameRow(elements, allowedPixelOffset);

        console.log("assertNoOverlapping");
        await rwdAsserter.assertNoOverlapping(elements);

        // When width is 780 px or lower the add-to-do button is displayed on a separate row
        browser.driver.manage().window().setSize(780, screenSize.height);

        // Is the add-todo-button displayed on a separate row, directly beneath the two inputs?
        console.log("assertNotOnSameRow");
        await rwdAsserter.assertNotOnSameRow(elements, 0);
        await rwdAsserter.assertNoOverlapping(elements);

        // Maximize window
        browser.driver.manage().window().maximize();
        var layoutObjs = [
            // input positioned to the left of layout[1]
            { layout: todoPage.priorityInput, toLeftOf: [1, 2] },
            // input positioned to the right of layout[0]
            { layout: todoPage.descriptionInput, toRightOf: [0], toLeftOf: [2] },
            // button positioned to the right of layout[1]
            { layout: todoPage.addTodoButton, toRightOf: [0,1] }
        ];
        await rwdAsserter.assertLayout(layoutObjs);

        // When width is 780 px or lower the add-to-do button is displayed on a separate row
        browser.driver.manage().window().setSize(780, screenSize.height);

        var layoutObjs = [
            // input positioned on top of layout[2], to the left of layout[1]
            { layout: todoPage.priorityInput, onTopOf: [2], toLeftOf: [1] },
            // input positioned on top of layout[2], to the right of layout[0]
            { layout: todoPage.descriptionInput, onTopOf: [2], toRightOf: [0] },
            // button positioned below of layout[0] and [1], same start x-value as layout[0] and same end x-value as layout[1]
            { layout: todoPage.addTodoButton, belowOf: [0,1], start_toStartOf: [0], end_toEndOf: [1] }
        ];
        await rwdAsserter.assertLayout(layoutObjs);

        //browser.driver.manage().window().maximize();
        //browser.driver.manage().window().setPosition(x, y);
    });
});