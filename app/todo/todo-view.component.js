angular.module('todoView').component('todoView', {
    templateUrl: '../app/todo/todo-view.template.html',
    controller: function TodoViewController($rootScope, $location, accountService) {
        var self = this;
        var defaultColor = "#cccccc";
        var redColor = "#f44336";

        var currentUser = $rootScope.globals.currentUser;
        self.greeting = "Hello " + currentUser.username + "!";

        self.priority = Number(5);
        self.description = '';

        const startOfTime = new Date("0000-00-00 00:00:00");
        self.todos = [];

        self.addTodoBorderColor = defaultColor;
        self.addTodoInvalidMessage = "";

        // Get todos when page /todo is requested
        accountService.getTodos({
            username: currentUser.username, password: currentUser.password
        }).then(function (success) {
            if (success.message == 'access success') {
                updateListview(success.todos);
            }
            else if (success.message == 'access fail') {
                accountService.logout();
                $location.path('/login');
            }
        });

        // orderBy method..
        self.order = 'done';
        self.orderOptions = [
            { id: 'done', name: 'Relevance' },
            { id: 'priority', name: 'Priority' },
            { id: 'description', name: 'Alphabetical' },
            { id: 'addedAt', name: 'Added' }
        ];
        self.sortOrder = 'ascending';
        
        self.todoComparator = function (o1, o2) {
            var t1 = o1.value, t2 = o2.value;
            if (self.order == 'done') {
                if (t1.done == t2.done) {
                    return t1.priority < t2.priority ? -1 : 1;
                }
                // We want 'Not done' to always appear before 'Done'
                if (self.sortOrder == 'ascending') {
                    return t1.done < t2.done ? 1 : -1; 
                }
                else {
                    return t2.done < t1.done ? 1 : -1; 
                }
            }
            else if (self.order == 'priority') {
                return t1.priority < t2.priority ? -1 : 1;
            }
            else if (self.order == 'description') {
                return t1.description < t2.description ? -1 : 1;
            }
            else if (self.order == 'addedAt') {
                return t1.addedAt < t2.addedAt ? -1 : 1;
            }
            else {
                return t1.priority < t2.priority ? -1 : 1; 
            }
        };

        self.logout = function () {
            accountService.logout();
        }
        /** 
         * Adds a todo in database. Gets a todo object from database and the
         * controller updates the listview.
         */
        self.addTodo = function () {
            console.log("Adding todo...");
            if (self.priority && self.description) {
                self.addTodoBorderColor = defaultColor;
                self.addTodoInvalidMessage = "";

                var newTodo = { priority: self.priority, description: self.description };
                var user = { username: currentUser.username, password: currentUser.password };

                console.log("prio: " + self.priority + ", desc: " + self.description);

                accountService.addTodo({ user: user, todo: newTodo }).then(function (success) {
                    console.log(success);
                    if (success.message == 'add todo success') {
                        addTodo(success.todo);
                        updateListview(self.todos);
                    }
                    else if (success.message == 'access fail') {
                        accountService.logout();
                        $location.path('/login');
                    }

                    self.priority = Number(5);
                    self.description = '';
                });
            }
            else {
                self.addTodoBorderColor = redColor;
                self.addTodoInvalidMessage = "Description is missing";
            }
        }

        function getStatus(date) {
            // if date is undefined the to-do hasn't yet been done
            return (date !== startOfTime && (date instanceof Date && !isNaN(date.getTime())) ? 'Done' : 'Not done');
        }
        function updateListview(newList) {
            self.todos = [];
            for (var i = 0; i <= newList.length; i++) {
                var todo = newList[i];
                if (todo) {
                    addTodo(todo);

                    // Needs to be const, otherwise each todo element gets last index as value
                    const idx = i;
                    self.todos[idx].toggleTodo = function () {
                        console.log("Toggling todo at index " + idx);
                        toggleTodo(idx, self.todos[idx]);
                    }
                    self.todos[idx].editTodo = function () {
                        console.log("Editing todo at index " + idx);
                        editTodo(idx, self.todos[idx]);
                    }
                    self.todos[idx].deleteTodo = function () {
                        console.log("Deleting todo at index " + idx);
                        deleteTodo(idx, self.todos[idx]);
                    }

                    self.todos[idx].tmp_priority = self.todos[idx].priority;
                    self.todos[idx].tmp_description = self.todos[idx].description;
                }
            }
        }

        /* Adds a new todo to the list view */
        function addTodo(aTodo) {
            // Named my col fields in db to: 'todo_id', 'done_at', 'added_at' ->
            // differs from my variable names here.. (alt sol.: could rename the variables)
            var accountId = aTodo.account_id ? aTodo.account_id : aTodo.accountId;
            var todoId = aTodo.todo_id ? aTodo.todo_id : aTodo.todoId;
            var doneAt = aTodo.done_at ? aTodo.done_at : aTodo.doneAt;
            var addedAt = aTodo.added_at ? aTodo.added_at : aTodo.addedAt;

            self.todos.push({
                accountId: Number(accountId),
                todoId: Number(todoId), priority: Number(aTodo.priority),
                description: aTodo.description, done: getStatus(new Date(doneAt)),
                doneAt: new Date(doneAt), addedAt: new Date(addedAt)
            });
        }

        /* Toggles todo's Done-button */
        function toggleTodo(listIndex, todoToBeToggled) {
            var user = { username: currentUser.username, password: currentUser.password };
            accountService.toggleTodo({ user: user, todo: todoToBeToggled }).then(function (success) {
                console.log(success);
                if (success.message == 'toggle todo success') {
                    var aTodo = success.todo;
                    self.todos[listIndex].doneAt = new Date(aTodo.done_at);
                    self.todos[listIndex].done = getStatus(new Date(aTodo.done_at));
                    console.log(self.todos[listIndex]);
                }
                else if (success.message == 'toggle todo fail') {
                    console.log(success.message); // Notify user
                }
                else if (success.message == 'get todo fail') {
                    console.log(success.message); // Notify user
                }
                else if (success.message == 'access fail') {
                    accountService.logout();
                    $location.path('/login');
                }
            });
        }

        function editTodo(listIndex, todoToBeEdited) {
            todoToBeEdited.priority = todoToBeEdited.tmp_priority;
            todoToBeEdited.description = todoToBeEdited.tmp_description;
        
            var user = { username: currentUser.username, password: currentUser.password };
            accountService.editTodo({ user: user, todo: todoToBeEdited }).then(function (success) {
                console.log(success);
                if (success.message == 'edit todo success') {
                    var aTodo = success.todo;
                    self.todos[listIndex].priority = Number(aTodo.priority);
                    self.todos[listIndex].description = aTodo.description;

                    console.log(self.todos[listIndex]);
                }
                else if (success.message == 'edit todo fail') {
                    console.log(success.message); // Notify user
                }
                else if (success.message == 'get todo fail') {
                    console.log(success.message); // Notify user
                }
                else if (success.message == 'access fail') {
                    accountService.logout();
                    $location.path('/login');
                }
            });
        }

        /* Deletes todo */
        function deleteTodo(listIndex, todoToBeDeleted) {
            var user = { username: currentUser.username, password: currentUser.password };
            accountService.deleteTodo({ user: user, todo: todoToBeDeleted }).then(function (success) {
                console.log(success);
                if (success.message == 'delete todo success') {
                    self.todos.splice(listIndex, 1);
                    updateListview(self.todos); // Update all indices
                }
                else if (success.message == 'delete todo fail') {
                    // Notify user
                }
                else if (success.message == 'access fail') {
                    accountService.logout();
                    $location.path('/login');
                }
            });
        }
    }
});
