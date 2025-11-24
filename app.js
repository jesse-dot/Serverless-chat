// Storage keys
const STORAGE_KEY = 'serverless_chat_conversations';
const ACTIVE_CONVERSATION_KEY = 'serverless_chat_active_conversation';

// State
let conversations = [];
let activeConversationId = null;

// ID generation helper
let idCounter = 0;
function generateId() {
    // Use random component to ensure uniqueness even across page reloads
    return `${Date.now()}-${++idCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

// DOM elements
const conversationList = document.getElementById('conversationList');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const deleteChatBtn = document.getElementById('deleteChatBtn');
const chatTitle = document.getElementById('chatTitle');
const editTitleBtn = document.getElementById('editTitleBtn');

// Initialize app
function init() {
    loadConversations();
    loadActiveConversation();
    renderConversationList();
    renderMessages();
    updateChatTitle();
    attachEventListeners();
    
    // If no conversations exist, create a default one
    if (conversations.length === 0) {
        createNewConversation();
    }
}

// Local Storage functions
function saveConversations() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
        console.error('Failed to save conversations:', error);
        alert('Failed to save conversations. Your storage may be full.');
    }
}

function loadConversations() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        conversations = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load conversations:', error);
        conversations = [];
    }
}

function saveActiveConversation() {
    try {
        localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversationId);
    } catch (error) {
        console.error('Failed to save active conversation:', error);
    }
}

function loadActiveConversation() {
    try {
        const stored = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
        if (stored && conversations.find(c => c.id === stored)) {
            activeConversationId = stored;
        } else if (conversations.length > 0) {
            activeConversationId = conversations[0].id;
        }
    } catch (error) {
        console.error('Failed to load active conversation:', error);
        if (conversations.length > 0) {
            activeConversationId = conversations[0].id;
        }
    }
}

// Conversation management
function createNewConversation() {
    const conversation = {
        id: generateId(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    conversations.unshift(conversation);
    activeConversationId = conversation.id;
    saveConversations();
    saveActiveConversation();
    renderConversationList();
    renderMessages();
    updateChatTitle();
}

function deleteConversation(id) {
    if (!confirm('Are you sure you want to delete this conversation?')) {
        return;
    }
    
    conversations = conversations.filter(c => c.id !== id);
    
    if (activeConversationId === id) {
        activeConversationId = conversations.length > 0 ? conversations[0].id : null;
        saveActiveConversation();
    }
    
    saveConversations();
    renderConversationList();
    renderMessages();
    updateChatTitle();
    
    // If no conversations left, create a new one
    if (conversations.length === 0) {
        createNewConversation();
    }
}

function switchConversation(id) {
    activeConversationId = id;
    saveActiveConversation();
    renderConversationList();
    renderMessages();
    updateChatTitle();
}

function clearAllConversations() {
    if (!confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
        return;
    }
    
    conversations = [];
    activeConversationId = null;
    saveConversations();
    localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    renderConversationList();
    renderMessages();
    createNewConversation();
}

function updateConversationTitle(id, newTitle) {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
        conversation.title = newTitle;
        conversation.updatedAt = new Date().toISOString();
        saveConversations();
        renderConversationList();
        updateChatTitle();
    }
}

function getActiveConversation() {
    return conversations.find(c => c.id === activeConversationId);
}

// Message management
function addMessage(role, content) {
    const conversation = getActiveConversation();
    if (!conversation) return;
    
    const message = {
        id: generateId(),
        role: role,
        content: content,
        timestamp: new Date().toISOString()
    };
    
    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();
    
    // Auto-update title based on first user message
    if (conversation.messages.length === 1 && role === 'user') {
        const autoTitle = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        conversation.title = autoTitle;
    }
    
    saveConversations();
    renderMessages();
    renderConversationList();
    updateChatTitle();
}

function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;
    
    addMessage('user', content);
    messageInput.value = '';
    autoResizeTextarea();
    
    // Simulate assistant response (echo for demo purposes)
    setTimeout(() => {
        const response = `Echo: ${content}`;
        addMessage('assistant', response);
    }, 500);
}

// Rendering functions
function renderConversationList() {
    conversationList.innerHTML = '';
    
    conversations.forEach(conversation => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        if (conversation.id === activeConversationId) {
            item.classList.add('active');
        }
        
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const preview = lastMessage ? lastMessage.content : 'No messages yet';
        
        item.innerHTML = `
            <div class="conversation-item-title">${escapeHtml(conversation.title)}</div>
            <div class="conversation-item-preview">${escapeHtml(preview)}</div>
        `;
        
        item.addEventListener('click', () => switchConversation(conversation.id));
        conversationList.appendChild(item);
    });
}

function renderMessages() {
    const conversation = getActiveConversation();
    
    if (!conversation || conversation.messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-state">
                <h2>Start a Conversation</h2>
                <p>Type a message below to begin chatting</p>
            </div>
        `;
        return;
    }
    
    chatMessages.innerHTML = '';
    
    conversation.messages.forEach(message => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.role}`;
        
        const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageEl.innerHTML = `
            <div class="message-content">
                ${escapeHtml(message.content)}
                <div class="message-timestamp">${timestamp}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageEl);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateChatTitle() {
    const conversation = getActiveConversation();
    chatTitle.textContent = conversation ? conversation.title : 'Serverless Chat';
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

// Event listeners
function attachEventListeners() {
    // Send message
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', autoResizeTextarea);
    
    // New conversation
    newChatBtn.addEventListener('click', createNewConversation);
    
    // Clear all
    clearAllBtn.addEventListener('click', clearAllConversations);
    
    // Delete current conversation
    deleteChatBtn.addEventListener('click', () => {
        if (activeConversationId) {
            deleteConversation(activeConversationId);
        }
    });
    
    // Edit title
    editTitleBtn.addEventListener('click', () => {
        const conversation = getActiveConversation();
        if (!conversation) return;
        
        const newTitle = prompt('Enter new title:', conversation.title);
        if (newTitle && newTitle.trim()) {
            updateConversationTitle(conversation.id, newTitle.trim());
        }
    });
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
