// Chat Bot JavaScript
class ChatBot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.userName = '';
        this.currentLanguage = 'en'; // Default language is English
        
        // Initialize elements
        this.toggle = document.getElementById('chatBotToggle');
        this.window = document.getElementById('chatBotWindow');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        this.closeBtn = document.getElementById('chatClose');
        this.notification = document.getElementById('chatNotification');
        this.quickActions = document.getElementById('chatQuickActions');
        this.languageToggle = document.getElementById('languageToggle');
        
        this.initializeEventListeners();
        this.showNotification();
        this.setupLanguage();
    }
    
    setupLanguage() {
        // Set initial language
        this.updateLanguageDisplay();
        
        // Language toggle event
        this.languageToggle.addEventListener('click', () => {
            this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
            this.updateLanguageDisplay();
            this.updateInputPlaceholder();
        });
    }
    
    updateLanguageDisplay() {
        const enElements = document.querySelectorAll('.en-text');
        const arElements = document.querySelectorAll('.ar-text');
        
        if (this.currentLanguage === 'en') {
            enElements.forEach(el => el.style.display = 'block');
            arElements.forEach(el => el.style.display = 'none');
        } else {
            enElements.forEach(el => el.style.display = 'none');
            arElements.forEach(el => el.style.display = 'block');
        }
    }
    
    updateInputPlaceholder() {
        const placeholder = this.currentLanguage === 'en' 
            ? 'Type your message here...' 
            : 'اكتب رسالتك هنا...';
        this.input.placeholder = placeholder;
    }
    
    initializeEventListeners() {
        // Toggle chat window
        this.toggle.addEventListener('click', () => this.toggleChat());
        
        // Close chat window
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Quick actions
        this.quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            }
        });
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.hideNotification();
        this.input.focus();
        
        // Add to conversation history
        this.addToHistory('user', 'opened_chat');
    }
    
    closeChat() {
        this.isOpen = false;
        this.window.classList.remove('active');
    }
    
    showNotification() {
        this.notification.style.display = 'flex';
    }
    
    hideNotification() {
        this.notification.style.display = 'none';
    }
    
    sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage('user', message);
        this.input.value = '';
        
        // Add to history
        this.addToHistory('user', message);
        
        // Process message and get response
        this.processMessage(message);
    }
    
    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString(this.currentLanguage === 'en' ? 'en-US' : 'ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-container';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.messages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }
    
    addToHistory(sender, message) {
        this.conversationHistory.push({
            sender,
            message,
            timestamp: new Date(),
            language: this.currentLanguage
        });
    }
    
    async processMessage(message) {
        this.isTyping = true;
        this.addTypingIndicator();
        
        // Simulate typing delay
        await this.delay(1000 + Math.random() * 2000);
        
        this.removeTypingIndicator();
        this.isTyping = false;
        
        // Get AI response
        const response = this.getAIResponse(message);
        this.addMessage('bot', response);
        this.addToHistory('bot', response);
    }
    
    getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Multi-language responses
        const responses = {
            en: {
                greetings: "Hello! How can I help you with your home design? 😊",
                services: "I offer interior design, exterior design, and landscape design services. I can help you design your entire home or renovate a single room. What specifically do you need?",
                booking: "Great! I can visit your site to assess the project. When would be convenient for you? You can book an appointment through the website form or let me know a suitable time.",
                portfolio: "You can browse my portfolio on the main page! You'll find various projects from interior, exterior, and landscape design. What type of design interests you?",
                interior: "Interior design is my specialty! I can help you design all rooms with appropriate colors, furniture, and lighting. Which room would you like to start with?",
                exterior: "Exterior design is very important! I can help you design your home's facade to look more attractive and modern. Do you have an idea about the style you prefer?",
                landscape: "Garden design is one of the most beautiful works! I can create a beautiful garden that harmonizes with your home. What is the available garden area?",
                time: "Project duration depends on its size and complexity. Small projects take 2-4 weeks, and large projects take 2-3 months. Would you like a detailed timeline?",
                contact: "You can contact me via:\n📱 Phone: +970-59-XXX-XXXX\n📧 Email: samar.ammar@example.com\n📱 WhatsApp: +970-59-XXX-XXXX\n📘 Facebook: Samar Ammar Interior Design\n📸 Instagram: @samar_ammar_design\n💼 LinkedIn: Samar Ammar",
                experience: "I have over 8 years of experience in interior and exterior design. I've completed more than 50 projects including villas, apartments, commercial spaces, and gardens. Each project is unique and tailored to the client's needs.",
                style: "I specialize in modern, contemporary, and classic styles. I can also create custom designs that blend different styles. What style appeals to you most?",
                process: "My design process includes: 1) Initial consultation, 2) Site visit and measurements, 3) Concept design, 4) Detailed plans, 5) Material selection, 6) Implementation supervision. Would you like to know more about any step?",
                materials: "I work with high-quality materials from trusted suppliers. This includes furniture, lighting, flooring, wall coverings, and decorative elements. I can recommend the best options for your budget and style.",
                consultation: "I offer free initial consultations to discuss your project and understand your needs. This helps me provide the best design solutions for your space.",
                location: "I provide services throughout Palestine, including Ramallah, Jerusalem, Bethlehem, Nablus, and surrounding areas. I can travel to your location for consultations and site visits.",
                warranty: "I provide a comprehensive warranty on all my work and use only high-quality materials with manufacturer warranties. Your satisfaction is my priority.",
                payment: "I offer flexible payment plans to make your dream design affordable. We can discuss payment options during our consultation.",
                default: "Thank you for your question! I can help you with all aspects of interior and exterior design. Would you like to know more about my services or book a consultation appointment?"
            },
            ar: {
                greetings: "مرحباً! كيف يمكنني مساعدتك في تصميم منزلك؟ 😊",
                services: "أقدم خدمات التصميم الداخلي والخارجي وتصميم الحدائق. يمكنني مساعدتك في تصميم منزلك بالكامل أو تجديد غرفة واحدة. ما الذي تحتاجه تحديداً؟",
                booking: "ممتاز! يمكنني زيارة موقعك لتقييم المشروع. متى يناسبك؟ يمكنك حجز موعد من خلال النموذج في الموقع أو إخباري بوقت مناسب لك.",
                portfolio: "يمكنك تصفح معرض أعمالي في الصفحة الرئيسية! ستجد مشاريع متنوعة من التصميم الداخلي والخارجي والحدائق. أي نوع من التصميم يثير اهتمامك؟",
                interior: "التصميم الداخلي هو تخصصي! يمكنني مساعدتك في تصميم جميع الغرف مع اختيار الألوان والأثاث والإضاءة المناسبة. ما هي الغرفة التي تريد البدء بها؟",
                exterior: "التصميم الخارجي مهم جداً! يمكنني مساعدتك في تصميم واجهة منزلك لتبدو أكثر جاذبية وعصرية. هل لديك فكرة عن النمط الذي تفضله؟",
                landscape: "تصميم الحدائق من أجمل الأعمال! يمكنني إنشاء حديقة جميلة تتناسق مع منزلك. ما هي مساحة الحديقة المتاحة؟",
                time: "مدة المشروع تعتمد على حجمه وتعقيده. المشاريع الصغيرة تستغرق 2-4 أسابيع، والمشاريع الكبيرة 2-3 أشهر. هل تريد جدول زمني مفصل؟",
                contact: "يمكنك التواصل معي عبر:\n📱 الهاتف: +970-59-XXX-XXXX\n📧 البريد الإلكتروني: samar.ammar@example.com\n📱 الواتساب: +970-59-XXX-XXXX\n📘 فيسبوك: Samar Ammar Interior Design\n📸 إنستغرام: @samar_ammar_design\n💼 لينكد إن: Samar Ammar",
                experience: "لدي أكثر من 8 سنوات من الخبرة في التصميم الداخلي والخارجي. أكملت أكثر من 50 مشروعاً تشمل الفيلات والشقق والمساحات التجارية والحدائق. كل مشروع فريد ومصمم حسب احتياجات العميل.",
                style: "أتخصص في الأنماط الحديثة والمعاصرة والكلاسيكية. يمكنني أيضاً إنشاء تصاميم مخصصة تجمع بين أنماط مختلفة. ما النمط الذي يعجبك أكثر؟",
                process: "عملية التصميم تشمل: 1) استشارة أولية، 2) زيارة الموقع والقياسات، 3) تصميم المفهوم، 4) خطط مفصلة، 5) اختيار المواد، 6) إشراف التنفيذ. هل تريد معرفة المزيد عن أي خطوة؟",
                materials: "أعمل مع مواد عالية الجودة من موردين موثوقين. هذا يشمل الأثاث والإضاءة والأرضيات وطلاء الجدران والعناصر الزخرفية. يمكنني التوصية بأفضل الخيارات لميزانيتك ونمطك.",
                consultation: "أقدم استشارات أولية مجانية لمناقشة مشروعك وفهم احتياجاتك. هذا يساعدني في تقديم أفضل حلول التصميم لمساحتك.",
                location: "أقدم خدماتي في جميع أنحاء فلسطين، بما في ذلك رام الله والقدس وبيت لحم ونابلس والمناطق المحيطة. يمكنني السفر إلى موقعك للاستشارات وزيارات الموقع.",
                warranty: "أقدم ضمان شامل على جميع أعمالي وأستخدم مواد عالية الجودة فقط مع ضمانات المصنع. رضاك هو أولويتي.",
                payment: "أقدم خطط دفع مرنة لجعل تصميم أحلامك ميسور التكلفة. يمكننا مناقشة خيارات الدفع خلال استشارتنا.",
                default: "شكراً لسؤالك! يمكنني مساعدتك في جميع جوانب التصميم الداخلي والخارجي. هل تريد معرفة المزيد عن خدماتي أو حجز موعد استشارة؟"
            }
        };
        
        const currentResponses = responses[this.currentLanguage];
        
        // Keywords for both languages
        const keywords = {
            greetings: this.currentLanguage === 'en' 
                ? ['hello', 'hi', 'good morning', 'good evening', 'hey', 'greetings']
                : ['مرحبا', 'السلام عليكم', 'هلا', 'صباح الخير', 'مساء الخير', 'تحياتي'],
            services: this.currentLanguage === 'en'
                ? ['services', 'what do you do', 'design', 'decoration', 'work', 'offer']
                : ['خدمات', 'ماذا تعمل', 'تصميم', 'ديكور', 'عمل', 'تقدم'],
            booking: this.currentLanguage === 'en'
                ? ['appointment', 'booking', 'meeting', 'visit', 'schedule', 'book']
                : ['موعد', 'حجز', 'مقابلة', 'زيارة', 'جدولة', 'حجز'],
            portfolio: this.currentLanguage === 'en'
                ? ['work', 'portfolio', 'photos', 'projects', 'previous', 'gallery', 'examples']
                : ['أعمال', 'معرض', 'صور', 'مشاريع', 'سابقة', 'معرض', 'أمثلة'],
            interior: this.currentLanguage === 'en'
                ? ['interior', 'rooms', 'living room', 'kitchen', 'bathroom', 'bedroom', 'inside']
                : ['داخلي', 'غرف', 'صالون', 'مطبخ', 'حمام', 'غرفة نوم', 'داخل'],
            exterior: this.currentLanguage === 'en'
                ? ['exterior', 'facade', 'villa', 'house', 'outside', 'building', 'front']
                : ['خارجي', 'واجهة', 'فيلا', 'بيت', 'خارج', 'مبنى', 'واجهة'],
            landscape: this.currentLanguage === 'en'
                ? ['garden', 'landscape', 'plants', 'grass', 'outdoor', 'yard', 'terrace']
                : ['حديقة', 'خارج', 'نباتات', 'عشب', 'خارجي', 'ساحة', 'تراس'],
            time: this.currentLanguage === 'en'
                ? ['duration', 'time', 'how long', 'when finish', 'schedule', 'timeline']
                : ['مدة', 'وقت', 'كم يستغرق', 'متى ينتهي', 'جدول', 'زمني'],
            contact: this.currentLanguage === 'en'
                ? ['contact', 'phone', 'number', 'call', 'email', 'whatsapp', 'social media', 'facebook', 'instagram']
                : ['اتصال', 'رقم', 'هاتف', 'تواصل', 'بريد', 'واتساب', 'سوشال ميديا', 'فيسبوك', 'انستغرام'],
            experience: this.currentLanguage === 'en'
                ? ['experience', 'years', 'how long', 'background', 'history', 'projects completed']
                : ['خبرة', 'سنوات', 'منذ متى', 'خلفية', 'تاريخ', 'مشاريع مكتملة'],
            style: this.currentLanguage === 'en'
                ? ['style', 'modern', 'classic', 'contemporary', 'traditional', 'design style']
                : ['نمط', 'حديث', 'كلاسيكي', 'معاصر', 'تقليدي', 'نمط التصميم'],
            process: this.currentLanguage === 'en'
                ? ['process', 'steps', 'how do you work', 'methodology', 'approach']
                : ['عملية', 'خطوات', 'كيف تعمل', 'منهجية', 'نهج'],
            materials: this.currentLanguage === 'en'
                ? ['materials', 'quality', 'furniture', 'lighting', 'flooring', 'suppliers']
                : ['مواد', 'جودة', 'أثاث', 'إضاءة', 'أرضيات', 'موردين'],
            consultation: this.currentLanguage === 'en'
                ? ['consultation', 'free', 'initial', 'discussion', 'meeting']
                : ['استشارة', 'مجاني', 'أولي', 'مناقشة', 'لقاء'],
            location: this.currentLanguage === 'en'
                ? ['location', 'area', 'where', 'city', 'region', 'travel']
                : ['موقع', 'منطقة', 'أين', 'مدينة', 'منطقة', 'سفر'],
            warranty: this.currentLanguage === 'en'
                ? ['warranty', 'guarantee', 'quality', 'assurance', 'promise']
                : ['ضمان', 'تأكيد', 'جودة', 'تأمين', 'وعد'],
            payment: this.currentLanguage === 'en'
                ? ['payment', 'cost', 'price', 'budget', 'affordable', 'plans']
                : ['دفع', 'تكلفة', 'سعر', 'ميزانية', 'ميسور', 'خطط']
        };
        
        // Check for keywords and return appropriate response
        for (const [category, keywordList] of Object.entries(keywords)) {
            if (this.containsAny(lowerMessage, keywordList)) {
                return currentResponses[category];
            }
        }
        
        return currentResponses.default;
    }
    
    handleQuickAction(action) {
        const actions = {
            en: {
                'services': 'What services do you offer?',
                'portfolio': 'I want to see your portfolio',
                'booking': 'I want to book an appointment',
                'contact': 'What is your contact information?',
                'experience': 'How many years of experience do you have?',
                'process': 'What is your design process?',
                'consultation': 'Do you offer free consultations?',
                'location': 'What areas do you serve?'
            },
            ar: {
                'services': 'ما هي الخدمات التي تقدمينها؟',
                'portfolio': 'أريد رؤية معرض أعمالك',
                'booking': 'أريد حجز موعد',
                'contact': 'ما هي معلومات التواصل معك؟',
                'experience': 'كم سنة من الخبرة لديك؟',
                'process': 'ما هي عملية التصميم؟',
                'consultation': 'هل تقدمين استشارات مجانية؟',
                'location': 'ما هي المناطق التي تخدمينها؟'
            }
        };
        
        const message = actions[this.currentLanguage][action];
        if (message) {
            this.addMessage('user', message);
            this.addToHistory('user', message);
            this.processMessage(message);
        }
    }
    
    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize chat bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

// Auto-open chat after 10 seconds if not opened
setTimeout(() => {
    const chatBot = document.querySelector('.chat-bot-container');
    if (chatBot && !chatBot.querySelector('.chat-bot-window.active')) {
        const notification = chatBot.querySelector('.chat-notification');
        if (notification) {
            notification.style.display = 'flex';
        }
    }
}, 10000);


