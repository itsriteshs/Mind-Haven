document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const typingIndicatorArea = document.getElementById('typingIndicatorArea');
    const chatbotName = document.getElementById('chatbotName');
    const API_KEY = "AIzaSyBb-ST8emwqm0RmWa0P3_4W1Q6omYOrvog";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    let isLoading = false;
    let conversationHistory = [];
    const MAX_SUMMARY_LENGTH = 150;
    const SYSTEM_INSTRUCTION_TEXT = "You are an AI therapist named Rhea. Be gentle, empathetic, self-aware, and reassuring. Keep your responses concise, generally between 10 and 100 words, though you can exceed this slightly if necessary for clarity or empathy. Focus on active listening and providing supportive reflections or gentle questions.";

    function formatTimestamp(date = new Date()) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    function addMessage(sender, message) {
        const messageBlock = document.createElement("div");
        messageBlock.classList.add("message", `${sender}-message`);

        if (sender === 'ai') {
            const avatar = document.createElement('div');
            avatar.classList.add('avatar', 'ai-avatar');
            avatar.textContent = 'R';
            messageBlock.appendChild(avatar);
        }

        const innerWrapper = document.createElement('div');
        innerWrapper.classList.add('message-inner-wrapper');

        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add('message-content');

        let formattedText = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, (match, p1) => `<pre><code>${p1.trim().replace(/</g, "<").replace(/>/g, ">")}</code></pre>`)
            .replace(/`(.*?)`/g, (match, p1) => `<code>${p1.replace(/</g, "<").replace(/>/g, ">")}</code>`)
            .replace(/\n/g, '<br>');

        messageContentDiv.innerHTML = `<p>${formattedText}</p>`;
        innerWrapper.appendChild(messageContentDiv);

        const metaDiv = document.createElement('div');
        metaDiv.classList.add('message-meta');

        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('timestamp');
        timestampSpan.textContent = formatTimestamp();
        metaDiv.appendChild(timestampSpan);

        const copyBtn = document.createElement('button');
        copyBtn.classList.add('copy-btn');
        copyBtn.setAttribute('aria-label', 'Copy message');
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0117 6.621V16.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 16.5v-13z"></path>
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-1.121A3.001 3.001 0 0111.879 15H8.5A1.5 1.5 0 017 13.5V9.621a3 3 0 01-1.44-1.06L4.5 7.5V6z"></path>
            </svg>
        `;
        copyBtn.onclick = () => copyToClipboard(message, copyBtn);
        metaDiv.appendChild(copyBtn);

        innerWrapper.appendChild(metaDiv);
        messageBlock.appendChild(innerWrapper);
        chatMessages.appendChild(messageBlock);
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }

    function showTypingIndicator(show) {
        typingIndicatorArea.style.display = show ? 'block' : 'none';
        if (show) {
            setTimeout(() => {
                chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
            }, 50);
        }
    }

    function copyToClipboard(text, buttonElement) {
        navigator.clipboard.writeText(text).then(() => {
            buttonElement.classList.add('copied');
            setTimeout(() => {
                buttonElement.classList.remove('copied');
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    async function handleSendAction() {
        const userMessage = userInput.value.trim();
        if (!userMessage || isLoading) return;

        isLoading = true;
        sendButton.disabled = true;
        userInput.value = "";
        autoResizeTextarea();
        addMessage("user", userMessage);
        showTypingIndicator(true);

        conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

        try {
            const payload = {
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION_TEXT }] },
                contents: conversationHistory,
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                ]
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            showTypingIndicator(false);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData?.error?.message || `HTTP ${response.status}`}`);
            }

            const data = await response.json();
            let aiResponseText = "Sorry, I couldn't get a response at the moment.";

            if (data.candidates?.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content?.parts?.length > 0) {
                    aiResponseText = candidate.content.parts[0].text;
                    conversationHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
                }
            }

            addMessage("ai", aiResponseText);

        } catch (error) {
            console.error("Error in handleSendAction:", error);
            addMessage("ai", `Sorry, an error occurred: ${error.message}. Please try again.`);
            showTypingIndicator(false);
        } finally {
            isLoading = false;
            autoResizeTextarea();
            userInput.focus();
        }
    }

    function autoResizeTextarea() {
        userInput.style.height = 'auto';
        const maxHeight = 100;
        userInput.style.height = Math.min(userInput.scrollHeight, maxHeight) + 'px';
        sendButton.disabled = userInput.value.trim().length === 0 || isLoading;
    }

    sendButton.addEventListener("click", handleSendAction);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendAction();
        }
    });

    userInput.addEventListener('input', autoResizeTextarea);
    autoResizeTextarea();
    userInput.focus();
});
