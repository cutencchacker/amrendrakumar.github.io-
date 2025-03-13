// Typing effect
const typed = new Typed('.typed', {
    strings: [
        'Web Developer',
        'CSE Student',
        'NCC SUO Officer',
        'Problem Solver'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('.submit-btn');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    // Show loading state
    submitBtn.classList.add('loading');

    // Form validation
    const formInputs = this.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    formInputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        submitBtn.classList.remove('loading');
        showFormMessage('कृपया सभी आवश्यक फ़ील्ड भरें', 'error');
        return;
    }

    try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showFormMessage('आपका संदेश सफलतापूर्वक भेज दिया गया है!', 'success');
            this.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        showFormMessage('संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।', 'error');
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Function to show form messages
function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Remove any existing messages
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Add new message
    contactForm.insertBefore(messageDiv, contactForm.firstChild);

    // Remove message after 5 seconds if it's a success or error message
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Form input validation
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    input.addEventListener('input', function() {
        validateInput(this);
    });

    input.addEventListener('blur', function() {
        validateInput(this);
    });
});

function validateInput(input) {
    const inputGroup = input.closest('.input-group');

    if (input.required && !input.value) {
        inputGroup.classList.add('error');
        return false;
    }

    if (input.type === 'email' && !validateEmail(input.value)) {
        inputGroup.classList.add('error');
        return false;
    }

    if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
        inputGroup.classList.add('error');
        return false;
    }

    inputGroup.classList.remove('error');
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

// Certificates Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.gallery-scroll-container');
    const scrollProgress = document.querySelector('.scroll-progress');
    const modal = document.querySelector('.modal');
    const modalImg = modal.querySelector('img');
    const closeModal = document.querySelector('.close-modal');
    const certItems = document.querySelectorAll('.cert-item');

    // Start from top
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

    // Update scroll progress
    function updateScrollProgress() {
        if (scrollContainer) {
            const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            const scrolled = (scrollContainer.scrollTop / scrollHeight) * 100;
            scrollProgress.style.height = `${scrolled}%`;
        }
    }

    // Initialize scroll progress
    if (scrollContainer) {
        updateScrollProgress();

        // Smooth scrolling with mouse wheel
        scrollContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            scrollContainer.scrollTop += e.deltaY;
            updateScrollProgress();
        });

        scrollContainer.addEventListener('scroll', updateScrollProgress);
    }

    // Modal functionality
    certItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && img.src) {
                modalImg.src = img.src;
                modal.classList.add('show');
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('show');
        }
    });
});

// Live Chat Functionality
const messageInput = document.getElementById('messageInput');
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatMessages = document.getElementById('chatMessages');
const sendButton = document.getElementById('sendMessage');
const typingIndicator = document.querySelector('.typing-indicator');
let isFirstOpen = true;

// Welcome messages
const welcomeMessages = [
    "👋 नमस्ते! मैं अमरेंद्र कुमार का AI असिस्टेंट हूं।",
    "मैं आपकी कैसे सहायता कर सकता हूं?",
    "आप मुझसे निम्नलिखित विषयों पर पूछ सकते हैं:",
    "• प्रोजेक्ट्स और पोर्टफोलियो 💼",
    "• शैक्षिक योग्यता और अनुभव 🎓",
    "• तकनीकी कौशल और प्रमाणपत्र 💻",
    "• संपर्क जानकारी 📞"
];

// Initialize chat widget
document.addEventListener('DOMContentLoaded', function() {
    if (chatToggle && chatWidget) {
        chatToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleChat();
        });
    }

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (chatWidget && chatWidget.classList.contains('active')) {
            if (!chatWidget.contains(e.target) && !chatToggle.contains(e.target)) {
                chatWidget.classList.remove('active');
            }
        }
    });

    // Handle message sending
    if (sendButton && messageInput) {
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// Simple toggle function
function toggleChat() {
    if (!chatWidget) return;

    chatWidget.classList.toggle('active');
    if (chatWidget.classList.contains('active') && isFirstOpen) {
        showWelcomeMessages();
        isFirstOpen = false;
        if (messageInput) {
            messageInput.focus();
        }
    }
}

// Show welcome messages
function showWelcomeMessages() {
    let delay = 0;
    welcomeMessages.forEach((message) => {
        setTimeout(() => {
            addMessage(message, 'received');
        }, delay);
        delay += 1000;
    });
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(content);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'sent');
        messageInput.value = '';

        typingIndicator.classList.add('active');
        setTimeout(() => {
            typingIndicator.classList.remove('active');
            const response = getAutoResponse(message);
            addMessage(response, 'received');
        }, 1000);
    }
}

// Auto response function
function getAutoResponse(message) {
    message = message.toLowerCase();

    // Projects related queries
    if (message.includes('project') || message.includes('प्रोजेक्ट') || message.includes('काम') || message.includes('website')) {
        return `मेरे प्रमुख प्रोजेक्ट्स हैं:

1. ANK ENGINEER (https://ankengineeer.netlify.app/)
   • इंजीनियरिंग स्टडी प्लेटफॉर्म
   • सभी ब्रांच के लिए नोट्स और स्टडी मटेरियल
   • लाइव क्लासेस और डिस्कशन फोरम

2. AVP NOTES
   • बिहार बोर्ड कक्षा 1-12 के लिए स्टडी पोर्टल
   • विषय-वार नोट्स और प्रश्न बैंक
   • ऑनलाइन टेस्ट सीरीज

3. AVP GPT
   • AI आधारित चैटबॉट
   • अनलिमिटेड क्वेरीज
   • 24/7 सहायता उपलब्ध`;
    }

    // Education related queries
    if (message.includes('education') || message.includes('शिक्षा') || message.includes('पढ़ाई') || message.includes('study') || message.includes('qualification')) {
        return `मेरी शैक्षिक योग्यता और उपलब्धियां:

1. शैक्षिक योग्यता:
   • डिप्लोमा इन कंप्यूटर साइंस इंजीनियरिंग (2023-2026)
   • जगन्नाथ यूनिवर्सिटी से
   • वर्तमान सेमेस्टर: प्रथम वर्ष

2. NCC करियर:
   • सीनियर अंडर ऑफिसर (SUO) - सर्वोच्च रैंक
   • विभिन्न कैंप्स में भागीदारी
   • नेतृत्व और टीम मैनेजमेंट का अनुभव

3. अतिरिक्त योग्यताएं:
   • 20+ प्रोफेशनल सर्टिफिकेशन
   • वेब डेवलपमेंट में विशेषज्ञता
   • प्रोजेक्ट मैनेजमेंट स्किल्स`;
    }

    // Skills related queries
    if (message.includes('skill') || message.includes('कौशल') || message.includes('आता') || message.includes('technology') || message.includes('programming')) {
        return `मेरी तकनीकी और प्रोफेशनल स्किल्स:

1. प्रोग्रामिंग भाषाएं:
   • HTML5, CSS3 (90%)
   • JavaScript (80%)
   • Python (75%)
   • React.js (75%)

2. वेब टेक्नोलॉजीज:
   • Node.js (70%)
   • Bootstrap (85%)
   • MongoDB (70%)
   • रेस्पॉन्सिव डिज़ाइन

3. प्रोफेशनल स्किल्स:
   • प्रॉब्लम सॉल्विंग (90%)
   • टीम लीडरशिप (85%)
   • कम्युनिकेशन (85%)
   • प्रोजेक्ट मैनेजमेंट (80%)`;
    }

    // Contact related queries
    if (message.includes('contact') || message.includes('संपर्क') || message.includes('location') || message.includes('address') || message.includes('phone') || message.includes('email')) {
        return `मेरी संपर्क जानकारी:

1. संपर्क नंबर:
   📞 फोन: +91 9117484569
   ✉️ ईमेल: kumaramrendra87761@gmail.com

2. वर्तमान पता (राजस्थान):
   P-2 & 3, Phase IV, 
   Sitapura Industrial Area
   Opposite Chokhi Dhani
   Jaipur, Rajasthan - 302022

3. स्थायी पता (बिहार):
   West Champaran
   Bettiah, Bihar - 845438

4. सोशल मीडिया:
   • LinkedIn: @amrendra-kumar
   • GitHub: @cutencchacker
   • Instagram: @ncc_suo_amrendra`;
    }

    // Certificates related queries
    if (message.includes('certificate') || message.includes('सर्टिफिकेट') || message.includes('प्रमाणपत्र')) {
        return `मेरे प्रमुख सर्टिफिकेट्स:

1. तकनीकी सर्टिफिकेट्स:
   • वेब डेवलपमेंट
   • प्रोग्रामिंग लैंग्वेजेस
   • डेटाबेस मैनेजमेंट

2. NCC सर्टिफिकेट्स:
   • 'A' सर्टिफिकेट
   • कैंप सर्टिफिकेट्स
   • लीडरशिप अवार्ड्स

3. प्रोफेशनल कोर्स सर्टिफिकेट्स:
   • Udemy कोर्स
   • Coursera सर्टिफिकेशन
   • स्किल डेवलपमेंट प्रोग्राम्स`;
    }

    // NCC related queries
    if (message.includes('ncc') || message.includes('एनसीसी') || message.includes('army') || message.includes('सेना')) {
        return `मेरा NCC अनुभव:

1. रैंक और पद:
   • सीनियर अंडर ऑफिसर (SUO)
   • NCC में सर्वोच्च कैडेट रैंक
   • बटालियन का नेतृत्व

2. गतिविधियां:
   • परेड और मिलिट्री ट्रेनिंग
   • सामाजिक सेवा कार्यक्रम
   • नेशनल कैंप्स

3. उपलब्धियां:
   • नेतृत्व क्षमता विकास
   • टीम मैनेजमेंट
   • अनुशासन और समय प्रबंधन`;
    }

    // Achievement related queries
    if (message.includes('achievement') || message.includes('उपलब्धि') || message.includes('award') || message.includes('पुरस्कार')) {
        return `मेरी प्रमुख उपलब्धियां:

1. शैक्षिक उपलब्धियां:
   • टॉप परफॉर्मर - CSE
   • प्रोजेक्ट एक्सीलेंस अवार्ड
   • इनोवेशन अवार्ड्स

2. NCC उपलब्धियां:
   • बेस्ट कैडेट अवार्ड
   • लीडरशिप अवार्ड
   • सोशल सर्विस अवार्ड

3. प्रोफेशनल उपलब्धियां:
   • 50+ सफल प्रोजेक्ट्स
   • 20+ प्रोफेशनल सर्टिफिकेशन
   • टेक्निकल एक्सपर्टीज`;
    }

    // Default response for other queries
    return `नमस्ते! मैं आपकी मदद के लिए हाज़िर हूं। आप मुझसे निम्नलिखित विषयों पर पूछ सकते हैं:

1. प्रोजेक्ट्स और वेबसाइट्स 💻
2. शैक्षिक योग्यता और अनुभव 🎓
3. तकनीकी कौशल और प्रमाणपत्र 📜
4. NCC और लीडरशिप अनुभव 🎖️
5. संपर्क जानकारी और पता 📞
6. उपलब्धियां और पुरस्कार 🏆

कृपया अपना सवाल पूछें, मैं विस्तार से जवाब दूंगा।`;
}