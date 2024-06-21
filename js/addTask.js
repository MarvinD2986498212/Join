let task = [];
let subtasks = [];
let subtaskCounter = 0;

let prios = ["Low", "Medium", "Urgent"];
let prioValue = null;

let selectedTaskContacts = [];

/**
 * Onload Function for the Add Task page
 */
async function onLoadAddTask() {
  await includeHTML();
  updateHeaderInitials();
  document.getElementById("closeButton").style.display = "none";
  contacts = await loadData("contacts");
  boardTasks = await loadData("boardtasks");
  loadContactList();
  prioChoose(1); //pre-selected medium
  // minimum date for new tasks is today
  document.getElementById("date").min = new Date().toLocaleDateString("fr-ca");
  listenToEnterButtonAtSubtaskInputField();
}

function searchContacts() {
  let search = document
    .getElementById("assignedContactsInputField")
    .value.toLowerCase();
  let allContacts = document.querySelectorAll(".contactWrapperItem");

  if (search.length >= 1) {
    //filter
    contactQuery(search, allContacts);
  } else {
    // show all
    loadContactList();
  }
}

async function contactQuery(search, allContacts) {
  allContacts.forEach((container) => {
    let username = container
      .querySelector("#userNameInList")
      .innerText.toLowerCase();

    if (username.includes(search)) {
      container.style.display = "flex";
    } else {
      container.style.display = "none";
    }
  });
}

function listenToEnterButtonAtSubtaskInputField() {
  let inputField = document.getElementById("subtaskInput");
  inputField.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      // Do work
      let inputValue = inputField.value;

      if (inputValue) {
        // nur wenn was drinsteht
        document.getElementById("subtaskList").innerHTML +=
          renderSubtaskListEntry(inputValue, subtaskCounter);

        // clean up
        inputField.value = "";
        subtaskCounter++;
      }
    }
  });
}

function listenToEnterButtonAtSubtaskInputEditField(subtaskCounter) {
  let inputField = document.getElementById(`subtaskInput${subtaskCounter}`);
  inputField.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      // Do work
      saveEdittedSubtask(subtaskCounter);
    }
  });
}

function renderSubtaskListEntry(inputValue, subtaskCounter) {
  return `
        <li id="subtask${subtaskCounter}">
        <div class="listEntry">
          <span class="listEntrySpan" id="listEntry${subtaskCounter}">${inputValue}</span>
          <div>
            <img src="./assets/img/subtaskPen.svg" onclick="showEditSubtask(${subtaskCounter})">
            <img src="./assets/img/subtaskBasket.svg" onclick="deleteSubtask(${subtaskCounter})">
          </div>
        </div>
      </li>`;
}

function deleteSubtask(i) {
  let subtask = document.getElementById(`subtask${i}`);
  document.getElementById("subtaskList").removeChild(subtask);
}

function showEditSubtask(subtaskCounter) {
  let value = document.getElementById(`listEntry${subtaskCounter}`).innerHTML;
  document.getElementById(`subtask${subtaskCounter}`).innerHTML = `
              <div class="subtaskInputField">
                <input id="subtaskInput${subtaskCounter}" value="${value}" form="" class="subtaskEdit" onblur="saveEdittedSubtask(${subtaskCounter})">
              </div>
              `;

  document.getElementById(`subtaskInput${subtaskCounter}`).focus();
  // set cursor correct
  document.getElementById(`subtaskInput${subtaskCounter}`).selectionStart =
    document.getElementById(`subtaskInput${subtaskCounter}`).value.length;
  document.getElementById(`subtaskInput${subtaskCounter}`).selectionEnd =
    document.getElementById(`subtaskInput${subtaskCounter}`).value.length;

  listenToEnterButtonAtSubtaskInputEditField(subtaskCounter);
}

function saveEdittedSubtask(subtaskCounter) {
  let inputValue = document.getElementById(
    `subtaskInput${subtaskCounter}`
  ).value;

  if (inputValue) {
    document.getElementById(`subtask${subtaskCounter}`).innerHTML = `
        <div class="listEntry">
          <span class="listEntrySpan" id="listEntry${subtaskCounter}">${inputValue}</span>
          <div>
            <img src="./assets/img/subtaskPen.svg" onclick="showEditSubtask(${subtaskCounter})">
            <img src="./assets/img/subtaskBasket.svg" onclick="deleteSubtask(${subtaskCounter})">
          </div>
        </div>
`;
  } else {
    // emptry string
    deleteSubtask(subtaskCounter);
  }
}

function toggleContactList() {
  document.getElementById("contactList").classList.toggle("dNone");
}

function extractSubtasksForTask() {
  let subtasks = [];
  let list = document.querySelectorAll(".listEntrySpan");

  for (let index = 0; index < list.length; index++) {
    const element = list[index];

    subtasks.push(element.innerHTML);
  }

  return subtasks;
}

/**
 *  function to load the contact list with all saved contacts
 */
function loadContactList() {
  // sort contacts by first name
  sortContacts();
  let contactWrapper = document.getElementById("contactList");
  contactWrapper.innerHTML = "";

  // first shown contact: logged in user
  let idOfLoggedInUser = getIdOfLoggedInUser();

  // nur wenns kein Gast ist
  if (idOfLoggedInUser !== undefined) {
    contactWrapper.innerHTML += renderContactWrapper(
      contacts[idOfLoggedInUser],
      idOfLoggedInUser
    );
    // add: ME
    document.getElementById("userNameInList").innerHTML += " (Me)";
  }

  for (let i = 0; i < contacts.length; i++) {
    if (i != idOfLoggedInUser) {
      const element = contacts[i];
      contactWrapper.innerHTML += renderContactWrapper(element, i);
    }
  }
}

/**
 * function to load all selected Contacts for new task
 */
function selectContacts(i) {
  if (selectedTaskContacts.indexOf(contacts[i]) == -1) {
    selectedTaskContacts.push(contacts[i]);
    console.log(selectedTaskContacts);
  } else {
    selectedTaskContacts.splice(selectedTaskContacts.indexOf(contacts[i]), 1);
    console.log(selectedTaskContacts);
  }
  loadContacts();
}

function visitBoard() {
  window.location = "board.html";
}

function loadContacts() {
  let sContacts = document.getElementById("selectedContacts");

  sContacts.innerHTML = "";

  for (let i = 0; i < selectedTaskContacts.length; i++) {
    const element = selectedTaskContacts[i];
    sContacts.innerHTML += renderSelectedContacts(element);
  }
}

/**
 * Function to select the priority
 */
function prioChoose(i) {
  if (prioValue === i) {
    prioValue = null;
    resetPrioContainers();
  } else {
    prioValue = i;
    resetPrioContainers();
    if (prioValue === 2) {
      document.getElementById("prio high").classList.add("highPrioBackground");
      document
        .getElementById("highPrioImg")
        .classList.add("highPrioImageChange");
    }
    if (prioValue === 1) {
      document.getElementById("prio med").classList.add("medPrioBackground");
      document.getElementById("medPrioImg").classList.add("medPrioImageChange");
    }
    if (prioValue === 0) {
      document.getElementById("prio low").classList.add("lowPrioBackground");
      document.getElementById("lowPrioImg").classList.add("lowPrioImageChange");
    }
  }
}

/**
 * Function to reset the priority
 */
function resetPrioContainers() {
  document.getElementById("prio high").classList.remove("highPrioBackground");
  document
    .getElementById("highPrioImg")
    .classList.remove("highPrioImageChange");
  document.getElementById("prio med").classList.remove("medPrioBackground");
  document.getElementById("medPrioImg").classList.remove("medPrioImageChange");
  document.getElementById("prio low").classList.remove("lowPrioBackground");
  document.getElementById("lowPrioImg").classList.remove("lowPrioImageChange");
}

/**
 * function for bringing together all data from the input fields
 */
async function addTask(column) {
  subtasks = extractSubtasksForTask();
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("date").value;
  let prio = prios[prioValue];
  let category = document.getElementById("category").value;
  let taskCategory = [];

  switch (column) {
    case 1:
      taskCategory = "todo";
      break;
    case 2:
      taskCategory = "progress";
      break;
    case 3:
      taskCategory = "feedback";
      break;
    default:
      taskCategory = "todo";
  }

  let data = generateDataForTask(
    title,
    description,
    date,
    prio,
    category,
    taskCategory
  );
  boardTasks.push(data);
  // update firebase
  await putData("boardtasks", boardTasks);
  // zur board seite
  visitBoard();
}

function generateDataForTask(
  title,
  description,
  date,
  prio,
  category,
  taskCategory
) {
  // Create JSON
  let data = {
    title: title,
    description: description,
    subtasks: [],
    finishedSubtasks: 0,
    assignedTo: [],
    type: category,
    priority: prio,
    dueDate: date,
    category: taskCategory,
  };

  /*contacts!*/
  for (let index = 0; index < selectedTaskContacts.length; index++) {
    const contact = selectedTaskContacts[index];
    let json = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      profileColor: contact.profileColor,
    };
    data.assignedTo.push(json);
  }

  /*subtasks*/
  for (let index = 0; index < subtasks.length; index++) {
    const subtask = subtasks[index];
    let json = {
      subtaskText: subtask,
      complete: false,
    };
    data.subtasks.push(json);
  }

  return data;
}
