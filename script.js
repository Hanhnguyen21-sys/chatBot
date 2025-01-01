const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
const chatClose = document.querySelector(".close-btn");

const API_KEY  = "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";
//how to handle the chat?? 
// 1. get the value of the input
let userMessage;

// 2. send the value to the server
// 3. append the value to the chat list
const createChatList= (message, className) =>{
    //create a chat element with passed message and class
    const chatList = document.createElement("li");
    //classList.add will add the class to the element
    // pass 2 arguments, 1st is general class, 2nd is a class to distinguish
    // between incoming and outgoing messages
    chatList.classList.add("chat",className);
    let chatContent;
    if(className === "outgoing"){
        chatContent = `<p></p>`;
    }
    else{
        chatContent = `<span class="material-symbols-outlined">sentiment_satisfied</span>
        <p></p>`;
    }
    chatList.innerHTML = chatContent;
    chatList.querySelector("p").textContent = message;
    return chatList;
}

const generateResponse = (incomingChat) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChat.querySelector("p"); // take the response of chatbot
    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }

    fetch(API_URL, requestOptions).then((response) => {
        return response.json();
    }).then((data) => {
       messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.textContent = "🙊 something wrongs!";
    }).finally(() => { chatBox.scrollTo(0,chatBox.scrollHeight); });
}

const handleChat = () => {
    // 1. get the value of the input
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    // 2. append users' message to the chat list
    chatBox.appendChild(createChatList(userMessage,"outgoing"));
    //auto scroll to the bottom of the chat
    chatBox.scrollTo(0,chatBox.scrollHeight);
    // 3. clear the input field
    chatInput.value = "";


    //display the thinking message which is stored in a list - a HTML element
    const incomingChat = createChatList("Waiting 2s, I'm thinking 😂","incoming");
    chatBox.appendChild(incomingChat);
    generateResponse(incomingChat);
};



//Toggler chatbot visibility when click the button
sendChatBtn.addEventListener("click", handleChat);
chatToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatClose.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

