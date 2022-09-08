// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import {
  getDatabase,
  ref,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByBeUlODFvTJ2CAb3IB1UqeI4hE9mrUBY",
  authDomain: "chat-ab950.firebaseapp.com",
  databaseURL:
    "https://chat-ab950-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-ab950",
  storageBucket: "chat-ab950.appspot.com",
  messagingSenderId: "674976857061",
  appId: "1:674976857061:web:f0b844a110788f3ba9cd0c",
};

// Initialize Firebase
function initializeFirebase() {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const messagesRef = ref(db, "messages");
  onChildAdded(messagesRef, function (snapshot) {
    /*SNAPSHOT AL MESAJULUI*/ const data = snapshot.val();
    // console.log(data);
    let key = snapshot.key;
    displayMessage(data);
  });
  const emojiRef = ref(db, "emoji");
  onChildAdded(emojiRef, function (snapshot) {
    /*SNAPSHOT AL MESAJULUI*/ const data = snapshot.val();
    // console.log(data);
    let key = snapshot.key;
    displayEmoji(data);
  });
}

let userName = null;

function displayEmoji(data){
  let time = dayjs(data.date).format("HH:mm");
  let emojiTemplate =  
  `
  <div class="chatBubble ${data.userName === userName ? "self" : "other"}"> 
  <div class="userName">${data.userName}</div>
  <div class="message">${data.emoji}</div>
  <div class="time">${time}</div>
  </div>
  `;
document.querySelector("#chat").insertAdjacentHTML("beforeend", emojiTemplate);
//element.scrollHeight - Math.abs(element.scrollTop) === element.clientHeight
document.querySelector("#chat .chatBubble:last-child").scrollIntoView();
}

function displayMessage(data) {
  console.log("new message", data);
  //   let date = new Date(data.date);
  //   let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  //   let minutes =
  //     date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  //   let time = hour + ":" + minutes;
  let time = dayjs(data.date).format("HH:mm");

  let template = /*if (data.userName === userName){
        class= self
        else{
          other
        }
      }
      */ `
      <div class="chatBubble ${data.userName === userName ? "self" : "other"}"> 
      <div class="userName">${data.userName}</div>
      <div class="message">${data.message}</div>
      <div class="time">${time}</div>
      </div>
      `;
  document.querySelector("#chat").insertAdjacentHTML("beforeend", template);
  //element.scrollHeight - Math.abs(element.scrollTop) === element.clientHeight
  document.querySelector("#chat .chatBubble:last-child").scrollIntoView();
}

function startChat() {
  let name = document.querySelector('[name="name"]').value;
  name = name.trim(); //sterge spatiile de la inceput si de la sfarsit
  if (name.length < 3) {
    document.querySelector('[name="name"]').classList.add("error");
  } else {
    document.querySelector('[name="name"]').classList.remove("error");
    userName = name;
    document.querySelector("#signUpForm").classList.add("hidden");
    document.querySelector("#chatContainer").classList.remove("hidden");
    initializeFirebase();
  }
}

async function addEmoji(idx){
  let emoji = `<img src="/images/emoji/png/${idx}.png" alt="" srcset="">`

  await fetch(firebaseConfig.databaseURL + "/emoji/" + ".json",{
    method: "POST",
    body: JSON.stringify({
      userName: userName,
      emoji: emoji,
      date: new Date(),
  }),
});
}

async function addMessage() {
  let message = document.querySelector('[name="chatMessage"]').value;
  if(message == ""){
    return;
  }
  message = message.trim();

  await fetch(firebaseConfig.databaseURL + "/messages/" + ".json", {
    method: "POST",
    body: JSON.stringify({
      userName: userName,
      message: message,
      date: new Date(),
    }),
  });
  document.querySelector('[name="chatMessage"]').value = "";
}

function populateEmoji(){
  for(let i = 1; i <= 120; i++){
    let str =
    `          
  <button type="button" onclick="addEmoji(${i})">
    <img src="https://firebasestorage.googleapis.com/v0/b/chat-ab950.appspot.com/o/${i}.png?alt=media&token=e90f1734-797f-4929-9dc4-ea8450560bb4" alt="" srcset="">
  </button>`
  document.querySelector(".emoji").innerHTML += str;
  document.querySelector(".emoji").classList.remove("hidden");
  }
}

function listEmoji(){
  let emoji = document.querySelector(".emojiContainer");
  if (emoji.classList.contains("hidden")){
    emoji.classList.remove("hidden")

  }else{
    emoji.classList.add("hidden")
  }
}

function emojiLoader(){
  document.querySelector(".emoji").classList.add("hidden");
  document.querySelector(".lds-roller").classList.remove("hidden");
  setTimeout(function(){
    document.querySelector(".emoji").classList.remove("hidden");
    document.querySelector(".lds-roller").classList.add("hidden");
  }, 2000);
}

//global variables
window.addMessage = addMessage;
window.startChat = startChat;
window.populateEmoji = populateEmoji;
window.listEmoji = listEmoji;
window.emojiLoader = emojiLoader;
window.addEmoji = addEmoji;
