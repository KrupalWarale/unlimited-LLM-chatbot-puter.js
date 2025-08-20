/**
 * Puter Vision Handler
 * Alternative implementation for handling image analysis
 */

class PuterVisionHandler {
    constructor() {
        
    }

    /**
     * Main entry point for vision analysis
     */
    async analyzeImage(prompt, imageData, modelName = 'gpt-4o') {
        if (true) { // Changed this.debug to true for debugging
            console.log('🔍 Vision Handler Starting...');
            console.log('Prompt:', prompt);
            console.log('Model:', modelName);
            console.log('Image data type:', typeof imageData);
            if (imageData instanceof File) {
                console.log('Image Data (File):', imageData.name, imageData.size, imageData.type);
            } else if (imageData instanceof Blob) {
                console.log('Image Data (Blob):', imageData.size, imageData.type);
            } else if (typeof imageData === 'string' && imageData.length < 200) { // Limit log for long base64 strings
                console.log('Image Data (String/URL):', imageData);
            } else if (typeof imageData === 'object' && imageData !== null && imageData.url) {
                console.log('Image Data (Object with URL):', imageData.url);
            }
        }

        // Try multiple approaches in order of likelihood to work
        const approaches = [
            this.useImg2Txt.bind(this),
            this.useChatWithImage.bind(this),
            this.useMultimodal.bind(this),
            this.useAlternativeFormat.bind(this)
        ];

        for (let i = 0; i < approaches.length; i++) {
            try {
                if (true) console.log(`🔄 Trying approach ${i + 1} (${approaches[i].name})...`); // Debug log
                const result = await approaches[i](prompt, imageData, modelName);
                
                if (result && this.isValidResponse(result)) {
                    if (true) console.log(`✅ Approach ${i + 1} (${approaches[i].name}) succeeded!`); // Debug log
                    return this.formatResponse(result);
                }
            } catch (error) {
                if (true) console.log(`❌ Approach ${i + 1} (${approaches[i].name}) failed:`, error.message);
            }
        }

        // If all approaches fail, return a fallback response
        return this.getFallbackResponse();
    }

    /**
     * Resolves various image data formats into a URL or puter_path.
     * If the image is a local file (Blob/File/Data URL), it uploads it to Puter FS.
     */
    async resolveImageUrl(imageData) {
        if (true) console.log('resolveImageUrl: Input imageData:', typeof imageData, imageData instanceof File ? imageData.name : (imageData instanceof Blob ? imageData.type : (typeof imageData === 'string' && imageData.length < 200 ? imageData : '...'))); // Debug log
        try {
            if (typeof imageData === 'string' && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
                // Already an external URL
                if (true) console.log('resolveImageUrl: Detected external URL.'); // Debug log
                return { type: 'url', value: imageData };
            }

            let fileToUpload;
            let originalFileName = `temp_image_${Date.now()}`;
            let fileExtension = 'png'; // Default extension

            if (imageData instanceof File) {
                fileToUpload = imageData;
                originalFileName = imageData.name;
                const parts = originalFileName.split('.');
                if (parts.length > 1) {
                    fileExtension = parts.pop();
                }
                if (true) console.log('resolveImageUrl: Handling File instance.'); // Debug log
            } else if (imageData instanceof Blob) {
                fileToUpload = new File([imageData], `${originalFileName}.${fileExtension}`, { type: imageData.type });
                if (true) console.log('resolveImageUrl: Handling Blob instance.'); // Debug log
            } else if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                // Convert data URL to Blob
                const arr = imageData.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                fileToUpload = new File([new Blob([u8arr], { type: mime })], `${originalFileName}.${mime.split('/')[1]}`, { type: mime });
                fileExtension = mime.split('/')[1];
                if (true) console.log('resolveImageUrl: Handling Data URL string.'); // Debug log
            } else if (imageData.url) {
                // If it's an object with a URL property, try to resolve that URL
                if (true) console.log('resolveImageUrl: Handling object with URL property.'); // Debug log
                return this.resolveImageUrl(imageData.url);
            } else {
                throw new Error('Unsupported image data format for resolution.');
            }

            const puterFile = await puter.fs.write(`${originalFileName}.${fileExtension}`, fileToUpload, { override: true });
            if (true) console.log('resolveImageUrl: Uploaded to Puter FS, path:', puterFile.path); // Debug log
            return { type: 'puter_path', value: puterFile.path };
        } catch (error) {
            console.error('resolveImageUrl Error:', error);
            throw error; // Re-throw to propagate the error
        }
    }

    /**
     * Approach 1: Use img2txt method
     */
    async useImg2Txt(prompt, imageData, modelName) {
        if (!puter.ai.img2txt) {
            throw new Error('img2txt not available');
        }

        // Convert image data to appropriate format
        const imageInput = await this.prepareImageForImg2Txt(imageData);
        
        // img2txt might not accept a custom prompt, so we'll try both ways
        try {
            // Try with prompt
            const result = await puter.ai.img2txt(imageInput, prompt);
            return result;
        } catch (e) {
            // Try without prompt (just image description)
            const description = await puter.ai.img2txt(imageInput);
            
            // Now use regular chat to answer the specific question
            if (description) {
                const enhancedPrompt = `Based on this image description: "${description}"\n\nQuestion: ${prompt}`;
                const chatResponse = await puter.ai.chat(enhancedPrompt, { model: modelName });
                return chatResponse;
            }
            throw new Error('img2txt failed');
        }
    }

    /**
     * Approach 2: Use chat with image as parameter
     */
    async useChatWithImage(prompt, imageData, modelName) {
        const resolvedImage = await this.resolveImageUrl(imageData);
        let result;

        if (true) console.log('useChatWithImage: Resolved image:', resolvedImage); // Debug log

        if (resolvedImage.type === 'url') {
            result = await puter.ai.chat(prompt, resolvedImage.value, { model: modelName });
        } else if (resolvedImage.type === 'puter_path') {
            // For chat with image parameter, it expects a URL.
            // If it's a puter_path, we need to treat it as a file for multimodal.
            // This approach is more for direct image URLs, so we'll route to multimodal if it's a puter_path.
            return this.useMultimodal(prompt, imageData, modelName);
        } else {
            throw new Error('Could not resolve image for chat with image parameter.');
        }
        
        return result;
    }

    /**
     * Approach 3: Use multimodal format
     */
    async useMultimodal(prompt, imageData, modelName) {
        let temporaryFilePath = null;
        try {
            const resolvedImage = await this.resolveImageUrl(imageData);

            if (true) console.log('useMultimodal: Resolved image:', resolvedImage); // Debug log

            const contentArray = [{ type: 'text', text: prompt }];

            if (resolvedImage.type === 'url') {
                contentArray.push({
                    type: 'image_url',
                    image_url: { url: resolvedImage.value }
                });
            } else if (resolvedImage.type === 'puter_path') {
                contentArray.push({
                    type: 'file',
                    puter_path: resolvedImage.value
                });
                temporaryFilePath = resolvedImage.value;
            } else {
                throw new Error('Unsupported image data format for multimodal.');
            }
            
            const messages = [{ role: 'user', content: contentArray }];

            const result = await puter.ai.chat(messages, { model: modelName });
            return result;
        } finally {
            if (temporaryFilePath) {
                await puter.fs.delete(temporaryFilePath).catch(e => console.error("Error deleting temp file:", e));
            }
        }
    }

    /**
     * Approach 4: Alternative format attempts
     */
    async useAlternativeFormat(prompt, imageData, modelName) {
        // This approach seems to be trying to embed base64 directly into a non-standard message format.
        // Based on the Puter.js documentation, the 'multimodal' approach with 'type: "file"' or 'type: "image_url"'
        // in the messages array is the correct way to handle images for chat.
        // This method might not be necessary or effective with the official API.
        // For now, let's keep it but note its potential redundancy.

        const resolvedImage = await this.resolveImageUrl(imageData);
        
        if (true) console.log('useAlternativeFormat: Resolved image:', resolvedImage); // Debug log

        if (resolvedImage.type === 'url' && resolvedImage.value.startsWith('data:')) {
            // If it's a data URL, try to extract the base64 part for this specific attempt
            const base64Data = resolvedImage.value;
            const base64Only = base64Data.split(',')[1];
            const mimeMatch = base64Data.match(/:(.*?);/);
            const mediaType = mimeMatch ? mimeMatch[1] : 'image/jpeg'; // Default if not found
            
            const messageWithImage = {
                content: prompt,
                images: [{
                    type: 'base64',
                    data: base64Only,
                    media_type: mediaType
                }]
            };
            const result = await puter.ai.chat(messageWithImage, { model: modelName });
            return result;
        } else if (resolvedImage.type === 'puter_path') {
             // If it's a puter_path, use the standard multimodal approach as a fallback for this alternative format.
             // This might not be the intent of 'alternative format' but ensures image is processed.
             return this.useMultimodal(prompt, imageData, modelName);
        } else {
            // For external URLs or other unhandled types, throw an error or handle appropriately
            throw new Error('Alternative format not suitable for external URLs or other image types.');
        }
    }

    /**
     * Prepare image for img2txt
     */
    async prepareImageForImg2Txt(imageData) {
        const resolvedImage = await this.resolveImageUrl(imageData);
        if (resolvedImage.type === 'url' || resolvedImage.type === 'puter_path') {
            if (true) console.log('prepareImageForImg2Txt: Using resolved image value:', resolvedImage.value); // Debug log
            return resolvedImage.value;
        }
        throw new Error('Cannot prepare image for img2txt from unknown format after resolution.');
    }

    /**
     * Convert various formats to Blob
     * (This method might become redundant with resolveImageUrl)
     */
    async convertToBlob(imageData) {
        console.warn('convertToBlob is deprecated. Use resolveImageUrl instead.'); // Deprecation warning
        if (imageData instanceof Blob) {
            return imageData;
        }
        
        if (imageData instanceof File) {
            return imageData;
        }
        
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            // Convert data URL to blob
            const arr = imageData.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
        
        if (imageData.url) {
            return await this.convertToBlob(imageData.url);
        }
        
        throw new Error('Cannot convert to blob');
    }

    /**
     * Convert various formats to base64 data URL
     * (This method might become redundant with resolveImageUrl)
     */
    async convertToBase64(imageData) {
        console.warn('convertToBase64 is deprecated. Use resolveImageUrl instead.'); // Deprecation warning
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            return imageData;
        }
        
        if (imageData.url && imageData.url.startsWith('data:')) {
            return imageData.url;
        }
        
        if (imageData instanceof File || imageData instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(imageData);
            });
        }
        
        throw new Error('Cannot convert to base64');
    }

    /**
     * Check if response is valid
     */
    isValidResponse(response) {
        if (!response) return false;
        
        // Check for various response formats
        if (typeof response === 'string' && response.length > 0) {
            // Check if it's not an error message
            const lowerResponse = response.toLowerCase();
            return !lowerResponse.includes("i don't see") && 
                   !lowerResponse.includes("no image") &&
                   !lowerResponse.includes("cannot see");
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
        if (typeof response === 'string') {
            return response;
        }
        
        if (response?.message?.tool_calls?.length > 0) {
            // Handle tool calls, e.g., if AI suggests a function to call
            // You might want to process these tool calls here or pass them up
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
        return `I apologize, but I'm having trouble analyzing the image at the moment. This could be due to:

1. The image format may not be supported
2. The image may be too large or complex
3. There might be a temporary issue with the vision service

Please try:
- Using a different image format (JPG, PNG)
- Reducing the image size
- Trying again in a moment

If the issue persists, you can still ask me text-based questions!`;
    }
}

// Create global instance
window.puterVisionHandler = new PuterVisionHandler();
