// ================= GET HTML ELEMENTS =================

// input box where user types task
const input = document.querySelector("#input");

// button to add task
const btn = document.querySelector("#btn");

// ul list where tasks will appear
const list = document.querySelector("#list");

// counter display (total / done)
const counter = document.querySelector("#counter");

// button to clear all tasks
const clearBtn = document.querySelector("#clear");


// ================= DATA STORAGE =================

// array to store all tasks in memory
let tasks = [];


// ================= LOAD SAVED DATA =================

// get saved tasks from browser storage
const saved = localStorage.getItem("tasks");

// if data exists in storage
if (saved) {

    // convert string → array of objects
    tasks = JSON.parse(saved);

    // loop through each saved task
    tasks.forEach(task => {

        // create UI for each task
        createTask(task);
    });
}

// update counter after loading
updateCounter();


// ================= ADD TASK =================

// when user clicks add button
btn.onclick = addTask;


// function to add new task
function addTask() {

    // get user input and remove spaces
    const text = input.value.trim();

    // stop if input is empty
    if (text === "") return;

    // check if task already exists
    const exists = tasks.some(t => t.text === text);

    // if duplicate found
    if (exists) {
        alert("Task already exists!");
        return;
    }

    // create task object
    const taskObj = {
        text: text,   // task text
        done: false   // default not completed
    };

    // add task to array
    tasks.push(taskObj);

    // save to localStorage
    save();

    // show task on screen
    createTask(taskObj);

    // clear input field
    input.value = "";

    // update counter
    updateCounter();
}


// ================= CREATE TASK UI =================

// function to create task in UI
function createTask(taskObj) {

    // create list item (li)
    const li = document.createElement("li");

    // create span for text
    const span = document.createElement("span");

    // set task text
    span.textContent = taskObj.text;

    // if task was already done (after refresh)
    if (taskObj.done) {

        // add line-through style
        span.classList.add("done");
    }

    // when user clicks task text
    span.onclick = function () {

        // toggle done state (true/false)
        taskObj.done = !taskObj.done;

        // toggle visual style
        span.classList.toggle("done");

        // save changes
        save();

        // update counter
        updateCounter();
    };


    // create delete button
    const del = document.createElement("button");

    // set button text
    del.textContent = "Delete";

    // when delete button clicked
    del.onclick = function () {

        // remove from UI
        li.remove();

        // remove from array
        tasks = tasks.filter(t => t.text !== taskObj.text);

        // save updated data
        save();

        // update counter
        updateCounter();
    };

    // add span into li
    li.appendChild(span);

    // add delete button into li
    li.appendChild(del);

    // add li into ul list
    list.appendChild(li);
}


// ================= SAVE TO LOCAL STORAGE =================

// function to save data
function save() {

    // convert array → string and store
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ================= COUNTER =================

// function to update total and done tasks
function updateCounter() {

    // total tasks
    const total = tasks.length;

    // completed tasks
    const done = tasks.filter(t => t.done).length;

    // show in UI
    counter.textContent = `Total: ${total} | Done: ${done}`;
}


// ================= CLEAR ALL TASKS =================

// when clear button clicked
clearBtn.onclick = function () {

    // empty array
    tasks = [];

    // remove from storage
    localStorage.removeItem("tasks");

    // clear UI
    list.innerHTML = "";

    // update counter
    updateCounter();
};


// ================= FILTER FUNCTIONS =================

// show all tasks
function showAll() {
    document.querySelectorAll("li").forEach(li => {
        li.style.display = "flex";
    });
}

// show only done tasks
function showDone() {
    document.querySelectorAll("li").forEach(li => {
        const span = li.querySelector("span");
        li.style.display = span.classList.contains("done") ? "flex" : "none";
    });
}

// show only active tasks
function showActive() {
    document.querySelectorAll("li").forEach(li => {
        const span = li.querySelector("span");
        li.style.display = span.classList.contains("done") ? "none" : "flex";
    });
}


// ================= ENTER KEY SUPPORT =================

// when user presses keyboard
input.addEventListener("keydown", function (e) {

    // if Enter key pressed
    if (e.key === "Enter") {

        // run add task function
        addTask();
    }
});