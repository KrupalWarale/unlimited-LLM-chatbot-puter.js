/**
 * Puter Chat Manager
 * Handles communication with Puter AI services
 */

class PuterChatManager {
    constructor() {
        this.conversationHistory = [];
        this.currentStreamingMessage = null;
    }

    /**
     * Send message to Puter AI services
     */
    async sendMessage(message, images = [], useStreaming = false) {
        // Debug logging
        console.log('🔍 ChatManager sendMessage Debug:');
        console.log('- Message:', message);
        console.log('- Images array:', images);
        console.log('- Images length:', images.length);
        console.log('- Use streaming:', useStreaming);

        const currentModel = puterUIManager.currentModel;

        // Get model configuration
        const model = puterModelCapabilities.getModel(currentModel);
        if (!model) {
            throw new Error(`Unknown model: ${currentModel}`);
        }

        try {
            if (model.type === 'chat') {
                await this.handleChatMessage(message, images, useStreaming, model);
            } else if (model.type === 'image-generation') {
                await this.handleImageGeneration(message, model);
            }
        } catch (error) {
            console.error('Chat Manager Error:', error);
            puterUIManager.showError(error.message || 'An error occurred while processing your request');
        }
    }

    /**
     * Handle chat messages (text and vision)
     */
    async handleChatMessage(message, images, useStreaming, model) {
        try {
            let response;

            if (images.length > 0 && model.supports.vision) {
                // Handle vision - NO STREAMING EVER
                console.log('🖼️ Handling vision request (non-streaming)');

                response = await this.handleVisionChat(message, images[0], { model: model.id });
                this.displayChatResponse(response, model);

            } else if (images.length > 0 && !model.supports.vision) {
                // Model doesn't support vision - show helpful message
                puterUIManager.displayMessage(
                    `❌ ${model.name} doesn't support image analysis. Please switch to GPT-4 Vision for image capabilities, or continue with text-only conversation.`,
                    'assistant'
                );
                return;
            } else {
                // Handle text chat - TRY STREAMING
                console.log('🔧 Handling text chat');

                if (useStreaming) {
                    try {
                        response = await puter.ai.chat(message, { stream: true });
                        if (response && typeof response[Symbol.asyncIterator] === 'function') {
                            await this.handleStreamingResponse(response, model);
                            return;
                        }
                    } catch (e) {
                        console.log('🔧 Streaming failed, using direct');
                    }
                }

                // Direct response
                response = await puter.ai.chat(message);
                this.displayChatResponse(response, model);
            }

        } catch (error) {
            throw new Error(`Chat failed: ${error.message}`);
        }
    }

    /**
     * Handle vision/image analysis
     */
    async handleVisionChat(message, image, options) {
        try {
            console.log('🖼️ Processing vision request with image:', image.name);
            console.log('🔍 Using new Vision Handler...');

            // Use the new vision handler
            if (window.puterVisionHandler) {
                const modelName = options.model || 'gpt-4o';
                const result = await puterVisionHandler.analyzeImage(message, image, modelName);

                // Return the result in a format compatible with displayChatResponse
                return result;
            }

            // If vision handler not available, throw an error
            throw new Error(`Vision analysis not supported. The vision handler is not available.`);

        } catch (error) {
            console.error('Vision analysis error:', error);
            throw new Error(`Vision analysis failed: ${error.message}`);
        }
    }

    /**
     * Handle image generation
     */
    async handleImageGeneration(prompt, model) {
        try {
            const imageElement = await puter.ai.txt2img(prompt, false); // Always use real generation
            puterUIManager.displayGeneratedImage(imageElement);

        } catch (error) {
            throw new Error(`Image generation failed: ${error.message}`);
        }
    }

    /**
     * Handle streaming response
     */
    async handleStreamingResponse(response, model = null) {
        let streamingMessageDiv = puterUIManager.displayMessage('', 'assistant', [], false); // isStreaming now always false
        let fullContent = '';

        try {
            for await (const part of response) {
                if (part?.text) {
                    fullContent += part.text;
                    puterUIManager.updateStreamingMessage(streamingMessageDiv, fullContent);
                }
            }



            puterUIManager.completeStreamingMessage(streamingMessageDiv);

        } catch (error) {
            puterUIManager.completeStreamingMessage(streamingMessageDiv);
            throw new Error(`Streaming failed: ${error.message}`);
        }
    }



    /**
     * Display regular chat response
     */
    displayChatResponse(response, model = null) {
        let content;

        // Enhanced debugging for vision responses
        console.log('✅ Response received:', response?.message?.content || 'parsing...');
        console.log('🔍 Full response object:', response);
        console.log('🔍 Response type:', typeof response);
        console.log('🔍 Response keys:', response ? Object.keys(response) : 'null');

        if (typeof response === 'string') {
            content = response;
        } else if (response?.message?.content) {
            // Direct message.content (GPT-4 format)
            content = response.message.content;
        } else if (response?.toString && typeof response.toString === 'function') {
            // Try toString method for various response formats
            console.log('✅ Using toString method for response');
            content = response.toString();
        } else if (Array.isArray(response) && response[0]?.text) {
            // Claude format: array with text objects
            content = response.map(item => item.text || item.content || '').join('');
        } else if (Array.isArray(response) && response[0]?.type === 'text' && response[0]?.text) {
            // Claude format: array with type/text objects
            content = response[0].text;
        } else if (response?.content) {
            content = response.content;
        } else if (response?.text) {
            content = response.text;
        } else if (response?.choices && response.choices[0]?.message?.content) {
            // OpenAI-style response format with choices array
            content = response.choices[0].message.content;
        } else if (response?.data?.content) {
            content = response.data.content;
        } else if (response?.data?.text) {
            content = response.data.text;
        } else if (response?.message) {
            content = response.message;
        } else if (response?.response) {
            content = response.response;
        } else {
            // Try to stringify the response to see what we're getting
            console.warn('⚠️ Unknown response format:', response);
            console.log('🔍 Response structure:', JSON.stringify(response, null, 2));

            // Check if response has any string properties we can use
            const stringProps = Object.keys(response || {}).filter(key =>
                typeof response[key] === 'string' && response[key].length > 0
            );

            if (stringProps.length > 0) {
                content = response[stringProps[0]];
                console.log('🔧 Using property:', stringProps[0], 'with value:', content);
            } else {
                // If it's an object, try to convert it to a readable format
                if (typeof response === 'object' && response !== null) {
                    // Look for common patterns in nested objects
                    const flattenObject = (obj, prefix = '') => {
                        let result = [];
                        for (const [key, value] of Object.entries(obj)) {
                            if (typeof value === 'string' && value.length > 0) {
                                result.push(`${prefix}${key}: ${value}`);
                            } else if (typeof value === 'object' && value !== null) {
                                result.push(...flattenObject(value, `${prefix}${key}.`));
                            }
                        }
                        return result;
                    };

                    const flattenedData = flattenObject(response);
                    if (flattenedData.length > 0) {
                        content = flattenedData.join('\n');
                        console.log('🔧 Extracted from object:', content);
                    } else {
                        content = `Received response object with keys: ${Object.keys(response).join(', ')}. Full response logged to console.`;
                    }
                } else {
                    content = `Received response but could not extract text content. Response type: ${typeof response}. Keys: ${Object.keys(response || {}).join(', ')}`;
                }
            }
        }

        // Content extracted successfully



        puterUIManager.displayMessage(content, 'assistant');
    }

    /**
     * Build chat options based on model and settings
     */
    buildChatOptions(model, useStreaming) {
        const options = {
            ...model.parameters,
            ...puterUIManager.getCurrentModelParameters() // Get current UI parameter values
        };

        // Add streaming option for text-based models (not for vision)
        if (useStreaming && model.supports.streaming) {
            // Note: stream option will be added in the actual chat call
            // We prepare it here but don't add to options to avoid conflicts
        }

        // Standard DALL-E 3 generation (no test mode)

        return options;
    }

    /**
     * Add message to conversation history
     */
    addToHistory(role, content, images = null) {
        const entry = {
            role: role,
            content: content,
            timestamp: new Date(),
            images: images
        };

        this.conversationHistory.push(entry);

        // Keep history manageable (last 20 messages)
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return [...this.conversationHistory];
    }

    /**
     * Export conversation
     */
    exportConversation() {
        const conversation = this.conversationHistory.map(entry => ({
            role: entry.role,
            content: entry.content,
            timestamp: entry.timestamp.toISOString(),
            hasImages: entry.images ? entry.images.length > 0 : false
        }));

        const dataStr = JSON.stringify(conversation, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `puter-ai-conversation-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    /**
     * Get usage statistics
     */
    getUsageStats() {
        const stats = {
            totalMessages: this.conversationHistory.length,
            userMessages: this.conversationHistory.filter(m => m.role === 'user').length,
            assistantMessages: this.conversationHistory.filter(m => m.role === 'assistant').length,
            messagesWithImages: this.conversationHistory.filter(m => m.images && m.images.length > 0).length
        };

        return stats;
    }

    /**
     * Convert data URL to blob for API compatibility
     */
    async dataURLToBlob(dataURL) {
        return new Promise((resolve, reject) => {
            try {
                const arr = dataURL.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                const blob = new Blob([u8arr], { type: mime });
                resolve(blob);
            } catch (error) {
                console.error('Error converting dataURL to blob:', error);
                reject(error);
            }
        });
    }

    /**
     * Handle errors and provide helpful feedback
     */
    handleError(error, context = '') {
        console.error(`Puter Chat Manager Error ${context}:`, error);

        let userMessage = 'An error occurred. ';

        if (error.message.includes('rate limit')) {
            userMessage += 'You\'ve reached the rate limit. Please wait a moment before trying again.';
        } else if (error.message.includes('authentication')) {
            userMessage += 'Authentication failed. Please refresh the page and try again.';
        } else if (error.message.includes('network')) {
            userMessage += 'Network connection issue. Please check your internet connection.';
        } else if (error.message.includes('model')) {
            userMessage += 'The selected model is currently unavailable. Try switching to another model.';
        } else {
            userMessage += error.message || 'Please try again or contact support if the issue persists.';
        }

        puterUIManager.showError(userMessage);
    }
}

// Create global instance
window.puterChatManager = new PuterChatManager();
