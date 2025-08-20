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

            // Set up global error handling
            this.setupErrorHandling();

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
     * Authenticate with Puter
     */
    async authenticateWithPuter() {
        try {
            console.log('🔑 Checking Puter authentication status...');
            
            // First, let's inspect what's available in the puter object
            console.log('Available puter methods:', Object.keys(puter));
            if (puter.auth) {
                console.log('Available auth methods:', Object.keys(puter.auth));
            }
            if (puter.user) {
                console.log('Available user methods:', Object.keys(puter.user));
            }
            
            // Check if already authenticated using different possible API patterns
            let isAuthenticated = false;
            let currentUser = null;
            
            try {
                // Try different possible authentication check methods
                if (puter.auth && typeof puter.auth.getUser === 'function') {
                    currentUser = await puter.auth.getUser();
                    isAuthenticated = !!currentUser;
                } else if (puter.user && typeof puter.user.whoami === 'function') {
                    currentUser = await puter.user.whoami();
                    isAuthenticated = !!currentUser;
                } else if (puter.auth && typeof puter.auth.isAuthenticated === 'function') {
                    isAuthenticated = await puter.auth.isAuthenticated();
                } else {
                    // Try to make a simple API call to test authentication
                    try {
                        // This should fail if not authenticated
                        await puter.ai.chat('test', { model: 'gpt-4o-mini', test: true });
                        isAuthenticated = true;
                        console.log('✅ Authentication verified through API test');
                    } catch (testError) {
                        if (testError.message && testError.message.includes('401')) {
                            isAuthenticated = false;
                            console.log('🔑 Not authenticated - received 401 error');
                        } else {
                            console.log('❓ Authentication status unclear:', testError.message);
                            // Assume not authenticated to be safe
                            isAuthenticated = false;
                        }
                    }
                }
                
                if (isAuthenticated) {
                    console.log('✅ Already authenticated', currentUser ? `as: ${currentUser.username || currentUser.name || 'user'}` : '');
                    return true;
                }
            } catch (error) {
                console.log('🔑 Authentication check failed, proceeding with sign-in:', error.message);
            }

            // Show authentication UI to the user
            return new Promise((resolve) => {
                this.showAuthUI(resolve);
            });
            
        } catch (error) {
            console.error('❌ Authentication process error:', error);
            this.showAuthError('Authentication process failed. Please refresh and try again.');
            return false;
        }
    }
    
    /**
     * Show authentication UI
     */
    showAuthUI(resolveCallback) {
        const authUI = document.createElement('div');
        authUI.id = 'puter-auth-ui';
        authUI.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        authUI.innerHTML = `
            <div style="
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            ">
                <h2 style="margin-top: 0;">Authentication Required</h2>
                <p style="margin-bottom: 20px;">Please sign in to your Puter account to use the AI services.</p>
                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Don't have an account? You'll be able to create one during the sign-in process.</p>
                <div id="puter-auth-status" style="margin-bottom: 20px; font-style: italic;">Ready to authenticate...</div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="puter-auth-button" style="
                        background-color: #007bff;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Sign In with Puter</button>
                    <button id="puter-skip-button" style="
                        background-color: #6c757d;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Try Without Auth</button>
                </div>
                <div style="margin-top: 15px; font-size: 12px; color: #999;">
                    Note: Some features may be limited without authentication
                </div>
            </div>
        `;
        
        document.body.appendChild(authUI);
        
        // Add click handler for the auth button
        document.getElementById('puter-auth-button').addEventListener('click', async () => {
            const statusEl = document.getElementById('puter-auth-status');
            const authBtn = document.getElementById('puter-auth-button');
            
            statusEl.textContent = 'Opening authentication...';
            authBtn.disabled = true;
            
            try {
                // Try different authentication methods
                let authResult = null;
                
                if (puter.auth && typeof puter.auth.signIn === 'function') {
                    authResult = await puter.auth.signIn();
                } else if (puter.auth && typeof puter.auth.login === 'function') {
                    authResult = await puter.auth.login();
                } else if (typeof puter.signIn === 'function') {
                    authResult = await puter.signIn();
                } else {
                    throw new Error('No authentication method found in Puter API');
                }
                
                statusEl.textContent = 'Authentication successful!';
                statusEl.style.color = '#28a745';
                
                // Hide auth UI and continue
                setTimeout(() => {
                    this.hideAuthUI();
                    if (authResult && authResult.username) {
                        this.showAuthSuccess(authResult.username);
                    }
                    resolveCallback(true);
                }, 1000);
                
            } catch (error) {
                console.error('Authentication error:', error);
                statusEl.textContent = `Authentication failed: ${error.message}`;
                statusEl.style.color = '#dc3545';
                authBtn.disabled = false;
            }
        });
        
        // Add click handler for skip button (try without auth)
        document.getElementById('puter-skip-button').addEventListener('click', () => {
            console.log('⚠️ Proceeding without authentication');
            this.hideAuthUI();
            resolveCallback(true); // Allow to proceed, but API calls may fail
        });
    }
    
    /**
     * Hide authentication UI
     */
    hideAuthUI() {
        const authUI = document.getElementById('puter-auth-ui');
        if (authUI) {
            authUI.remove();
        }
    }
    
    /**
     * Show authentication success message
     */
    showAuthSuccess(username) {
        const successToast = document.createElement('div');
        successToast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: fadeInOut 5s forwards;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        successToast.textContent = `Signed in as ${username}`;
        document.body.appendChild(successToast);
        
        // Remove after animation completes
        setTimeout(() => {
            successToast.remove();
        }, 5000);
    }
    
    /**
     * Show authentication error
     */
    showAuthError(message) {
        const authStatus = document.getElementById('puter-auth-status');
        if (authStatus) {
            authStatus.textContent = `Authentication error: ${message}`;
            authStatus.style.color = '#dc3545';
        }
    }

    /**
     * Initialize all application components
     */
    async initializeComponents() {
        // First authenticate with Puter
        const authenticated = await this.authenticateWithPuter();
        if (!authenticated) {
            throw new Error('Authentication required to use Puter AI services');
        }
        
        // Initialize Model Configuration
        if (window.PuterModelConfig) {
            this.modelConfig = new PuterModelConfig();
            console.log('✅ Model Configuration initialized');
            console.log('Available models:', this.modelConfig.getAllModels().length);
        } else {
            throw new Error('Model Configuration not available');
        }

        // Initialize Chat Memory
        if (window.PuterChatMemory) {
            this.chatMemory = new PuterChatMemory();
            this.chatMemory.initializeUI();
            console.log('✅ Chat Memory initialized');
        } else {
            throw new Error('Chat Memory not available');
        }

        // Initialize Sidebar Manager
        if (window.PuterSidebarManager) {
            this.sidebarManager = new PuterSidebarManager(this.modelConfig, this.chatMemory);
            window.puterSidebar = this.sidebarManager; // Make globally available
            console.log('✅ Sidebar Manager initialized');
        } else {
            throw new Error('Sidebar Manager not available');
        }
        
        // Initialize UI Manager
        if (window.puterUIManager) {
            puterUIManager.init();
            console.log('✅ UI Manager initialized');
        } else {
            throw new Error('UI Manager not available');
        }

        // Initialize Model Capabilities
        if (window.puterModelCapabilities) {
            console.log('✅ Model Capabilities loaded');
        } else {
            throw new Error('Model Capabilities not available');
        }

        // Initialize Chat Manager with memory support
        if (window.puterChatManager) {
            // Pass memory instance to chat manager if it supports it
            if (typeof puterChatManager.setMemory === 'function') {
                puterChatManager.setMemory(this.chatMemory);
            }
            console.log('✅ Chat Manager initialized');
        } else {
            throw new Error('Chat Manager not available');
        }

        // Set up model change listener
        document.addEventListener('modelChanged', (event) => {
            console.log('Model changed:', event.detail.model.name);
            this.handleModelChange(event.detail);
        });
        
        // Trigger initial UI update now that model config is available
        if (window.puterUIManager && typeof puterUIManager.updateUI === 'function') {
            puterUIManager.updateUI();
        }
    }

    /**
     * Set up global error handling
     */
    setupErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason);
        });

        // Handle general errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event.error);
        });
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
     * Handle global errors
     */
    handleGlobalError(error) {
        if (!this.isInitialized) return;

        console.error('Global error handled:', error);
        
        // Don't show error for minor issues
        if (error.message && (
            error.message.includes('ResizeObserver') ||
            error.message.includes('Non-Error promise rejection')
        )) {
            return;
        }

        // Show user-friendly error message
        if (puterUIManager && typeof puterUIManager.showError === 'function') {
            puterUIManager.showError('An unexpected error occurred. Please refresh the page if issues persist.');
        }
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
     * Handle model change events
     */
    handleModelChange(modelData) {
        const { model, capabilities } = modelData;
        
        // Update UI based on model capabilities
        this.updateUIForModel(model, capabilities);
        
        // Also trigger UI manager update
        if (window.puterUIManager && typeof puterUIManager.updateUI === 'function') {
            puterUIManager.currentModel = model.id;
            puterUIManager.updateUI();
        }
        
        // Log model change for debugging
        console.log(`Model changed to: ${model.name} (${model.provider})`);
        console.log('Capabilities:', capabilities);
    }

    /**
     * Update UI elements based on selected model
     */
    updateUIForModel(model, capabilities) {
        // Update main model selector
        const mainSelector = document.getElementById('modelSelect');
        if (mainSelector) {
            mainSelector.value = model.id;
        }

        // Update placeholder text based on model type
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            if (capabilities.imageGeneration) {
                messageInput.placeholder = `Describe an image for ${model.name} to generate...`;
            } else if (capabilities.vision) {
                messageInput.placeholder = `Ask ${model.name} about text or images...`;
            } else {
                messageInput.placeholder = `Chat with ${model.name}...`;
            }
        }

        // Show/hide file upload - only for GPT-4 Vision
        const fileUpload = document.querySelector('.file-upload');
        if (fileUpload) {
            // Only show for GPT-4 Vision (model.id === 'gpt-4' and has image input support)
            const showFileUpload = model.id === 'gpt-4' && capabilities.supportsImageInput;
            fileUpload.style.display = showFileUpload ? 'block' : 'none';
            
            // Update tooltip when visible
            if (showFileUpload) {
                const fileInput = document.getElementById('fileInput');
                const fileBtn = document.querySelector('.file-btn');
                if (fileInput) fileInput.title = 'Upload images for GPT-4 Vision analysis';
                if (fileBtn) fileBtn.title = 'Upload images for GPT-4 Vision';
            }
        }
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
