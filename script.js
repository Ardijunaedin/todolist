//muat semua elemen HTML melalui DOM
document.addEventListener("DOMContentLoaded",function(){

    const submitForm = document.getElementById('form');

    submitForm.addEventListener('submit',function(event){
        event.preventDefault();
        addTodo();
    });
});

// implementasi fungsi addTodo
function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timeStamp = document.getElementById('date').value;
    
    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, timeStamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// implementasi fungsi generateID
const todos = [];
const RENDER_EVENT = 'render-todo';
function generateId() {
    return + new Date();
}

function generateTodoObject(id, task, timeStamp, isCompleted) {
    return {
        id,
        task,
        timeStamp,
        isCompleted
    }
}

//listener dari RENDER_EVENT
document.addEventListener(RENDER_EVENT,function () {
    // console.log(todos);
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    //menampilkan yang sudah dilakukan
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for(todoItem of todos){
        const todoElement = makeTodo(todoItem);
        uncompletedTODOList.append(todoElement);
//todo yang belum dikerjakan akan diletakkan pada “Yang harus dibaca”
        if(todoItem.isCompleted == false)
            uncompletedTODOList.append(todoElement);
        else
            completedTODOList.append(todoElement);
    }
});

//fungsi makeToDo
function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timeStamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item','shadow');
    container.append(textContainer);
    container.setAttribute('id','todo-${todoObject.id}')

    if(todoObject.isCompleted){
 
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function () {
            undoTaskFromCompleted(todoObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeTaskFromCompleted(todoObject.id);
        });
   
        container.append(undoButton, trashButton);
    } else {
   
   
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            addTaskToCompleted(todoObject.id);
        });
   
        container.append(checkButton);
    }
  
    return container;
}

// memindahkan todo dari rak “Yang harus dilakukan” ke “Yang sudah dilakukan”
function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if(todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// mencari todo dengan ID yang sesuai pada array todos
function findTodo(todoId) {
    for(todoItem of todos) {
        if(todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

//membuat fungsi hapus data
function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget,1);
        
    document.dispatchEvent(new Event(RENDER_EVENT));
    }

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
   for(index in todos){
       if(todos[index].id === todoId){
           return index
       }
   }
   return -1
}