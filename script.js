let draggedCard=null;
let selectedCard=null;
const menu = document.getElementsByClassName("context-menu")[0];

function addTask(columnId){
    const input = document.getElementById(columnId+"-input");
    const taskText= input.value.trim();//trim is used voh pehle aur aakhri space ko trim karta hai toh isse ye hoga ki agar user space karke input karta hai toh voh input list mein add nahi hoga kyuki usko trim karne ke baad voh null hi consider karega na aur null ke liya neecha condition laga rakhi hai 

    if(taskText === ""){
        return;
    }

        const taskElement = createTaskElement(taskText);
        document.getElementById(columnId+"-tasks").appendChild(taskElement);
        updateLocalStorage();
        input.value="";
    
    }
    function createTaskElement(taskText){
    const taskElement= document.createElement("div") 
    taskElement.textContent= taskText;
    taskElement.classList.add("card");
    taskElement.setAttribute("draggable","true");

    taskElement.addEventListener("dragstart", dragStart);
    taskElement.addEventListener("dragend", dragEnd);

    taskElement.addEventListener("contextmenu", function(e){
        e.preventDefault();

        selectedCard = this;

        menu.style.display = "block";
        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY + "px";
  });

    return taskElement;
    }

  function dragStart(){
    this.classList.add("dragging");
    draggedCard=this;
  }
  function dragEnd(){
    this.classList.remove("dragging");
    draggedCard=null;
    updateLocalStorage();
  }

  const columns = document.querySelectorAll(".column .tasks");

  columns.forEach((column)=>{
    column.addEventListener("dragover", dragOver);
  });

  function dragOver(e){
    e.preventDefault();
    this.appendChild(draggedCard);
  }

  document.addEventListener("click",function(e){
    menu.style.display="none";
  });

  function editElement (){

    if(!selectedCard) return;

    const newText=prompt("edit text-");
    newText=newText.trim();

    if(newText!==""){
    selectedCard.textContent=newText;
    updateLocalStorage();
    } 

    menu.style.display = "none";
  }

  function deleteElement(){

    if(!selectedCard) return;

    selectedCard.remove();
    updateLocalStorage();

    menu.style.display = "none";
  }

function updateLocalStorage() {

    const boardData = {};

    const columns = document.querySelectorAll(".column");

    columns.forEach(column => {

        const columnId = column.id;
        const tasks = [];

        column.querySelectorAll(".card").forEach(card => {
            tasks.push(card.textContent);
        });

        boardData[columnId] = tasks;
    });

    localStorage.setItem("kanbanBoard", JSON.stringify(boardData));
}

function loadTasksFromLocalStorage() {

    const savedData = localStorage.getItem("kanbanBoard");

    if (!savedData) return;

    const boardData = JSON.parse(savedData);

    Object.keys(boardData).forEach(columnId => {

        const column = document.getElementById(columnId + "-tasks");

        boardData[columnId].forEach(taskText => {

            const taskElement = createTaskElement(taskText);
            column.appendChild(taskElement);

        });
    });
}

document.addEventListener("DOMContentLoaded", function(){
    loadTasksFromLocalStorage();
});