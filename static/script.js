document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-container');

    // Splash screen - 2.5 seconds
    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.style.display = 'none';
            main.style.display = 'flex';
        }, 800);
    }, 2500);

    // Dark mode toggle - FIXED (before it had no logic)
    const toggleBtn = document.getElementById('toggleTheme');
    toggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        toggleBtn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    });
});

async function sendMessage() {
    const input = document.getElementById("message");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage("You", msg);
    input.value = "";
    input.focus();

    const chat = document.getElementById("chat");
    addMessage("Bot", "Typing...");

    try {
        const res = await fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        chat.removeChild(chat.lastChild);
        addMessage("Bot", data.reply);
    } catch (e) {
        chat.removeChild(chat.lastChild);
        addMessage("Bot", "Server is busy. Try again!");
    }
}

function addMessage(sender, text) {
    const chat = document.getElementById("chat");
    const row = document.createElement("div");
    row.className = sender === "You" ? "chat-row user" : "chat-row bot";

    const avatar = document.createElement("span");
    avatar.className = sender === "Bot"
        ? "avatar bg-gradient-to-r from-purple-400 to-pink-500"
        : "avatar bg-blue-500";

    const bubble = document.createElement("div");
    bubble.className = `bubble ${sender === "You" ? "user-bubble" : "bot-bubble"}`;

    // FIXED: XSS fix - textContent use pannrom, innerHTML illa
    const label = document.createElement("strong");
    label.textContent = sender + ": ";
    const msgText = document.createTextNode(text);
    bubble.appendChild(label);
    bubble.appendChild(msgText);

    if (sender === "Bot") {
        row.appendChild(avatar);
        row.appendChild(bubble);
    } else {
        row.appendChild(bubble);
        row.appendChild(avatar);
    }

    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
}

// Enter key support
document.getElementById("message").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});