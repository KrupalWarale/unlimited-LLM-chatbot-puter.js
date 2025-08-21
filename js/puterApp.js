/**
 * Puter AI Chatbot Application
 * Main entry point and application orchestrator
 */

class PuterApp {
    constructor() {
        this.isInitialized = false;
        this.version = '1.0.0';
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🤖 Initializing Puter AI Chatbot v' + this.version);
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Wait for Puter to be available
            await this.waitForPuter();

            // Initialize components
            await this.initializeComponents();

            // Set up keyboard shortcuts
            this.setupKeyboardShortcuts();

            this.isInitialized = true;
            console.log('✅ Puter AI Chatbot initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Puter AI Chatbot:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Wait for Puter library to be available
     */
    async waitForPuter(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkPuter = () => {
                if (typeof puter !== 'undefined' && puter.ai) {
                    console.log('✅ Puter.js library loaded');
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Puter.js library failed to load within timeout'));
                } else {
                    setTimeout(checkPuter, 100);
                }
            };
            
            checkPuter();
        });
    }
    


    /**
     * Initialize all application components
     */
    async initializeComponents() {
        // Debug: Check what's available
        console.log('🔍 Checking available components:');
        console.log('- PuterUIManager class:', typeof PuterUIManager);
        console.log('- window.puterUIManager:', typeof window.puterUIManager);
        console.log('- puterUIManager:', typeof puterUIManager);
        
        // Initialize UI Manager
        if (window.puterUIManager) {
            puterUIManager.init();
            console.log('✅ UI Manager initialized');
        } else if (typeof PuterUIManager !== 'undefined') {
            // Fallback: create instance if class exists but global instance doesn't
            window.puterUIManager = new PuterUIManager();
            puterUIManager.init();
            console.log('✅ UI Manager initialized (fallback)');
        } else {
            throw new Error('UI Manager not available');
        }

        // Initialize Model Capabilities
        if (window.puterModelCapabilities) {
            console.log('✅ Model Capabilities loaded');
        } else {
            throw new Error('Model Capabilities not available');
        }

        // Initialize Chat Manager
        if (window.puterChatManager) {
            console.log('✅ Chat Manager initialized');
        } else {
            throw new Error('Chat Manager not available');
        }
    }



    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to send message
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const sendButton = document.getElementById('streamButton'); // Using streamButton as main send
                if (sendButton && !sendButton.disabled) {
                    sendButton.click();
                }
            }

            // Escape to clear input
            if (e.key === 'Escape') {
                const messageInput = document.getElementById('messageInput');
                if (messageInput && messageInput.value) {
                    messageInput.value = '';
                    messageInput.focus();
                }
            }

            // Ctrl/Cmd + K to focus on input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                    messageInput.focus();
                }
            }

            // F1 to show help
            if (e.key === 'F1') {
                e.preventDefault();
                this.showHelp();
            }
        });
    }



    /**
     * Show initialization error
     */
    showInitializationError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
        `;
        
        errorContainer.innerHTML = `
            <h3 style="color: #dc3545; margin-bottom: 16px;">
                ❌ Initialization Error
            </h3>
            <p style="margin-bottom: 16px; color: #495057;">
                Failed to initialize the Puter AI Chatbot:
            </p>
            <p style="font-family: monospace; background: #f1f3f4; padding: 8px; border-radius: 4px; margin-bottom: 16px; color: #666;">
                ${error.message}
            </p>
            <button onclick="window.location.reload()" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            ">
                Refresh Page
            </button>
        `;
        
        document.body.appendChild(errorContainer);
    }



    /**
     * Show help dialog
     */
    showHelp() {
        const modelCount = this.modelConfig ? this.modelConfig.getAllModels().length : 'many';
        const helpContent = `
        <div style="max-width: 600px;">
            <h3>🤖 Puter AI Chatbot Help</h3>
            
            <h4>Available Models (${modelCount} total):</h4>
            <ul>
                <li><strong>💬 Chat Models:</strong> GPT-4o, Claude, Gemini, Llama, and more</li>
                <li><strong>👁️ Vision Models:</strong> Analyze and understand images</li>
                <li><strong>🎨 Text-to-Image:</strong> Generate images from descriptions</li>
                <li><strong>📝 Image-to-Text:</strong> Extract text and describe images</li>
                <li><strong>🔊 Text-to-Speech:</strong> Convert text to natural speech</li>
            </ul>
            
            <h4>Features:</h4>
            <ul>
                <li>📝 Advanced text conversations with context memory</li>
                <li>🖼️ Image analysis (drag & drop or click to upload)</li>
                <li>🎨 Image generation from text descriptions</li>
                <li>⚡ Streaming responses for real-time interaction</li>
                <li>💾 Persistent chat memory across sessions</li>
                <li>🔧 Organized model categories in sidebar</li>
                <li>⚙️ Customizable model parameters</li>
            </ul>
            
            <h4>Sidebar Features:</h4>
            <ul>
                <li><strong>Model Categories:</strong> Browse models by type</li>
                <li><strong>Chat Memory:</strong> Clear history or export conversations</li>
                <li><strong>Model Info:</strong> View capabilities and details</li>
                <li><strong>Quick Selection:</strong> One-click model switching</li>
            </ul>
            
            <h4>Keyboard Shortcuts:</h4>
            <ul>
                <li><kbd>Ctrl/Cmd + Enter:</kbd> Send message</li>
                <li><kbd>Escape:</kbd> Clear input</li>
                <li><kbd>Ctrl/Cmd + K:</kbd> Focus input</li>
                <li><kbd>F1:</kbd> Show this help</li>
            </ul>
            
            <h4>Tips:</h4>
            <ul>
                <li>Use the sidebar to explore different AI models</li>
                <li>Enable "Remember Chat" to maintain conversation context</li>
                <li>Try vision models with image uploads for analysis</li>
                <li>Use text-to-image models for creative generation</li>
                <li>Export your chat history to save important conversations</li>
            </ul>
        </div>
        `;
        
        this.showModal('Help', helpContent);
    }

    /**
     * Show modal dialog
     */
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 8px;
                padding: 24px;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
                <button onclick="this.closest('.modal').remove()" style="
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
                <h2 style="margin-bottom: 20px;">${title}</h2>
                ${content}
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            version: this.version,
            initialized: this.isInitialized,
            puterLoaded: typeof puter !== 'undefined',
            componentsLoaded: {
                uiManager: !!window.puterUIManager,
                chatManager: !!window.puterChatManager,
                modelCapabilities: !!window.puterModelCapabilities
            }
        };
    }
}

// Initialize the application when DOM is ready
const puterApp = new PuterApp();

// Start initialization
puterApp.init().catch(error => {
    console.error('Failed to start Puter AI Chatbot:', error);
});

// Make app available globally for debugging
window.puterApp = puterApp;

// Event Listeners (ensure these are present)
const streamButton = document.getElementById('streamButton');
if (streamButton) {
    streamButton.addEventListener('click', () => {
        console.log('Send button clicked!');
        // Original send logic would go here
    });
}

const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', (event) => {
        console.log('File input changed!', event.target.files);
        // Original file handling logic would go here
    });
}
