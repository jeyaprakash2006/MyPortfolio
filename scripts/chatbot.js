export class Chatbot {
    constructor() {
        this.chatBtn = document.getElementById('chat-widget-btn');
        this.chatWindow = document.getElementById('chat-widget-window');
        this.messagesContainer = document.getElementById('chat-messages');
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.closeBtn = document.getElementById('chat-close-btn');
        this.soundBtn = document.getElementById('chat-sound-btn');

        this.isOpen = false;
        this.isMuted = false;
        this.synth = window.speechSynthesis;
        this.voice = null;

        this.knowledgeBase = [
            {
                keywords: ['hello', 'hi', 'hey', 'start', 'greeting'],
                response: "Hello! I am Dr. Deepthi's assistant. How can I help you today?"
            },
            {
                keywords: ['who', 'about', 'profile', 'bio', 'introduction', 'intro'],
                response: "Dr. Deepthi BV is an Educator & Researcher passionate about Teaching & Chemical Sciences. She holds a Ph.D. in Chemistry and specializes in Benzyltrimethylammonium Chloride compounds."
            },
            {
                keywords: ['research', 'paper', 'publication', 'journal', 'article'],
                response: "She has published multiple papers in UGC cared list journals, including the 'Research Journal of Chemistry and Environment' and 'Oriental Journal of Chemistry'. Her work focuses on quaternary ammonium compounds."
            },
            {
                keywords: ['education', 'study', 'phd', 'degree', 'msc', 'bsc', 'college', 'university'],
                response: "She holds a Ph.D. in Chemistry from Manonmaniam Sundaranar University (2024), an M.Sc. (2020), and a B.Sc. (2018) from Nesamony Memorial Christian College."
            },
            {
                keywords: ['contact', 'email', 'phone', 'reach', 'address', 'mail'],
                response: "You can reach her via email at deepthibv1997@gmail.com or call +91 8270929419. She is based in Kanyakumari district."
            },
            {
                keywords: ['skill', 'tool', 'software', 'technology', 'tech'],
                response: "She is proficient in MS Office, PYRX, and PYMOL, combining chemical expertise with digital tools."
            },
            {
                keywords: ['experience', 'work', 'job', 'teach'],
                response: "She is currently a Teaching Professional at Santhosha Vidhyalaya Dohnavur. Previously, she worked in R&D at the Institute of Development Studies (2022-2025)."
            },
            {
                keywords: ['jeya'],
                response: "He is her lovable husband, the one who walked into her life quietly and stayed with purpose.In his presence, she found comfort, laughter, and unwavering support."
            }
        ];

        this.defaultResponse = "I'm sorry, I don't have information on that. You can try asking about her 'Education', 'Research', or 'Contact' details.";

        this.init();
    }

    init() {
        if (!this.chatBtn || !this.chatWindow) return;

        // Toggle Chat
        this.chatBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());

        // Sound Toggle
        this.soundBtn.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            const icon = this.soundBtn.querySelector('i');
            this.soundBtn.style.opacity = this.isMuted ? '0.5' : '1';

            // Cancel speech if muting
            if (this.isMuted) {
                this.synth.cancel();
                icon.setAttribute('data-lucide', 'volume-x');
            } else {
                icon.setAttribute('data-lucide', 'volume-2');
            }
            lucide.createIcons();
        });

        // Initialize Voices
        this.initVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.initVoices();
        }

        // Handle Input
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleInput();
        });

        // Initial Greeting & Suggestions
        const initialMsg = this.knowledgeBase[0].response;
        this.addBotMessage(initialMsg, false);
        this.renderSuggestions();
    }

    initVoices() {
        const voices = this.synth.getVoices();

        console.log("Available Voices:", voices.map(v => `${v.name} (${v.lang})`));

        // Strict Priority Logic:
        // 1. Indian Female Voice (Best)
        // 2. ANY Female Voice (Samantha, Google UK, etc.) - Better to have female accent than male Indian
        // 3. Any Indian Voice (Fallback)
        // 4. Fallback to default
        this.voice = voices.find(v => (v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Hindi')) && (v.name.includes('Female') || v.name.includes('Rishi') === false)) ||
            voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria')) ||
            voices.find(v => (v.lang === 'en-IN' || v.name.includes('India'))) ||
            voices[0];

        if (this.voice) {
            console.log("Selected Voice:", this.voice.name);
        } else {
            console.log("No suitable voice found. Using default.");
        }
    }

    speak(text) {
        if (this.isMuted || !this.synth) return;

        this.synth.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);

        // Ensure voice is set 
        if (!this.voice) this.initVoices();

        if (this.voice) {
            utterance.voice = this.voice;
            // Only force language if the voice is actually Indian.
            // Forcing 'en-IN' on a US/UK female voice will NOT make it sound Indian, 
            // but forcing a male Indian voice (if that's all that's found) is worse than a Female UK voice.
            // So we rely on the initVoices priority.
            console.log("Using specific voice:", this.voice.name);
        } else {
            // Only if NO voice is found do we hint accent
            utterance.lang = 'en-IN';
            console.log("No specific voice found, hinting en-IN");
        }

        utterance.rate = 1;
        utterance.pitch = 1.0;

        console.log("Speaking with voice:", utterance.voice ? utterance.voice.name : "System Default");
        this.synth.speak(utterance);
    }

    renderSuggestions() {
        const suggestionsContainer = document.getElementById('chat-suggestions');
        if (!suggestionsContainer) return;

        const suggestions = [
            { label: 'Research 🔬', query: 'research' },
            { label: 'Education 🎓', query: 'education' },
            { label: 'Contact 📞', query: 'contact' },
            { label: 'Skills 💻', query: 'skills' }
        ];

        suggestionsContainer.innerHTML = '';
        suggestions.forEach(s => {
            const chip = document.createElement('button');
            chip.className = 'whitespace-nowrap px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-neonCyan hover:bg-neonCyan hover:text-obsidian transition-colors animate-fade-in';
            chip.textContent = s.label;
            chip.onclick = () => {
                this.chatInput.value = s.query;
                this.handleInput();
            };
            suggestionsContainer.appendChild(chip);
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.remove('hidden', 'opacity-0', 'translate-y-10');
            this.chatWindow.classList.add('flex', 'opacity-100', 'translate-y-0');
            // Focus input when opened
            setTimeout(() => this.chatInput.focus(), 300);
        } else {
            this.chatWindow.classList.add('hidden', 'opacity-0', 'translate-y-10');
            this.chatWindow.classList.remove('flex', 'opacity-100', 'translate-y-0');
        }
    }

    handleInput() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        // Add user message
        this.addUserMessage(text);
        this.chatInput.value = '';

        // Process response
        setTimeout(() => {
            const response = this.findResponse(text.toLowerCase());
            this.addBotMessage(response);
        }, 500);
    }

    findResponse(input) {
        for (const entry of this.knowledgeBase) {
            if (entry.keywords.some(keyword => input.includes(keyword))) {
                return entry.response;
            }
        }
        return this.defaultResponse;
    }

    addBotMessage(text, shouldSpeak = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bg-white/10 p-3 rounded-lg rounded-tl-none text-sm text-neutral-200 mb-2 self-start max-w-[85%] animate-fade-in shadow-sm';
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();

        if (shouldSpeak) this.speak(text);
    }

    addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'bg-neonCyan/20 text-neonCyan p-3 rounded-lg rounded-tr-none text-sm mb-2 self-end max-w-[85%] animate-fade-in shadow-sm border border-neonCyan/20';
        msgDiv.textContent = text;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}
