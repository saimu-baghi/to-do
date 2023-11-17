document.addEventListener('DOMContentLoaded', function () {
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo');

    addTodoButton.addEventListener('click', function () {
        const newTodoTitle = newTodoInput.value;
        if (newTodoTitle.trim() !== '') {
            addTodo(newTodoTitle);
            newTodoInput.value = '';
        }
    });

    function addDeleteButton(todo) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'x';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            deleteTodo(todo.id);
        });
        return deleteButton;
    }

    function addCompleteCheckbox(todo) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todo-checkbox');
        checkbox.checked = todo.completed;
        // checkbox.addEventListener('change', function () {
        //     updateTodoStatus(todo.id, checkbox.checked);
        // });
        return checkbox;
    }

    function addTodo(title) {
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                completed: false,
            }),
        })
            .then(response => response.json())
            .then(todo => {
                displayTodo(todo);
            })
            .catch(error => console.error('Error adding todo:', error));
    }

    function deleteTodo(todoId) {
        fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    removeTodoFromUI(todoId);
                } else {
                    throw new Error('Failed to delete');
                }
            })
            .catch(error => console.error('Error deleting todo:', error));
    }

    function updateTodoStatus(todoId, completed) {
        fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: completed,
            }),
        })
            .then(response => {
                if (response.ok) {
                    updateTodoUI(todoId, completed);
                } else {
                    throw new Error('Failed to update status');
                }
            })
            .catch(error => console.error('Error updating todo status:', error));
    }

    function removeTodoFromUI(todoId) {
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        if (todoItem) {
            todoItem.remove();
        }
    }

    function updateTodoUI(todoId, completed) {
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        if (todoItem) {
            const checkbox = todoItem.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = completed;
            }
        }
    }

    function displayTodo(todo) {
        const todoItem = document.createElement('li');
        todoItem.setAttribute('data-id', todo.id);

        const deleteButton = addDeleteButton(todo);
        todoItem.appendChild(deleteButton);

        const checkbox = addCompleteCheckbox(todo);
        todoItem.appendChild(checkbox);

        const taskText = document.createElement('span');
        taskText.textContent = todo.title;
        todoItem.appendChild(taskText);

        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                taskText.style.textDecoration = 'line-through';
            } else {
                taskText.style.textDecoration = 'none';
            }
            updateTodoStatus(todo.id, checkbox.checked);
        });

        if (todo.completed) {
            checkbox.checked = true;
            taskText.style.textDecoration = 'line-through';
        }

        // Insert the new todo item at the beginning of the list
        if (todoList.firstChild) {
            todoList.insertBefore(todoItem, todoList.firstChild);
        } else {
            todoList.appendChild(todoItem);
        }

    }

    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => {
                displayTodo(todo);
            });
        })
        .catch(error => console.error('Error fetching todos:', error));
});