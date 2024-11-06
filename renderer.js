/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const host = "vps.klimdanick.nl:8080";
let selected = "";
let title;
let note;
let user;

function select(el) {
  selected = document.getElementById(el);
  console.log(selected);
}

window.onload = () => {
  user = localStorage.getItem('user');
  if (!user) {
    let a = document.getElementById("login-redirect")
    if (a) a.click()
  } else {
    let a = document.getElementById("index-redirect")
    if (a) a.click()
  }


  buildNote();

  buildNav();
}

async function buildNote() {
  title = document.createElement("textarea");
  title.id = "title";
  title.placeholder = "TITLE";
  title.setAttribute("spellcheck", false);
  document.getElementById("notePlane").appendChild(title);
  title.addEventListener('input', updateContent, false);

  note = document.createElement("textarea");
  note.id = "note";
  note.placeholder = "TEXT";
  note.setAttribute("spellcheck", false);
  document.getElementById("notePlane").appendChild(note);
  note.addEventListener('input', updateContent, false);
}

async function buildNav() {
  let nav = document.getElementById("notesList")

  let notes = await fetch(`http://${host}/api/notes?username=${user}`).then(response => response.json())
  console.log(notes);
  nav.innerHTML = ""
  notes.forEach(element => {
    let note = document.createElement("div")
    note.classList.add("notePreview")
    nav.appendChild(note)
    let tmp = document.createElement("span")
    tmp.classList.add("notePreviewTitle")
    tmp.innerText = element.title
    note.appendChild(tmp)
    let tmp2 = document.createElement("span")
    tmp2.classList.add("notePreviewText")
    if (typeof (element.content) == "string") tmp2.innerText = element.content.substring(0, 15)
    note.appendChild(tmp2)


    note.onclick = function () {
      selected = element;
      console.log(selected);
      openNote()
    }
  });

  let buttonDiv = document.createElement("div");
  buttonDiv.style.width = "100%";
  buttonDiv.style.display = "flex";
  nav.appendChild(buttonDiv);

  let createButton = document.createElement("span");
  createButton.innerText = "+";
  createButton.id = "createButton";
  createButton.style.marginRight = "auto";
  createButton.style.marginLeft = "0.5em";
  buttonDiv.appendChild(createButton);
  createButton.onclick = createNote

  let deleteButton = document.createElement("span");
  deleteButton.innerText = "-";
  deleteButton.id = "deleteButton";
  deleteButton.style.marginLeft = "auto";
  deleteButton.style.marginRight = "0.5em";
  buttonDiv.appendChild(deleteButton);
  deleteButton.onclick = deleteNote
}

function openNote() {
  title.value = selected.title
  note.value = selected.content
}

function updateContent() {
  clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    fetch(`http://${host}/api/updateNote`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "title": title.value, "content": note.value, "id": selected.id, "username": user })
    });
    setTimeout(buildNav, 100)
  }, 500)
}

//let updateNav = setInterval(buildNav, 2000);

let updateTimeout;


function createNote() {
  fetch(`http://${host}/api/note`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "title": "title", "username": user })
  });
  setTimeout(buildNav, 100)
}

function deleteNote() {
  fetch(`http://${host}/api/note`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "id": selected.id, "username": user })
  });
  title.value = ""
  note.value = ""
  setTimeout(buildNav, 100)
}

function login() {
  let userEl = document.getElementById("userField");
  let passEl = document.getElementById("passField");
  if (userEl) localStorage.setItem("user", userEl.value)
  window.onload()
}

function logout() {
  localStorage.setItem("user", "")
  window.onload()
}