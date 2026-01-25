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

            /* ===== GREETINGS & SMALL TALK ===== */
            { keywords: ['hello', 'hi', 'hey', 'start'], response: "Hello 😊 I’m Dr. Deepthi B V’s AI assistant. How can I help?" },
            { keywords: ['good morning'], response: "Good morning! Hope you’re having a great start ☀️" },
            { keywords: ['good evening'], response: "Good evening 🌙 What would you like to know?" },
            { keywords: ['how are you'], response: "I’m doing great—happy to help you today!" },

            /* ===== ABOUT HER ===== */
            { keywords: ['who', 'about', 'profile', 'bio', 'intro'], response: "Dr. Deepthi B V is a Ph.D. Chemistry scholar, educator, and researcher." },
            { keywords: ['what does she do'], response: "She teaches Chemistry and actively works in research." },
            { keywords: ['profession'], response: "She is an Educator and Researcher." },
            { keywords: ['passion', 'interest'], response: "Teaching and chemical research are her core passions." },

            /* ===== EDUCATION ===== */
            { keywords: ['education', 'qualification'], response: "She holds a Ph.D., M.Sc., and B.Sc. in Chemistry." },
            { keywords: ['phd'], response: "She completed her Ph.D. at MS University (2024)." },
            { keywords: ['msc'], response: "She earned her M.Sc. in Chemistry in 2020." },
            { keywords: ['bsc'], response: "She completed her B.Sc. in Chemistry in 2018." },
            { keywords: ['college', 'university'], response: "She studied at MS University and NMCC Marthandam." },

            /* ===== RESEARCH ===== */
            { keywords: ['research'], response: "Her research focuses on quaternary ammonium compounds." },
            { keywords: ['specialization'], response: "She specializes in antimicrobial chemical compounds." },
            { keywords: ['phd topic'], response: "Her Ph.D. work studied synthesis and biological activity of QACs." },
            { keywords: ['benzyltrimethylammonium'], response: "It’s one of her key research compounds." },

            /* ===== PUBLICATIONS ===== */
            { keywords: ['publication', 'paper', 'journal'], response: "She has published papers in UGC CARE–listed journals." },
            { keywords: ['how many papers'], response: "She has published three international research papers." },
            { keywords: ['research journal'], response: "She published in Research Journal of Chemistry and Environment." },
            { keywords: ['oriental journal'], response: "She published work in Oriental Journal of Chemistry." },
            { keywords: ['acta scientific'], response: "She published in Acta Scientific Pharmaceutical Sciences." },

            /* ===== CONFERENCES ===== */
            { keywords: ['conference', 'seminar'], response: "She actively presents at national and international conferences." },
            { keywords: ['presentation'], response: "She has presented multiple research papers since 2021." },

            /* ===== EXPERIENCE ===== */
            { keywords: ['experience'], response: "She has over four years of teaching and research experience." },
            { keywords: ['current job'], response: "She currently works at Santhosha Vidhyalaya, Dohnavur." },
            { keywords: ['previous job'], response: "She worked at IDS Kerala and Apollo NEET Academy." },
            { keywords: ['teaching'], response: "She is known for a calm and student-friendly teaching style." },

            /* ===== SKILLS ===== */
            { keywords: ['skills'], response: "Her skills include teaching, research, and lab analysis." },
            { keywords: ['software', 'tools'], response: "She uses MS Office, PYRX, and PYMOL." },
            { keywords: ['pyrx'], response: "PYRX is used for molecular docking." },
            { keywords: ['pymol'], response: "PYMOL helps visualize molecular structures." },

            /* ===== PROJECTS ===== */
            { keywords: ['project'], response: "Her projects focus on antimicrobial chemical compounds." },
            { keywords: ['chitosan'], response: "She worked on chitosan–starch polymer blends." },

            /* ===== LANGUAGES ===== */
            { keywords: ['language', 'languages'], response: "She speaks English, Tamil, and Malayalam." },

            /* ===== LOCATION ===== */
            { keywords: ['location', 'where'], response: "She is based in Kanyakumari district, Tamil Nadu." },
            { keywords: ['address'], response: "She resides in Kanyakumari district." },

            /* ===== CONTACT ===== */
            { keywords: ['contact', 'reach'], response: "You can contact her via email or phone." },
            { keywords: ['email'], response: "Email: deepthibv1997@gmail.com" },
            { keywords: ['phone', 'mobile'], response: "Phone: +91 8270929419" },

            /* ===== PERSONAL ===== */
            { keywords: ['jeya'], response: "Jeya is her lovable husband and strongest supporter." },

            /* ===== STUDENT-STYLE QUESTIONS ===== */
            { keywords: ['can she guide', 'mentor'], response: "Yes, she actively guides and motivates students." },
            { keywords: ['is she friendly'], response: "Yes—students find her approachable and supportive." },
            { keywords: ['is she strict'], response: "She balances discipline with understanding." },

            /* ===== CLOSING ===== */
            { keywords: ['thanks', 'thank you'], response: "You’re welcome 😊 Happy to help!" },
            { keywords: ['bye', 'goodbye'], response: "Thanks for visiting. Have a wonderful day 🌸" }

        ];

        this.defaultResponse =
            "I’m here to help 😊 You can ask about her education, research, teaching, publications, or contact details.";

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
