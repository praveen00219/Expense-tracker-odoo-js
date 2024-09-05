import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = "AIzaSyA9j_aLpVhvoRtFdNxNEp0AQMgwl4aWc00";
const genAI = new GoogleGenerativeAI(apiKey);

const btn = document.querySelector(".btn");
const messageContainer = document.querySelector(".chat-container");

const loader = document.querySelector(".loader");
const loaderContainer = document.querySelector(".loader-container");

// --------check user Sign in or not-------------
function checkLogin() {
  const loggedIn = sessionStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location.href = "/index.html";
  }
}

async function getGeminiResponse() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const userInput = document.querySelector(".user-input").value;
  const prompt = userInput;

  // Show loader
  loader.style.display = "block";
  loaderContainer.style.display = "flex";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    function convertMarkdownToHtml(markdown) {
      return markdown.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    }

    function wrapBoldText(html) {
      return html.replace(
        /<strong>(.*?)<\/strong>/g,
        '<span class="highlight">$1</span>'
      );
    }

    // importaant!
    const htmlStr = await convertMarkdownToHtml(text);
    const highlightedHtml = await wrapBoldText(htmlStr);

    const style = document.createElement("style");
    style.textContent = `
            .highlight {
                display : block;
                font-weight: bold; /* Ensure text remains bold */
            }
        `;
    document.head.append(style);

    const userMessage = document.createElement("div");
    userMessage.className = "user-msg chat-message fade-in";
    userMessage.innerText = `${userInput}`;
    messageContainer.appendChild(userMessage);

    const botMessage = document.createElement("div");
    botMessage.className = "bot-msg chat-message fade-in";
    botMessage.innerHTML = `${highlightedHtml}`; // append filtered html
    messageContainer.appendChild(botMessage);

    // Scroll to the bottom of the chat
    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Clear user input
    document.querySelector(".user-input").value = "";
  } finally {
    // Hide loader
    loader.style.display = "none";
    loaderContainer.style.display = "none";
  }
}

btn.addEventListener("click", getGeminiResponse);
