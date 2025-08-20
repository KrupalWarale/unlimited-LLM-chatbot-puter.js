/**
 * Puter UI Manager
 * Handles all UI interactions and dynamic interface updates
 */

class PuterUIManager {
    constructor() {
        this.elements = {
            modelSelect: null,
            messageInput: null,
            fileInput: null,
            sendButton: null, // Will be the streamButton
            messages: null,
            testMode: null,
            streamMode: null,
            toggleParams: null,
            modelParams: null,
            maxTokensInput: null,
            temperatureInput: null,
            exampleButtons: null,
            examplesPanel: null,
            settingsSidebar: null, // New element
            closeSidebarButton: null // New element
        };
        
        this.currentModel = 'gpt-4-nano';
        this.uploadedImages = [];
        this.isProcessing = false;
    }

    /**
     * Initialize the UI manager
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.updateUI();
        this.showWelcomeMessage();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.elements.modelSelect = document.getElementById('modelSelect');
        this.elements.messageInput = document.getElementById('messageInput');
        this.elements.fileInput = document.getElementById('fileInput');
        this.elements.sendButton = document.getElementById('streamButton'); // Using streamButton as the main send
        this.elements.messages = document.getElementById('messages');
        this.elements.testMode = document.getElementById('testMode');
        this.elements.streamMode = document.getElementById('streamMode');
        this.elements.toggleParams = document.getElementById('toggleParams');
        this.elements.modelParams = document.querySelector('.model-params');
        this.elements.maxTokensInput = document.getElementById('maxTokensInput');
        this.elements.temperatureInput = document.getElementById('temperatureInput');
        this.elements.exampleButtons = document.querySelectorAll('.example-btn, .suggestion');
        this.elements.examplesPanel = document.querySelector('.examples-panel');
        this.elements.settingsSidebar = document.getElementById('settingsSidebar'); // Bind new sidebar
        this.elements.closeSidebarButton = this.elements.settingsSidebar.querySelector('.close-sidebar'); // Bind close button
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Model selection
        this.elements.modelSelect.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.updateUI();
        });

        // Send button (always streams)
        this.elements.sendButton.addEventListener('click', () => {
            this.handleSend(true); // Always use streaming
        });

        // Enter key in textarea  
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend(true); // Always use streaming
            }
        });

        // File input
        this.elements.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Settings toggle
        this.elements.toggleParams.addEventListener('click', () => {
            this.elements.settingsSidebar.classList.toggle('open'); // Toggle open class on sidebar
        });

        // Close sidebar button
        if (this.elements.closeSidebarButton) {
            this.elements.closeSidebarButton.addEventListener('click', () => {
                this.elements.settingsSidebar.classList.remove('open'); // Close sidebar
            });
        }

        // Example/suggestion buttons
        if (this.elements.exampleButtons) {
            this.elements.exampleButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const text = btn.getAttribute('data-text') || btn.textContent.trim();
                    this.handleExampleClick(text);
                });
            });
        }

        // Drag and drop for images
        this.setupDragAndDrop();
    }

    /**
     * Set up drag and drop functionality
     */
    setupDragAndDrop() {
        const dropZone = document.body;

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            if (!dropZone.contains(e.relatedTarget)) {
                dropZone.classList.remove('drag-over');
            }
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files).filter(file => 
                file.type.startsWith('image/')
            );
            
            if (files.length > 0) {
                this.handleFileUpload(files);
            }
        });
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(files) {
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                try {
                    const imageUrl = await this.fileToBase64(file);
                    this.uploadedImages.push({
                        file: file,
                        url: imageUrl,
                        name: file.name
                    });
                    this.displayUploadedImage(imageUrl, file.name);
                } catch (error) {
                    this.showError(`Failed to upload ${file.name}`);
                }
            }
        }
    }

    /**
     * Convert file to base64
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Display uploaded image in UI
     */
    displayUploadedImage(imageUrl, fileName) {
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        imagePreview.innerHTML = `
            <img src="${imageUrl}" alt="${fileName}">
            <span class="image-name">${fileName}</span>
            <button class="remove-image" onclick="puterUIManager.removeImage('${fileName}')">×</button>
        `;
        
        this.elements.messages.appendChild(imagePreview);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    /**
     * Remove uploaded image
     */
    removeImage(fileName) {
        this.uploadedImages = this.uploadedImages.filter(img => img.name !== fileName);
        
        const previews = document.querySelectorAll('.image-preview');
        previews.forEach(preview => {
            if (preview.querySelector('.image-name').textContent === fileName) {
                preview.remove();
            }
        });
    }

    /**
     * Handle example button clicks
     */
    handleExampleClick(example) {
        if (example === 'vision') {
            if (this.uploadedImages.length === 0) {
                this.showError('Please upload an image first for vision analysis');
                return;
            }
            this.elements.messageInput.value = 'What do you see in this image?';
        } else {
            this.elements.messageInput.value = example;
            
            // Switch to appropriate model for image generation
            if (example.includes('Generate') || example.includes('cityscape')) {
                this.elements.modelSelect.value = 'dall-e-3';
                this.currentModel = 'dall-e-3';
                this.updateUI();
            }
        }
    }

    /**
     * Handle send button click
     */
    async handleSend(useStreaming = false) {
        if (this.isProcessing) return;

        const message = this.elements.messageInput.value.trim();
        const hasImages = this.uploadedImages.length > 0;
        
        if (!message && !hasImages) {
            this.showError('Please enter a message or upload an image');
            return;
        }

        // Validate input against model capabilities
        const validation = puterModelCapabilities.validateInput(
            this.currentModel, 
            !!message, 
            hasImages
        );
        
        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }

        this.isProcessing = true;
        this.setButtonsState(false);
        this.setSendButtonLoading(true);

        try {
            // Debug image information
            if (this.uploadedImages.length > 0) {
                console.log('🖼️ Images being sent:', this.uploadedImages.length);
                this.uploadedImages.forEach((img, index) => {
                    console.log(`Image ${index + 1}:`, {
                        name: img.name,
                        size: img.file?.size || 'unknown',
                        type: img.file?.type || 'unknown',
                        urlPreview: img.url?.substring(0, 50) + '...' || 'no URL'
                    });
                });
            }
            
            // Display user message
            this.displayMessage(message, 'user', this.uploadedImages);
            
            // Clear input and images
            this.elements.messageInput.value = '';
            const imagesToSend = [...this.uploadedImages];
            this.uploadedImages = [];
            
            // Clear image previews
            document.querySelectorAll('.image-preview').forEach(preview => preview.remove());
            
            // Send to chat manager
            await puterChatManager.sendMessage(message, imagesToSend, useStreaming);
            
        } catch (error) {
            this.showError(`Failed to send message: ${error.message}`);
        } finally {
            this.isProcessing = false;
            this.setButtonsState(true);
            this.setSendButtonLoading(false);
        }
    }

    /**
     * Update UI based on current model selection
     */
    updateUI() {
        const model = puterModelCapabilities.getModel(this.currentModel);
        if (!model) return;

        // Update file input accept types
        if (model.supports.vision || model.supports.images) {
            this.elements.fileInput.style.display = 'block';
            this.elements.fileInput.parentElement.style.display = 'block';
        } else {
            this.elements.fileInput.style.display = 'none';
            this.elements.fileInput.parentElement.style.display = 'none';
        }

        // Send button is always visible (streaming when supported)
        this.elements.sendButton.style.display = 'inline-block';

        // Update test mode checkbox visibility
        if (model.supports.testMode) {
            this.elements.testMode.parentElement.style.display = 'block';
        } else {
            this.elements.testMode.parentElement.style.display = 'none';
        }

        // Update placeholder text
        if (model.type === 'image-generation') {
            this.elements.messageInput.placeholder = 'Describe the image you want to generate...';
        } else if (model.supports.vision) {
            this.elements.messageInput.placeholder = 'Type your message or ask about an image...';
        } else {
            this.elements.messageInput.placeholder = 'Type your message...';
        }

        // Update model parameter inputs
        this.elements.maxTokensInput.value = model.parameters.max_tokens || 1000;
        this.elements.temperatureInput.value = model.parameters.temperature || 0.7;
    }

    /**
     * Get current model parameters from UI
     */
    getCurrentModelParameters() {
        return {
            max_tokens: parseInt(this.elements.maxTokensInput.value, 10),
            temperature: parseFloat(this.elements.temperatureInput.value)
        };
    }

    /**
     * Display a message in the chat
     */
    displayMessage(content, sender, images = [], isStreaming = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        let html = '';
        
        if (images && images.length > 0) {
            html += '<div class="message-images">';
            images.forEach(img => {
                html += `<img src="${img.url}" alt="${img.name}" class="message-image">`;
            });
            html += '</div>';
        }
        
        if (content) {
            html += `<div class="message-content">${this.formatContent(content)}</div>`;
        }
        // Removed typing-indicator logic
        messageDiv.innerHTML = html;
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }

    /**
     * Display an AI-generated image
     */
    displayGeneratedImage(imageElement) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'generated-image-container';
        imageContainer.appendChild(imageElement);
        
        messageDiv.appendChild(imageContainer);
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Update streaming message content
     */
    updateStreamingMessage(messageDiv, content) {
        // Only update the message content, no typing indicator
        const contentDiv = messageDiv.querySelector('.message-content');
        if (contentDiv) {
            contentDiv.innerHTML = this.formatContent(content);
        } else {
            // If not present, create it
            const newContentDiv = document.createElement('div');
            newContentDiv.className = 'message-content';
            newContentDiv.innerHTML = this.formatContent(content);
            messageDiv.appendChild(newContentDiv);
        }
        this.scrollToBottom();
    }

    /**
     * Complete streaming message
     */
    completeStreamingMessage(messageDiv) {
        // No typing indicator to remove anymore
    }

    /**
     * Format message content
     */
    formatContent(content) {
        if (!content) return '';
        
        // If content is not a string, convert it to string first
        if (typeof content !== 'string') {
            console.log('🔧 Converting non-string content to string:', typeof content, content);
            
            // Try to extract meaningful content from objects
            if (typeof content === 'object' && content !== null) {
                // If it's an object, try to stringify it nicely
                try {
                    content = JSON.stringify(content, null, 2);
                } catch (e) {
                    content = String(content);
                }
            } else {
                content = String(content);
            }
        }
        
        // Replace newlines with <br>
        content = content.replace(/\n/g, '<br>');
        
        // Basic markdown-like formatting
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        content = content.replace(/`(.*?)`/g, '<code>$1</code>');
        
        return content;
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error';
        errorDiv.innerHTML = `<div class="message-content">❌ ${message}</div>`;
        this.elements.messages.appendChild(errorDiv);
        this.scrollToBottom();
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'message assistant welcome';
        welcomeDiv.innerHTML = `
            <div class="message-content">
                <strong>Welcome to Puter AI Chatbot!</strong><br><br>
                I can help you with:<br>
                • Text conversations with GPT-4 and Claude<br>
                • Image analysis and vision tasks<br>
                • Image generation with DALL-E 3<br>
                • Streaming responses for real-time chat<br><br>
                Try the quick examples below or start typing your message!
            </div>
        `;
        this.elements.messages.appendChild(welcomeDiv);
    }

    /**
     * Set button states
     */
    setButtonsState(enabled) {
        this.elements.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.elements.sendButton.textContent = 'Send';
        } else {
            this.elements.sendButton.textContent = 'Sending...';
        }
    }

    /**
     * Scroll to bottom of messages
     */
    scrollToBottom() {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    setSendButtonLoading(isLoading) {
        const btn = this.elements.sendButton;
        if (!btn) return;
        if (isLoading) {
            btn.disabled = true;
            btn.classList.add('loading');
            btn.innerHTML = `<svg class="spinner" width="20" height="20" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle></svg>`;
        } else {
            btn.disabled = false;
            btn.classList.remove('loading');
            btn.innerHTML = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`;
        }
    }
}

// Create global instance
window.puterUIManager = new PuterUIManager();

// Add event listener for toggling model parameters
document.addEventListener('DOMContentLoaded', () => {
    const toggleParamsButton = document.getElementById('toggleParams');
    const modelParamsDiv = document.querySelector('.model-params');

    if (toggleParamsButton && modelParamsDiv) {
        toggleParamsButton.addEventListener('click', () => {
            modelParamsDiv.classList.toggle('hidden');
        });
    }
});
