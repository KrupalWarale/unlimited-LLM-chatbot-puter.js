/**
 * Chat Memory Manager for Puter.js AI Chatbot
 * Handles persistent chat history and context management
 */

class PuterChatMemory {
    constructor() {
        this.storageKey = 'puter_chat_memory';
        this.maxMessages = 100; // Maximum messages to store
        this.maxContextMessages = 20; // Maximum messages to send as context
        this.chatHistory = this.loadFromStorage();
        this.currentSession = this.generateSessionId();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addMessage(message) {
        const messageWithMetadata = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            session: this.currentSession,
            ...message
        };

        this.chatHistory.push(messageWithMetadata);

        // Trim history if it exceeds max messages
        if (this.chatHistory.length > this.maxMessages) {
            this.chatHistory = this.chatHistory.slice(-this.maxMessages);
        }

        this.saveToStorage();
        this.updateMemoryUI();
        
        return messageWithMetadata;
    }

    getRecentMessages(count = this.maxContextMessages) {
        return this.chatHistory.slice(-count);
    }

    getContextForModel(includeSystemPrompt = true) {
        const recentMessages = this.getRecentMessages();
        const context = [];

        if (includeSystemPrompt && recentMessages.length > 0) {
            context.push({
                role: 'system',
                content: 'You are a helpful AI assistant. Previous conversation context is provided to maintain continuity.'
            });
        }

        // Convert messages to format expected by AI models
        recentMessages.forEach(msg => {
            if (msg.role === 'user' || msg.role === 'assistant') {
                context.push({
                    role: msg.role,
                    content: msg.content,
                    ...(msg.images && { images: msg.images })
                });
            }
        });

        return context;
    }

    clearHistory() {
        this.chatHistory = [];
        this.currentSession = this.generateSessionId();
        this.saveToStorage();
        this.updateMemoryUI();
    }

    exportHistory(format = 'json') {
        const exportData = {
            exportDate: new Date().toISOString(),
            totalMessages: this.chatHistory.length,
            sessions: this.groupBySession(),
            messages: this.chatHistory
        };

        if (format === 'json') {
            return JSON.stringify(exportData, null, 2);
        } else if (format === 'txt') {
            return this.formatAsText(exportData);
        }

        return exportData;
    }

    groupBySession() {
        const sessions = {};
        this.chatHistory.forEach(msg => {
            if (!sessions[msg.session]) {
                sessions[msg.session] = [];
            }
            sessions[msg.session].push(msg);
        });
        return sessions;
    }

    formatAsText(exportData) {
        let text = `Chat History Export - ${exportData.exportDate}\n`;
        text += `Total Messages: ${exportData.totalMessages}\n\n`;

        Object.entries(exportData.sessions).forEach(([sessionId, messages]) => {
            text += `=== Session: ${sessionId} ===\n`;
            messages.forEach(msg => {
                const timestamp = new Date(msg.timestamp).toLocaleString();
                text += `[${timestamp}] ${msg.role.toUpperCase()}: ${msg.content}\n`;
                if (msg.images && msg.images.length > 0) {
                    text += `  Images: ${msg.images.length} attached\n`;
                }
            });
            text += '\n';
        });

        return text;
    }

    downloadExport(format = 'json') {
        const data = this.exportHistory(format);
        const filename = `puter_chat_export_${new Date().toISOString().split('T')[0]}.${format}`;
        
        const blob = new Blob([data], { 
            type: format === 'json' ? 'application/json' : 'text/plain' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Failed to load chat history from storage:', error);
            return [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('Failed to save chat history to storage:', error);
        }
    }

    updateMemoryUI() {
        const memoryCount = document.getElementById('memoryCount');
        if (memoryCount) {
            const count = this.chatHistory.length;
            memoryCount.textContent = `${count} message${count !== 1 ? 's' : ''} stored`;
        }
    }

    getMemoryStats() {
        const sessions = this.groupBySession();
        return {
            totalMessages: this.chatHistory.length,
            totalSessions: Object.keys(sessions).length,
            currentSession: this.currentSession,
            oldestMessage: this.chatHistory.length > 0 ? this.chatHistory[0].timestamp : null,
            newestMessage: this.chatHistory.length > 0 ? this.chatHistory[this.chatHistory.length - 1].timestamp : null
        };
    }

    searchHistory(query, options = {}) {
        const {
            role = null, // 'user' or 'assistant'
            session = null,
            dateFrom = null,
            dateTo = null,
            caseSensitive = false
        } = options;

        return this.chatHistory.filter(msg => {
            // Text search
            const content = caseSensitive ? msg.content : msg.content.toLowerCase();
            const searchQuery = caseSensitive ? query : query.toLowerCase();
            const matchesText = content.includes(searchQuery);

            // Role filter
            const matchesRole = !role || msg.role === role;

            // Session filter
            const matchesSession = !session || msg.session === session;

            // Date filters
            const msgDate = new Date(msg.timestamp);
            const matchesDateFrom = !dateFrom || msgDate >= new Date(dateFrom);
            const matchesDateTo = !dateTo || msgDate <= new Date(dateTo);

            return matchesText && matchesRole && matchesSession && matchesDateFrom && matchesDateTo;
        });
    }

    // Initialize memory UI when DOM is ready
    initializeUI() {
        // Update memory count
        this.updateMemoryUI();

        // Bind memory control buttons
        const clearMemoryBtn = document.getElementById('clearMemory');
        const exportMemoryBtn = document.getElementById('exportMemory');

        if (clearMemoryBtn) {
            clearMemoryBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
                    this.clearHistory();
                    // Show success message
                    this.showMemoryMessage('Chat history cleared successfully', 'success');
                }
            });
        }

        if (exportMemoryBtn) {
            exportMemoryBtn.addEventListener('click', () => {
                this.downloadExport('json');
                this.showMemoryMessage('Chat history exported successfully', 'success');
            });
        }
    }

    showMemoryMessage(message, type = 'info') {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `memory-message memory-message-${type}`;
        messageEl.textContent = message;
        
        const memoryControls = document.querySelector('.memory-controls');
        if (memoryControls) {
            memoryControls.appendChild(messageEl);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 3000);
        }
    }
}

// Export for use in other modules
window.PuterChatMemory = PuterChatMemory;