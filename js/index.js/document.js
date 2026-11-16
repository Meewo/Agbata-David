document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. MOBILE MENU TOGGLE
    // ==========================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ==========================================
    // 2. AI CHAT WIDGET TOGGLE
    // ==========================================
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatModal = document.getElementById('ai-chat-modal');
    const closeBtn = document.getElementById('ai-close-btn');

    if (chatBtn && chatModal) {
        chatBtn.addEventListener('click', () => {
            chatModal.classList.toggle('hidden');
            if (!chatModal.classList.contains('hidden')) {
                document.getElementById('ai-chat-input').focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            chatModal.classList.add('hidden');
        });
    }

    // ==========================================
    // 3. AI CHAT & GENERATIVE MEDIA ENGINE
    // ==========================================
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const chatMessages = document.getElementById('ai-chat-messages');
    const quickPrompts = document.querySelectorAll('.ai-quick-prompt');

    // Helper to append messages to chat window
    function appendMessage(sender, htmlContent, isMedia = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex gap-2 items-start ${sender === 'user' ? 'flex-row-reverse' : ''}`;
        
        const avatar = document.createElement('div');
        avatar.className = `w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 font-bold ${sender === 'user' ? 'bg-indigo-600' : 'bg-purple-600'}`;
        avatar.textContent = sender === 'user' ? 'You' : 'AI';

        const bubble = document.createElement('div');
        bubble.className = `glass-card p-3 rounded-2xl text-slate-200 text-xs sm:text-sm max-w-[80%] ${
            sender === 'user' 
                ? 'rounded-tr-none bg-purple-600/20 border-purple-500/30' 
                : 'rounded-tl-none bg-white/5 border-white/10'
        }`;
        
        if (isMedia) {
            bubble.innerHTML = htmlContent;
        } else {
            bubble.textContent = htmlContent;
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show loading skeleton while AI processes media/response
    function showLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = id;
        loadingDiv.className = 'flex gap-2 items-start';
        loadingDiv.innerHTML = `
            <div class="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs shrink-0 font-bold">AI</div>
            <div class="glass-card p-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-slate-300 text-xs flex items-center gap-2">
                <i class="fa-solid fa-spinner animate-spin text-purple-400"></i>
                <span>Processing your creative request... (Generating media)</span>
            </div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeLoadingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Core AI Response Handler
    async function handleUserQuery(promptText) {
        if (!promptText.trim()) return;

        // 1. Show User Message
        appendMessage('user', promptText);
        chatInput.value = '';

        const lowerPrompt = promptText.toLowerCase();
        const loadingId = showLoadingIndicator();

        // Simulate network delay / API call execution
        setTimeout(async () => {
            removeLoadingIndicator(loadingId);

            // Check if user is asking to generate an Image
            if (lowerPrompt.includes('generate image') || lowerPrompt.includes('create an image') || lowerPrompt.includes('draw') || lowerPrompt.includes('picture of')) {
                // Extract description or fallback
                const imageQuery = encodeURIComponent(promptText.replace(/generate image|create an image|draw|picture of/gi, '').trim() || 'futuristic video editing suite cyberpunk style');
                // Using high-quality Unsplash source as a fast, reliable stand-in for AI generation endpoints (or plug in your DALL-E endpoint URL here)
                const imageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800`;
                
                const htmlResponse = `
                    <p class="mb-2 text-purple-300 font-semibold">🎨 Here is your generated image based on: "${promptText}"</p>
                    <div class="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <img src="${imageUrl}" alt="AI Generated Image" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-500">
                    </div>
                `;
                appendMessage('ai', htmlResponse, true);
            } 
            // Check if user is asking to generate a Video
            else if (lowerPrompt.includes('generate video') || lowerPrompt.includes('create video') || lowerPrompt.includes('video of') || lowerPrompt.includes('animation')) {
                // Using a high-res looping MP4 video sample as a stand-in for AI video generation outputs (Sora / Runway / Replicate)
                const videoSampleUrl = `https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31918-large.mp4`;
                
                const htmlResponse = `
                    <p class="mb-2 text-purple-300 font-semibold">🎬 Here is your AI-generated video clip for: "${promptText}"</p>
                    <div class="rounded-xl overflow-hidden border border-white/10 shadow-lg relative">
                        <video src="${videoSampleUrl}" autoplay loop muted playsinline class="w-full h-48 object-cover"></video>
                    </div>
                `;
                appendMessage('ai', htmlResponse, true);
            } 
            // Standard Text / Portfolio Questions about David
            else {
                let aiReply = "I can help you with that! Agbata David is a professional editor (founder of Davelins Edits) and web developer specializing in React and Tailwind CSS. You can reach him directly via WhatsApp at +234 904 193 9644 or call 09041939644.";
                
                if (lowerPrompt.includes('service') || lowerPrompt.includes('offer')) {
                    aiReply = "David offers Professional Video & Reel Editing (TikTok optimized), Content Copy Editing, Visual FX Styling, and Custom Web Development (React, Next.js, Node.js, Tailwind CSS).";
                } else if (lowerPrompt.includes('hire') || lowerPrompt.includes('contact') || lowerPrompt.includes('price') || lowerPrompt.includes('rate')) {
                    aiReply = "You can hire David immediately! Click the 'WhatsApp Me' button in the contact section or call him directly at 09041939644.";
                } else if (lowerPrompt.includes('davelins')) {
                    aiReply = "Davelins Edits is David's official brand hub for high-end video productions, TikTok trends, cinematic motion graphics, and content styling.";
                }

                appendMessage('ai', aiReply);
            }
        }, 1200);
    }

    // Event listener for chat form submission
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUserQuery(chatInput.value);
        });
    }

    // Event listeners for quick prompt chips
    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const promptText = btn.getAttribute('data-prompt') || btn.textContent;
            handleUserQuery(promptText);
        });
    });
});