/**
 * Comprehensive Puter.js AI Model Configuration
 * Organizes all available models by category with their capabilities
 */

class PuterModelConfig {
    constructor() {
        this.models = {
            chat: [
                // OpenAI Models - Your specified list
                { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', description: 'Fast and efficient chat model' },
                { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'openai', description: 'Ultra-compact GPT-4.1' },
                { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', description: 'Advanced multimodal model' },
                { id: 'o1', name: 'o1', provider: 'openai', description: 'Reasoning-focused model' },
                { id: 'o1-mini', name: 'o1 Mini', provider: 'openai', description: 'Compact reasoning model' },
                { id: 'o1-pro', name: 'o1 Pro', provider: 'openai', description: 'Professional reasoning model' },
                { id: 'o3', name: 'o3', provider: 'openai', description: 'Next-gen reasoning model' },
                { id: 'o3-mini', name: 'o3 Mini', provider: 'openai', description: 'Compact o3 model' },
                { id: 'o4-mini', name: 'o4 Mini', provider: 'openai', description: 'Latest compact model' },
                { id: 'gpt-5', name: 'GPT-5', provider: 'openai', description: 'Next generation GPT model' },
                { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'openai', description: 'Efficient GPT-5 variant' },
                { id: 'gpt-5-nano', name: 'GPT-5 Nano', provider: 'openai', description: 'Ultra-compact GPT-5' },
                { id: 'gpt-5-chat-latest', name: 'GPT-5 Chat Latest', provider: 'openai', description: 'Latest GPT-5 chat model' },
                { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'openai', description: 'Enhanced GPT-4 model' },
                { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openai', description: 'Compact GPT-4.1' },
                { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'openai', description: 'Ultra-compact GPT-4.1' },
                { id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview', provider: 'openai', description: 'Preview of GPT-4.5' },

                // Anthropic Models - Your specified list
                { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'anthropic', description: 'Latest Claude Sonnet model' },
                { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'anthropic', description: 'Most capable Claude model' },
                { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'anthropic', description: 'Enhanced Claude 3 Sonnet' },
                { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', description: 'Balanced Claude model' },

                // DeepSeek Models
                { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', description: 'Advanced reasoning chat model' },
                { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'deepseek', description: 'Specialized reasoning model' },

                // Google Models - Your specified list
                { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', description: 'Fast multimodal model' },
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', description: 'Efficient Gemini model' },
                { id: 'google/gemma-2-27b-it', name: 'Gemma 2 27B IT', provider: 'google', description: 'Instruction-tuned Gemma model' },

                // Meta Models - Your specified list
                { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B Turbo', provider: 'meta', description: 'Fast 8B parameter model' },
                { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B Turbo', provider: 'meta', description: 'Powerful 70B parameter model' },
                { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B Turbo', provider: 'meta', description: 'Largest Llama model' },

                // Mistral Models - Your specified list
                { id: 'mistral-large-latest', name: 'Mistral Large Latest', provider: 'mistral', description: 'Latest Mistral large model' },
                { id: 'pixtral-large-latest', name: 'Pixtral Large Latest', provider: 'mistral', description: 'Multimodal Mistral model' },
                { id: 'codestral-latest', name: 'Codestral Latest', provider: 'mistral', description: 'Code-specialized model' },

                // X.AI Model
                { id: 'grok-beta', name: 'Grok Beta', provider: 'x', description: 'X.AI conversational model' }
            ],
            vision: [
                // Vision works only with specific code pattern - not in regular chat
                { id: 'gpt-4', name: 'GPT-4 Vision (Special)', provider: 'openai', description: 'Works only with direct puter.ai.chat(prompt, imageUrl) pattern' }
            ],
            txt2img: [
                // Image generation models (confirmed in Puter.js)
                { id: 'dall-e-3', name: 'DALL-E 3', provider: 'openai', description: 'Advanced text-to-image generation' }
            ],
            img2txt: [
                // Image analysis - same as vision but separate category
                { id: 'gpt-4', name: 'GPT-4 Image Analysis (Special)', provider: 'openai', description: 'Works only with direct puter.ai.chat(prompt, imageUrl) pattern' }
            ],
            txt2speech: [
                // Text-to-speech models (confirmed in Puter.js)
                { id: 'tts-1', name: 'OpenAI TTS-1', provider: 'openai', description: 'Natural text-to-speech' },
                { id: 'tts-1-hd', name: 'OpenAI TTS-1 HD', provider: 'openai', description: 'High-quality text-to-speech' }
            ]
        };

        this.providerColors = {
            openai: '#10a37f',
            anthropic: '#d97757',
            google: '#4285f4',
            meta: '#1877f2',
            mistral: '#ff7000',
            deepseek: '#6366f1',
            x: '#1da1f2',
            stability: '#8b5cf6',
            midjourney: '#f59e0b',
            elevenlabs: '#8b5cf6'
        };
    }

    getModelsByCategory(category) {
        return this.models[category] || [];
    }

    getAllModels() {
        return Object.values(this.models).flat();
    }

    getModelById(id) {
        return this.getAllModels().find(model => model.id === id);
    }

    getProviderColor(provider) {
        return this.providerColors[provider] || '#6b7280';
    }

    getCategoryIcon(category) {
        const icons = {
            chat: '💬',
            vision: '👁️',
            txt2img: '🎨',
            img2txt: '📝',
            txt2speech: '🔊'
        };
        return icons[category] || '🤖';
    }

    getCategoryName(category) {
        const names = {
            chat: 'Chat Models',
            vision: 'Vision Models',
            txt2img: 'Text-to-Image',
            img2txt: 'Image-to-Text',
            txt2speech: 'Text-to-Speech'
        };
        return names[category] || category;
    }

    isModelAvailable(modelId) {
        // Check if model is available through Puter.js
        // This would typically check against Puter's actual API
        return this.getModelById(modelId) !== undefined;
    }

    getModelCapabilities(modelId) {
        const model = this.getModelById(modelId);
        if (!model) return null;

        // Determine capabilities based on model category and ID
        const capabilities = {
            chat: true,
            vision: false,
            imageGeneration: false,
            imageAnalysis: false,
            textToSpeech: false,
            documentSupport: false,
            streaming: true,
            maxTokens: 512,
            supportsImageInput: false,
            supportsDocumentInput: false
        };

        // Set capabilities based on model type
        // Only GPT-4 Vision supports image input
        if (this.models.vision.some(m => m.id === modelId) && modelId === 'gpt-4') {
            capabilities.vision = true;
            capabilities.imageAnalysis = true;
            capabilities.supportsImageInput = true;
        }

        if (this.models.txt2img.some(m => m.id === modelId)) {
            capabilities.imageGeneration = true;
            capabilities.chat = false;
            capabilities.supportsImageInput = false;
        }

        // Remove image input from img2txt models - only GPT-4 Vision should have it
        if (this.models.img2txt.some(m => m.id === modelId)) {
            capabilities.imageAnalysis = true;
            capabilities.supportsImageInput = false; // Changed to false
        }

        if (this.models.txt2speech.some(m => m.id === modelId)) {
            capabilities.textToSpeech = true;
            capabilities.chat = false;
            capabilities.supportsImageInput = false;
        }

        // Document support for advanced models (based on Puter.js documentation)
        const documentSupportModels = [
            'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4',
            'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229',
            'gemini-1.5-pro', 'gemini-1.5-flash'
        ];

        if (documentSupportModels.includes(modelId)) {
            capabilities.documentSupport = true;
            capabilities.supportsDocumentInput = true;
        }

        // Adjust max tokens for specific models
        if (modelId.includes('gpt-4') || modelId.includes('claude-3') || modelId.includes('gemini-1.5')) {
            capabilities.maxTokens = 512; // Set to 512 as requested
        }

        return capabilities;
    }
}

// Export for use in other modules
window.PuterModelConfig = PuterModelConfig;