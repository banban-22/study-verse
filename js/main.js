// Main application functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize datetime display
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Focus mode functionality
    initializeFocusMode();
    
    // AI assistant prompt chips
    initializePromptChips();
    
    // Structured AI help modal
    initializeStructuredAiModal();
});

// Update date and time display
function updateDateTime() {
    const datetimeElement = document.getElementById('datetime');
    const now = new Date();
    
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    datetimeElement.textContent = now.toLocaleDateString('en-US', options);
}

// Focus Mode - dims everything except the timer
function initializeFocusMode() {
    const focusModeBtn = document.getElementById('focusModeBtn');
    const focusOverlay = document.getElementById('focusOverlay');
    const body = document.body;
    
    // Load saved focus mode state
    const isFocusMode = localStorage.getItem('focusMode') === 'true';
    if (isFocusMode) {
        enableFocusMode();
    }
    
    focusModeBtn.addEventListener('click', () => {
        if (body.classList.contains('focus-mode')) {
            disableFocusMode();
        } else {
            enableFocusMode();
        }
    });
    
    function enableFocusMode() {
        body.classList.add('focus-mode');
        focusOverlay.classList.add('active');
        focusModeBtn.classList.add('active');
        focusModeBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Exit Focus';
        localStorage.setItem('focusMode', 'true');
        
        // Show notification
        showNotification('Focus Mode Enabled', 'Only timer is visible. Stay focused! 🎯');
    }
    
    function disableFocusMode() {
        body.classList.remove('focus-mode');
        focusOverlay.classList.remove('active');
        focusModeBtn.classList.remove('active');
        focusModeBtn.innerHTML = '<i class="fas fa-eye"></i> Focus Mode';
        localStorage.setItem('focusMode', 'false');
        
        // Show notification
        showNotification('Focus Mode Disabled', 'All panels are now visible.');
    }
}

// Prompt chips functionality
function initializePromptChips() {
    const promptChips = document.querySelectorAll('.chip');
    
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const promptText = chip.getAttribute('data-prompt');
            copyToClipboard(promptText);
            
            // Visual feedback
            const originalText = chip.textContent;
            chip.textContent = '✓ Copied!';
            chip.style.background = 'var(--success-color)';
            chip.style.color = 'white';
            chip.style.borderColor = 'var(--success-color)';
            
            setTimeout(() => {
                chip.textContent = originalText;
                chip.style.background = '';
                chip.style.color = '';
                chip.style.borderColor = '';
            }, 1500);
        });
    });
}

// Structured AI Help Modal
function initializeStructuredAiModal() {
    const modal = document.getElementById('structuredAiModal');
    const openBtn = document.getElementById('structuredAiBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const copyBtn = document.getElementById('copyToClipboardBtn');
    const openChatGPTBtn = document.getElementById('openChatGPTBtn');
    const openGeminiBtn = document.getElementById('openGeminiBtn');
    
    const questionInput = document.getElementById('aiQuestion');
    const triedInput = document.getElementById('aiTried');
    const needInput = document.getElementById('aiNeed');
    
    // Open modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Copy template to clipboard
    copyBtn.addEventListener('click', () => {
        const format = document.querySelector('input[name="outputFormat"]:checked').value;
        const template = generateAiTemplate(
            questionInput.value,
            triedInput.value,
            needInput.value,
            format
        );
        
        copyToClipboard(template);
        showNotification('Template Copied!', 'Paste it into ChatGPT or Google AI Studio.');
    });
    
    // Open ChatGPT with template
    openChatGPTBtn.addEventListener('click', () => {
        const format = document.querySelector('input[name="outputFormat"]:checked').value;
        const template = generateAiTemplate(
            questionInput.value,
            triedInput.value,
            needInput.value,
            format
        );
        
        copyToClipboard(template);
        window.open('https://chat.openai.com', '_blank');
        showNotification('Opening ChatGPT', 'Your template is copied. Paste it to start!');
    });
    
    // Open Gemini with template
    openGeminiBtn.addEventListener('click', () => {
        const format = document.querySelector('input[name="outputFormat"]:checked').value;
        const template = generateAiTemplate(
            questionInput.value,
            triedInput.value,
            needInput.value,
            format
        );
        
        copyToClipboard(template);
        window.open('https://aistudio.google.com', '_blank');
        showNotification('Opening Google AI Studio', 'Your template is copied. Paste it to start!');
    });
}

// Generate AI help template
function generateAiTemplate(question, tried, need, format) {
    let formatInstruction = '';
    if (format === 'bullet') {
        formatInstruction = 'Please respond in bullet points.';
    } else if (format === 'steps') {
        formatInstruction = 'Please respond with step-by-step instructions.';
    } else if (format === 'example') {
        formatInstruction = 'Please respond with clear examples.';
    }
    
    return `I'm studying for an exam and need help understanding something.

Question: ${question || '[Your question here]'}

What I tried: ${tried || '[What you\'ve already attempted]'}

What I need: ${need || '[Specific help you need]'}

${formatInstruction}`;
}

// Copy to clipboard utility
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied!', `"${text}" copied to clipboard. Paste it in your AI assistant.`);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied!', `"${text}" copied to clipboard.`);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert(`Copy this text manually: ${text}`);
    }
    
    document.body.removeChild(textArea);
}

// Simple notification system
function showNotification(title, message) {
    // Check if notification already exists
    let notification = document.querySelector('.custom-notification');
    
    if (notification) {
        // Update existing notification
        notification.querySelector('.notification-title').textContent = title;
        notification.querySelector('.notification-message').textContent = message;
        notification.classList.remove('fade-out');
        notification.classList.add('fade-in');
    } else {
        // Create new notification
        notification = document.createElement('div');
        notification.className = 'custom-notification fade-in';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });
    }
    
    // Auto-close after 4 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            closeNotification(notification);
        }
    }, 4000);
}

function closeNotification(notification) {
    notification.classList.remove('fade-in');
    notification.classList.add('fade-out');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .custom-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        border-left: 4px solid var(--success-color);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
    }
    
    .custom-notification.fade-in {
        animation: slideIn 0.3s ease-out;
    }
    
    .custom-notification.fade-out {
        animation: slideOut 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .notification-icon {
        color: var(--success-color);
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .notification-text {
        flex: 1;
    }
    
    .notification-title {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
    }
    
    .notification-message {
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        font-size: 1rem;
        transition: color 0.3s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
`;
document.head.appendChild(notificationStyles);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F for focus mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('focusModeBtn').click();
    }
    
    // Ctrl/Cmd + Space to start/pause timer
    if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
        e.preventDefault();
        if (studyTimer.isRunning) {
            studyTimer.pause();
        } else {
            studyTimer.start();
        }
    }
});

// Show keyboard shortcuts on first visit
window.addEventListener('load', () => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        setTimeout(() => {
            showNotification(
                'Welcome to Your Study Space! 🎓',
                'Tip: Press Ctrl+F for Focus Mode, Ctrl+Space for timer control.'
            );
            localStorage.setItem('hasVisited', 'true');
        }, 1500);
    }
});
