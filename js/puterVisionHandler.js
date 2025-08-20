/**
 * Puter Vision Handler - Simplified Version
 * Handles image analysis using the simple puter.ai.chat approach
 */

class PuterVisionHandler {
    constructor() {
        this.maxImageSize = 1024 * 1024; // 1MB limit for data URLs
    }

    /**
     * Main entry point for vision analysis
     */
    async analyzeImage(prompt, imageData, modelName = 'gpt-4') {
        console.log('🔍 Vision Handler Starting...');
        console.log('Prompt:', prompt);
        console.log('Model:', modelName);
        
        try {
            // Use the simple approach that works
            const result = await this.useChatWithImage(prompt, imageData, modelName);
            
            if (result && this.isValidResponse(result)) {
                console.log('✅ Vision analysis succeeded!');
                return this.formatResponse(result);
            } else {
                throw new Error('Invalid response from vision API');
            }
        } catch (error) {
            console.log('❌ Vision analysis failed:', error.message);
            return this.getFallbackResponse();
        }
    }

    /**
     * Simple chat with image approach
     */
    async useChatWithImage(prompt, imageData, modelName) {
        console.log('🔧 Using simple puter.ai.chat approach');
        
        try {
            // Get the data URL from the image data
            let imageUrl;
            
            if (imageData.url && imageData.url.startsWith('data:')) {
                imageUrl = imageData.url;
            } else if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                imageUrl = imageData;
            } else {
                throw new Error('No data URL available');
            }
            
            // Check if image is too large and compress if needed
            if (imageUrl.length > this.maxImageSize) {
                console.log('🔧 Image too large, compressing...');
                imageUrl = await this.compressImage(imageUrl);
            }
            
            console.log('🔧 Image size:', Math.round(imageUrl.length / 1024), 'KB');
            
            // Use the simple approach: puter.ai.chat(prompt, imageUrl)
            const result = await puter.ai.chat(prompt, imageUrl);
            console.log('🔧 Vision result received');
            
            return result;
        } catch (error) {
            console.log('🔧 Vision failed:', error);
            throw error;
        }
    }

    /**
     * Compress image if it's too large
     */
    async compressImage(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions (max 1024px on longest side)
                const maxSize = 1024;
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                console.log('🔧 Compressed from', Math.round(dataUrl.length / 1024), 'KB to', Math.round(compressedDataUrl.length / 1024), 'KB');
                resolve(compressedDataUrl);
            };
            img.src = dataUrl;
        });
    }

    /**
     * Check if response is valid
     */
    isValidResponse(response) {
        if (!response) return false;
        
        // Check for various response formats
        if (typeof response === 'string' && response.length > 0) {
            // Check if it's not an error message or incomplete response
            const lowerResponse = response.toLowerCase();
            const invalidPatterns = [
                "i don't see",
                "no image",
                "cannot see",
                "tfiles>opencancel", // Common UI artifact
                "files>open",
                "cancel",
                "open"
            ];
            
            // Check if response is too short or contains only UI artifacts
            if (response.length < 10) return false;
            
            // Check for invalid patterns
            for (const pattern of invalidPatterns) {
                if (lowerResponse.includes(pattern)) return false;
            }
            
            return true;
        }
        
        if (response.message?.content) {
            return this.isValidResponse(response.message.content);
        }
        
        if (response.content) {
            return this.isValidResponse(response.content);
        }
        
        if (response.text) {
            return this.isValidResponse(response.text);
        }
        
        if (response.toString && response.via_ai_chat_service) {
            return this.isValidResponse(response.toString());
        }
        
        return false;
    }

    /**
     * Format response to standard format
     */
    formatResponse(response) {
        console.log('🔧 Vision Handler formatResponse - Input:', response);
        console.log('🔧 Vision Handler formatResponse - Type:', typeof response);
        
        if (typeof response === 'string') {
            console.log('🔧 Vision Handler formatResponse - Returning string:', response);
            return response;
        }
        
        if (response?.message?.tool_calls?.length > 0) {
            // Handle tool calls, e.g., if AI suggests a function to call
            return `AI wants to call a tool: ${JSON.stringify(response.message.tool_calls)}`;
        }

        if (response?.message?.content) {
            return response.message.content;
        }
        
        if (response?.toString && response?.via_ai_chat_service) {
            return response.toString();
        }
        
        if (response?.content) {
            return response.content;
        }
        
        if (response?.text) {
            return response.text;
        }
        
        if (Array.isArray(response) && response[0]?.text) {
            return response.map(item => item.text || item.content || '').join('');
        }
        
        return JSON.stringify(response);
    }

    /**
     * Get fallback response when all methods fail
     */
    getFallbackResponse() {
        return `I apologize, but I'm having trouble analyzing the image properly. The vision service returned incomplete or invalid data.

This could be due to:
1. The image containing mostly UI elements or text that's hard to interpret
2. The image format or quality affecting analysis
3. A temporary issue with the vision service

Please try:
- Using a clearer image with distinct objects or scenes
- Ensuring the image is well-lit and in focus
- Using a different image format (JPG, PNG)
- Asking a more specific question about the image

If the issue persists, you can still ask me text-based questions!`;
    }
}

// Create global instance
window.puterVisionHandler = new PuterVisionHandler();