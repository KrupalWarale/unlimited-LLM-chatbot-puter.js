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

        this.currentModel = 'gpt-4o-mini';
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
        this.updateSendButtonState();
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
        this.elements.settingsSidebar = document.getElementById('settingsSidebar');
        this.elements.closeSidebarButton = document.querySelector('.close-sidebar');
        this.elements.visionIndicator = document.getElementById('visionIndicator'); // Bind vision indicator
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

        // Auto-resize textarea on mobile
        this.elements.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // Hide/show suggestions around input focus for small screens
        this.elements.messageInput.addEventListener('focus', () => {
            const suggestions = document.getElementById('suggestions');
            if (window.innerWidth <= 768 && suggestions) {
                suggestions.classList.add('hidden');
            }
        });
        this.elements.messageInput.addEventListener('blur', () => {
            const suggestions = document.getElementById('suggestions');
            if (window.innerWidth <= 768 && suggestions) {
                suggestions.classList.remove('hidden');
            }
        });

        // File input
        this.elements.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Settings toggle
        this.elements.toggleParams.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (this.elements.settingsSidebar) {
                this.elements.settingsSidebar.classList.toggle('open');
                console.log('⚙️ Settings sidebar toggled');
            }
        });

        // Close sidebar button
        if (this.elements.closeSidebarButton) {
            this.elements.closeSidebarButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.elements.settingsSidebar.classList.remove('open');
                console.log('❌ Settings sidebar closed');
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

        // Slider value updates
        this.setupSliderUpdates();

        // Drag and drop for images
        this.setupDragAndDrop();
    }

    /**
     * Set up slider value updates
     */
    setupSliderUpdates() {
        // Max tokens slider
        const maxTokensSlider = document.getElementById('maxTokensInput');
        const maxTokensValue = document.getElementById('maxTokensValue');

        if (maxTokensSlider && maxTokensValue) {
            maxTokensSlider.addEventListener('input', (e) => {
                maxTokensValue.textContent = e.target.value;
            });
        }

        // Temperature slider
        const temperatureSlider = document.getElementById('temperatureInput');
        const temperatureValue = document.getElementById('temperatureValue');

        if (temperatureSlider && temperatureValue) {
            temperatureSlider.addEventListener('input', (e) => {
                temperatureValue.textContent = e.target.value;
            });
        }
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

        // Mobile touch improvements
        this.setupMobileOptimizations();
    }

    /**
     * Set up mobile-specific optimizations
     */
    setupMobileOptimizations() {
        // Prevent zoom on input focus for iOS
        if (this.isMobile()) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.type !== 'file') {
                        input.style.fontSize = '16px';
                    }
                });
            });

            // Handle virtual keyboard on mobile
            this.handleVirtualKeyboard();

            // Improve touch scrolling
            this.improveTouchScrolling();

            // Add touch feedback
            this.addTouchFeedback();
        }
    }

    /**
     * Check if device is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    /**
     * Handle virtual keyboard behavior
     */
    handleVirtualKeyboard() {
        const messageInput = this.elements.messageInput;
        const inputArea = document.querySelector('.input-area');
        const inputContainer = document.querySelector('.input-container');
        
        if (messageInput && inputArea) {
            let keyboardOpen = false;
            
            messageInput.addEventListener('focus', () => {
                keyboardOpen = true;
                inputContainer?.classList.add('keyboard-open');

                // Hide recommendations on Android when focusing input
                const suggestions = document.getElementById('suggestions');
                const isAndroid = /Android/i.test(navigator.userAgent);
                if (isAndroid && suggestions) {
                    suggestions.classList.add('hidden');
                }
                
                // Scroll to input when keyboard opens
                setTimeout(() => {
                    messageInput.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'end',
                        inline: 'nearest'
                    });
                }, 300);
                
                // Ensure input stays visible
                setTimeout(() => {
                    if (keyboardOpen) {
                        window.scrollTo(0, document.body.scrollHeight);
                    }
                }, 500);
            });

            messageInput.addEventListener('blur', () => {
                keyboardOpen = false;
                inputContainer?.classList.remove('keyboard-open');

                // Show recommendations back on Android when input blurs
                const suggestions = document.getElementById('suggestions');
                const isAndroid = /Android/i.test(navigator.userAgent);
                if (isAndroid && suggestions) {
                    suggestions.classList.remove('hidden');
                }
                
                // Reset any keyboard adjustments
                setTimeout(() => {
                    document.body.style.paddingBottom = '0px';
                }, 100);
            });

            // Handle viewport changes for virtual keyboard
            let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            
            const handleViewportChange = () => {
                if (window.visualViewport) {
                    const currentHeight = window.visualViewport.height;
                    const heightDiff = initialViewportHeight - currentHeight;
                    
                    if (heightDiff > 150) { // Keyboard is likely open
                        keyboardOpen = true;
                        document.body.style.paddingBottom = `${Math.min(heightDiff, 300)}px`;
                        
                        // Adjust messages container height
                        const messages = document.querySelector('.messages, .chat-messages');
                        if (messages) {
                            messages.style.paddingBottom = '20px';
                        }
                    } else {
                        keyboardOpen = false;
                        document.body.style.paddingBottom = '0px';
                        
                        // Reset messages container
                        const messages = document.querySelector('.messages, .chat-messages');
                        if (messages) {
                            messages.style.paddingBottom = '';
                        }
                    }
                }
            };

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', handleViewportChange);
            }
            
            // Fallback for older browsers
            window.addEventListener('resize', () => {
                if (!window.visualViewport) {
                    const currentHeight = window.innerHeight;
                    const heightDiff = initialViewportHeight - currentHeight;
                    
                    if (heightDiff > 150 && keyboardOpen) {
                        document.body.style.paddingBottom = `${Math.min(heightDiff, 300)}px`;
                    } else if (!keyboardOpen) {
                        document.body.style.paddingBottom = '0px';
                    }
                }
            });
        }
    }

    /**
     * Improve touch scrolling performance
     */
    improveTouchScrolling() {
        const scrollableElements = document.querySelectorAll('.messages, .chat-messages, .sidebar-content, .suggestions');
        
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.overflowScrolling = 'touch';
        });
    }

    /**
     * Add touch feedback for better UX
     */
    addTouchFeedback() {
        const touchElements = document.querySelectorAll('.suggestion, .send-btn, .file-btn, .settings-btn, .model-selector');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
                element.style.opacity = '0.8';
            });

            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                    element.style.opacity = '';
                }, 150);
            });

            element.addEventListener('touchcancel', () => {
                element.style.transform = '';
                element.style.opacity = '';
            });
        });
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(files) {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (validFiles.length === 0) {
            this.showError('Please select valid image files (JPG, PNG, GIF, WebP)');
            return;
        }

        // Show upload progress for multiple files
        if (validFiles.length > 1) {
            this.showMessage(`Uploading ${validFiles.length} images...`, 'system');
        }

        for (const file of validFiles) {
            try {
                // Check file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    this.showError(`${file.name} is too large. Maximum size is 10MB.`);
                    continue;
                }

                const imageUrl = await this.fileToBase64(file);
                this.uploadedImages.push({
                    file: file,
                    url: imageUrl,
                    name: file.name
                });
                this.displayUploadedImage(imageUrl, file.name);
            } catch (error) {
                this.showError(`Failed to upload ${file.name}: ${error.message}`);
            }
        }

        // Update send button state after upload
        this.updateSendButtonState();
        
        // Clear the file input so user can select the same files again if needed
        this.elements.fileInput.value = '';
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
                preview.style.opacity = '0';
                preview.style.transform = 'scale(0.8)';
                setTimeout(() => preview.remove(), 200);
            }
        });

        // Update send button state after removal
        this.updateSendButtonState();
    }

    /**
     * Show system message
     */
    showMessage(content, type = 'system') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Auto-remove system messages after 3 seconds
        if (type === 'system') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    setTimeout(() => messageDiv.remove(), 300);
                }
            }, 3000);
        }
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

        // Debug logging
        console.log('🔍 HandleSend Debug:');
        console.log('- Message:', message);
        console.log('- Has images:', hasImages);
        console.log('- Uploaded images count:', this.uploadedImages.length);
        console.log('- Current model:', this.currentModel);

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
            console.log('🔧 Images to send:', imagesToSend.length);
            this.uploadedImages = [];
            console.log('🔧 Cleared uploadedImages, new length:', this.uploadedImages.length);

            // Clear image previews
            document.querySelectorAll('.image-preview').forEach(preview => preview.remove());
            console.log('🔧 Cleared image previews');
            
            // Reset file input so user can select new files
            this.elements.fileInput.value = '';
            console.log('🔧 Reset file input');

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
        // Use new model config system if available
        let model, capabilities;

        if (window.puterApp && window.puterApp.modelConfig) {
            const modelData = window.puterApp.modelConfig.getModelById(this.currentModel);
            capabilities = window.puterApp.modelConfig.getModelCapabilities(this.currentModel);

            if (modelData && capabilities) {
                model = {
                    name: modelData.name,
                    type: capabilities.imageGeneration ? 'image-generation' : 'chat',
                    supports: {
                        vision: capabilities.vision,
                        images: capabilities.supportsImageInput,
                        imageGeneration: capabilities.imageGeneration
                    },
                    parameters: {
                        max_tokens: capabilities.maxTokens || 1000,
                        temperature: 0.7
                    }
                };
            }
        }

        // Fallback to old system
        if (!model) {
            model = puterModelCapabilities.getModel(this.currentModel);
            if (!model) return;
        }

        // Only show file upload for GPT-4 Vision (gpt-4 model ID)
        const showFileUpload = this.currentModel === 'gpt-4';
        
        // Debug logging
        console.log('🔍 Current model:', this.currentModel);
        console.log('🔍 Show file upload:', showFileUpload);

        if (showFileUpload) {
            console.log('✅ Showing GPT Vision UI elements');
            
            // Show file upload elements
            this.elements.fileInput.style.display = 'block';
            this.elements.fileInput.parentElement.style.display = 'flex';
            
            // Show vision indicator in header
            if (this.elements.visionIndicator) {
                this.elements.visionIndicator.style.display = 'flex';
                console.log('✅ Vision indicator shown');
            }
            
            // Update tooltip for GPT-4 Vision
            this.elements.fileInput.title = 'Upload images for GPT-4 Vision analysis';
            
            const fileBtn = document.querySelector('.file-btn');
            if (fileBtn) {
                console.log('✅ Updating file button with vision logo');
                fileBtn.title = 'Upload images for GPT-4 Vision';
                // Add GPT Vision logo/indicator
                fileBtn.classList.add('gpt-vision-active');
                fileBtn.innerHTML = `
                    <div class="vision-logo">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        <span class="vision-badge">GPT</span>
                    </div>
                `;
            } else {
                console.log('❌ File button not found');
            }
        } else {
            console.log('❌ Hiding GPT Vision UI elements');
            
            this.elements.fileInput.style.display = 'none';
            this.elements.fileInput.parentElement.style.display = 'none';
            
            // Hide vision indicator in header
            if (this.elements.visionIndicator) {
                this.elements.visionIndicator.style.display = 'none';
            }
            
            // Reset file button to default image icon
            const fileBtn = document.querySelector('.file-btn');
            if (fileBtn) {
                fileBtn.classList.remove('gpt-vision-active');
                fileBtn.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                `;
            }
        }

        // Send button is always visible
        this.elements.sendButton.style.display = 'inline-block';

        // Test mode removed - no longer needed

        // Update placeholder text
        if (model.type === 'image-generation') {
            this.elements.messageInput.placeholder = 'Describe the image you want to generate...';
        } else if (showFileUpload) {
            this.elements.messageInput.placeholder = '👁️ GPT Vision ready - Upload images or ask questions...';
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
        console.log('🖼️ Displaying generated image:', imageElement);
        console.log('🔍 Image element type:', typeof imageElement);
        console.log('🔍 Image element tagName:', imageElement?.tagName);
        console.log('🔍 Image src preview:', imageElement?.src?.substring(0, 50) + '...');

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'generated-image-container';

        // Make sure the image element is properly added
        if (imageElement && imageElement.tagName === 'IMG') {
            // Remove debugging styles

            imageContainer.appendChild(imageElement);
            console.log('✅ Image element added to container');
        } else {
            console.error('❌ Invalid image element:', imageElement);
            // Create a fallback message
            imageContainer.innerHTML = '<p>Image generated but could not be displayed</p>';
        }

        messageDiv.appendChild(imageContainer);
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();

        console.log('✅ Image message added to chat');
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
                <strong>🤖 Welcome to Puter AI Chatbot!</strong><br><br>
                I can help you with:<br>
                💬 Text conversations and Q&A<br>
                👁️ Image analysis (GPT-4 Vision)<br>
                🎨 Image generation (DALL-E 3)<br>
                ⚡ Real-time streaming responses<br><br>
                <small>💡 Tip: Press Enter to send, Shift+Enter for new line</small>
            </div>
        `;
        this.elements.messages.appendChild(welcomeDiv);
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup keyboard shortcuts for better UX
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + / to focus message input
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.elements.messageInput.focus();
            }
            
            // Escape to clear input
            if (e.key === 'Escape' && document.activeElement === this.elements.messageInput) {
                this.elements.messageInput.value = '';
                this.autoResizeTextarea();
                this.updateSendButtonState();
            }
        });
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
     * Update send button state based on input content
     */
    updateSendButtonState() {
        const hasText = this.elements.messageInput.value.trim().length > 0;
        const hasImages = this.uploadedImages.length > 0;
        const hasContent = hasText || hasImages;
        
        // Enable/disable send button based on content
        if (!this.isProcessing) {
            this.elements.sendButton.disabled = !hasContent;
            
            // Update button appearance
            if (hasContent) {
                this.elements.sendButton.classList.add('has-content');
                this.elements.sendButton.style.opacity = '1';
            } else {
                this.elements.sendButton.classList.remove('has-content');
                this.elements.sendButton.style.opacity = '0.6';
            }
        }
    }

    /**
     * Auto-resize textarea based on content
     */
    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        if (!textarea) return;

        // Store the current scroll position
        const scrollTop = textarea.scrollTop;
        
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Set height based on scrollHeight, with min and max limits
        const minHeight = this.isMobile() ? 24 : 28;
        const maxHeight = this.isMobile() ? 120 : 150;
        const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
        
        textarea.style.height = newHeight + 'px';
        
        // If content exceeds max height, enable scrolling
        if (textarea.scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto';
            textarea.scrollTop = scrollTop;
        } else {
            textarea.style.overflowY = 'hidden';
        }
        
        // Update send button state based on content
        this.updateSendButtonState();
        
        // On mobile, ensure the input stays in view when resizing
        if (this.isMobile() && document.activeElement === textarea) {
            setTimeout(() => {
                textarea.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'end',
                    inline: 'nearest'
                });
            }, 100);
        }
    }

    /**
     * Scroll to bottom of messages
     */
    scrollToBottom() {
        const messages = this.elements.messages;
        if (messages) {
            // Use smooth scrolling on mobile for better UX
            if (this.isMobile()) {
                messages.scrollTo({
                    top: messages.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                messages.scrollTop = messages.scrollHeight;
            }
        }
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

// Removed duplicate event listener - handled in bindEvents() method
