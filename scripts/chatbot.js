export class Chatbot {
    constructor() {
        this.chatBtn = document.getElementById('chat-widget-btn');
        this.chatWindow = document.getElementById('chat-widget-window');
        this.messagesContainer = document.getElementById('chat-messages');
        this.optionsContainer = document.getElementById('chat-options');
        this.closeBtn = document.getElementById('chat-close-btn');

        this.isOpen = false;

        this.knowledgeBase = {
            'intro': "Hello! I am Dr. Deepthi BV's virtual assistant. I can tell you about her Research, Education, or how to Contact her. What would you like to know?",
            'about': "Dr. Deepthi BV is an Educator & Researcher passionate about Teaching & Chemical Sciences. She holds a Ph.D. in Chemistry and specializes in Benzyltrimethylammonium Chloride compounds.",
            'research': "She has published multiple papers in UGC cared list journals, focusing on the synthesis, characterization, and antimicrobial activity of various chemical compounds.",
            'contact': "You can reach her via email at deepthibv1997@gmail.com or by phone at +91 8270929419.",
            'default': "I'm sorry, I didn't catch that. Please select one of the options below."
        };

        this.init();
    }

    init() {
        if (!this.chatBtn || !this.chatWindow) return;

        // Toggle Chat
        this.chatBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());

        // Initial Greeting
        this.addBotMessage(this.knowledgeBase['intro']);
        this.addOptions([
            { label: 'About Me', value: 'about' },
            { label: 'Research', value: 'research' },
            { label: 'Contact', value: 'contact' }
        ]);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.remove('hidden', 'opacity-0', 'translate-y-10');
            this.chatWindow.classList.add('flex', 'opacity-100', 'translate-y-0');
        } else {
            this.chatWindow.classList.add('hidden', 'opacity-0', 'translate-y-10');
            this.chatWindow.classList.remove('flex', 'opacity-100', 'translate-y-0');
        }
    }

    addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bg-white/10 p-3 rounded-lg rounded-tl-none text-sm text-neutral-200 mb-2 self-start max-w-[85%] animate-fade-in';
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bg-neonCyan/20 text-neonCyan p-3 rounded-lg rounded-tr-none text-sm mb-2 self-end max-w-[85%] animate-fade-in';
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    addOptions(options) {
        this.optionsContainer.innerHTML = ''; // Clear old options

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'px-3 py-1.5 border border-neonCyan/30 rounded-full text-xs text-neonCyan hover:bg-neonCyan hover:text-obsidian transition-colors';
            btn.textContent = opt.label;
            btn.onclick = () => this.handleOptionClick(opt);
            this.optionsContainer.appendChild(btn);
        });
    }

    handleOptionClick(option) {
        this.addUserMessage(option.label);

        // Simulate typing delay
        setTimeout(() => {
            const response = this.knowledgeBase[option.value] || this.knowledgeBase['default'];
            this.addBotMessage(response);
        }, 500);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}
