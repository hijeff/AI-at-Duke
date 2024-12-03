// Sidebar Toggle Function
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.querySelector(".sidebar-toggle");
  sidebar.classList.toggle("active");
  toggleButton.textContent = sidebar.classList.contains("active") ? "←" : "≡";
  toggleButton.classList.toggle("open", sidebar.classList.contains("active"));
}

// Theme Toggle Function
function toggleTheme() {
  const body = document.body;
  const toggleIcon = document.getElementById("toggle-icon");
  const isDarkTheme = body.classList.toggle("dark-theme");
  toggleIcon.textContent = isDarkTheme ? "☀️" : "🌙";
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
}

// Load Theme from Local Storage
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("toggle-icon").textContent = "☀️";
    document.getElementById("theme-toggle").checked = true;
  }
});

// Function to Display Messages in Chat Box
function displayMessage(content, isUser = false) {
  const chatBox = document.getElementById("chat-box");
  const message = document.createElement("div");
  message.className = isUser ? "user-message" : "ai-message";
  message.textContent = content;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Fetch AI Response from Local Proxy Server
async function fetchAIResponse(prompt) {
  try {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "There was an error connecting to the AI. Please try again later.";
  }
}

// Handle User Input and Display AI Response
async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const userText = userInput.value.trim();
  if (!userText) return;

  // Display user message
  displayMessage(userText, true);
  userInput.value = "";

  // Expand chat box after first message submission
  const chatBox = document.getElementById("chat-box");
  if (!chatBox.classList.contains("expanded")) {
    chatBox.classList.add("expanded");
  }

  // Display AI response
  displayMessage("Thinking...", false);
  const aiResponse = await fetchAIResponse(userText);
  document.getElementById("chat-box").lastChild.textContent = aiResponse;
}

// Add Event Listener for Send Button Click
document.getElementById("send-button").addEventListener("click", sendMessage);

// Add Event Listener for Enter Key in Input Field
document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevents line break in the input
    sendMessage();
  }
});
