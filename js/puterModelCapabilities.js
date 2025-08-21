/**
 * Puter AI Model Capabilities Registry
 * Defines the capabilities and configurations for each AI model available through Puter.js
 */

class PuterModelCapabilities {
    constructor() {
        this.models = {
            'gpt-4-nano': {
                name: 'GPT-4.1 nano',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4o-mini',
                    max_tokens: 1000,
                    temperature: 0.7
                },
                description: 'Fast and efficient text generation model'
            },
            
            'gpt-4': {
                name: 'GPT-4',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4o'
                },
                description: 'Advanced model with vision and image analysis capabilities'
            },
            
            'claude': {
                name: 'Claude',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'claude'
                },
                description: 'Anthropic\'s Claude model with strong reasoning and vision capabilities'
            },
            
            'dall-e-3': {
                name: 'DALL-E 3',
                type: 'image-generation',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: false,
                    imageGeneration: true
                },
                service: 'puter.ai.txt2img',
                parameters: {
                    model: 'dall-e-3'
                },
                description: 'Professional image generation from text descriptions'
            },
            'gpt-4o-mini': {
                name: 'GPT-4o Mini',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4o-mini',
                    max_tokens: 1500,
                    temperature: 0.7
                },
                description: 'A fast and cost-effective compact model for quick, versatile AI interactions with vision.'
            },
            'gpt-4o': {
                name: 'GPT-4o',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4o'
                },
                description: 'The flagship OpenAI model, excellent for complex tasks requiring advanced reasoning and multimodal understanding.'
            },
            'o1': {
                name: 'O1',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'o1'
                },
                description: 'General-purpose model, great for everyday text-based conversations.'
            },
            'o1-mini': {
                name: 'O1 Mini',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'o1-mini',
                    max_tokens: 1000
                },
                description: 'A smaller, faster version of O1, ideal for quick text interactions.'
            },
            'o1-pro': {
                name: 'O1 Pro',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'o1-pro'
                },
                description: 'Enhanced O1 model with expanded capabilities, including vision and image understanding.'
            },
            'o3': {
                name: 'O3',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'o3'
                },
                description: 'A versatile model for a broad range of applications, supporting text and visual inputs.'
            },
            'o3-mini': {
                name: 'O3 Mini',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'o3-mini',
                    max_tokens: 1200
                },
                description: 'Compact version of O3, optimized for quick text responses.'
            },
            'o4-mini': {
                name: 'O4 Mini',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'o4-mini',
                    max_tokens: 1500
                },
                description: 'A powerful mini model with strong multimodal capabilities for efficient processing.'
            },
            'gpt-5': {
                name: 'GPT-5',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-5'
                },
                description: 'Next-generation model from OpenAI, offering unparalleled capabilities in text and multimodal tasks.'
            },
            'gpt-5-mini': {
                name: 'GPT-5 Mini',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-5-mini',
                    max_tokens: 1500
                },
                description: 'A compact yet powerful GPT-5 variant, designed for efficiency across multimodal applications.'
            },
            'gpt-5-nano': {
                name: 'GPT-5 Nano',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-5-nano',
                    max_tokens: 1000
                },
                description: 'The smallest GPT-5 model, optimized for lightning-fast text generation.'
            },
            'gpt-5-chat-latest': {
                name: 'GPT-5 Chat Latest',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-5-chat-latest'
                },
                description: 'The most up-to-date GPT-5 model for conversational AI, with cutting-edge multimodal features.'
            },
            'gpt-4.1': {
                name: 'GPT-4.1',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4.1'
                },
                description: 'An updated GPT-4 model with enhanced capabilities and performance improvements.'
            },
            'gpt-4.1-mini': {
                name: 'GPT-4.1 Mini',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4.1-mini',
                    max_tokens: 1500
                },
                description: 'A mini version of GPT-4.1, balancing speed and advanced multimodal features.'
            },
            'gpt-4.1-nano': {
                name: 'GPT-4.1 Nano',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4.1-nano',
                    max_tokens: 1000
                },
                description: 'The most compact GPT-4.1 model, optimized for very fast text-only responses.'
            },
            'gpt-4.5-preview': {
                name: 'GPT-4.5 Preview',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gpt-4.5-preview'
                },
                description: 'A preview of the upcoming GPT-4.5, showcasing new features and improved performance.'
            },
            'claude-sonnet-4': {
                name: 'Claude Sonnet 4',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'claude-sonnet-4'
                },
                description: 'Anthropic\'s Sonnet 4, a balanced model for general tasks with strong multimodal capabilities.'
            },
            'claude-opus-4': {
                name: 'Claude Opus 4',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'claude-opus-4'
                },
                description: 'Anthropic\'s most powerful Opus 4 model, excelling in complex reasoning and advanced multimodal tasks.'
            },
            'claude-3-7-sonnet': {
                name: 'Claude 3.7 Sonnet',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'claude-3-7-sonnet'
                },
                description: 'An advanced Sonnet model from Anthropic, offering robust performance for various applications.'
            },
            'claude-3-5-sonnet': {
                name: 'Claude 3.5 Sonnet',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'claude-3-5-sonnet'
                },
                description: 'The latest Sonnet model from Anthropic, providing a strong balance of intelligence and speed.'
            },
            'deepseek-chat': {
                name: 'DeepSeek Chat',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'deepseek-chat'
                },
                description: 'A powerful chat model from DeepSeek, designed for high-quality conversational AI.'
            },
            'deepseek-reasoner': {
                name: 'DeepSeek Reasoner',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'deepseek-reasoner'
                },
                description: 'DeepSeek model focused on complex reasoning and logical problem-solving.'
            },
            'gemini-2.0-flash': {
                name: 'Gemini 2.0 Flash',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gemini-2.0-flash'
                },
                description: 'Google\'s high-speed multimodal Gemini 2.0 Flash model, optimized for rapid interactions.'
            },
            'gemini-1.5-flash': {
                name: 'Gemini 1.5 Flash',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'gemini-1.5-flash'
                },
                description: 'A highly efficient Gemini 1.5 model from Google, capable of understanding and generating multimodal content quickly.'
            },
            'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo': {
                name: 'Llama 3.1 8B Instruct',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'
                },
                description: 'Meta\'s 8B Llama 3.1 instruct model, fine-tuned for conversational AI.'
            },
            'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo': {
                name: 'Llama 3.1 70B Instruct',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
                },
                description: 'Meta\'s powerful 70B Llama 3.1 instruct model, offering advanced reasoning and generation.'
            },
            'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo': {
                name: 'Llama 3.1 405B Instruct',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo'
                },
                description: 'Meta\'s largest and most capable Llama 3.1 instruct model, for highly complex tasks.'
            },
            'mistral-large-latest': {
                name: 'Mistral Large Latest',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'mistral-large-latest'
                },
                description: 'Mistral AI\'s most advanced large language model, ideal for sophisticated text generation and understanding.'
            },
            'pixtral-large-latest': {
                name: 'Pixtral Large Latest',
                type: 'chat',
                supports: {
                    text: true,
                    images: true,
                    vision: true,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'pixtral-large-latest'
                },
                description: 'A multimodal large model, combining text and vision capabilities for comprehensive AI interactions.'
            },
            'codestral-latest': {
                name: 'Codestral Latest',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'codestral-latest'
                },
                description: 'Mistral AI\'s model specialized in code generation and understanding, excellent for developers.'
            },
            'google/gemma-2-27b-it': {
                name: 'Gemma 2 27B IT',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'google/gemma-2-27b-it'
                },
                description: 'Google\'s Gemma 2 27B instruct model, powerful for conversational and instructional tasks.'
            },
            'grok-beta': {
                name: 'Grok Beta',
                type: 'chat',
                supports: {
                    text: true,
                    images: false,
                    vision: false,
                    streaming: true,
                    testMode: false
                },
                service: 'puter.ai.chat',
                parameters: {
                    model: 'grok-beta'
                },
                description: 'xAI\'s Grok Beta, an experimental model with unique characteristics and real-time knowledge capabilities.'
            }
        };
    }

    /**
     * Get model configuration by ID
     */
    getModel(modelId) {
        return this.models[modelId] || null;
    }

    /**
     * Get all available models
     */
    getAllModels() {
        return this.models;
    }

    /**
     * Check if a model supports a specific capability
     */
    modelSupports(modelId, capability) {
        const model = this.getModel(modelId);
        return model ? model.supports[capability] || false : false;
    }

    /**
     * Get models that support a specific capability
     */
    getModelsByCapability(capability) {
        const result = {};
        for (const [modelId, model] of Object.entries(this.models)) {
            if (model.supports[capability]) {
                result[modelId] = model;
            }
        }
        return result;
    }

    /**
     * Get the appropriate Puter service for a model
     */
    getModelService(modelId) {
        const model = this.getModel(modelId);
        return model ? model.service : null;
    }

    /**
     * Get model parameters
     */
    getModelParameters(modelId) {
        const model = this.getModel(modelId);
        return model ? model.parameters : {};
    }

    /**
     * Check if model is a chat model
     */
    isChatModel(modelId) {
        const model = this.getModel(modelId);
        return model ? model.type === 'chat' : false;
    }

    /**
     * Check if model is an image generation model
     */
    isImageGenerationModel(modelId) {
        const model = this.getModel(modelId);
        return model ? model.type === 'image-generation' : false;
    }

    /**
     * Validate input compatibility with model
     */
    validateInput(modelId, hasText, hasImages) {
        const model = this.getModel(modelId);
        if (!model) return { valid: false, message: 'Unknown model' };

        if (hasImages && !model.supports.vision && !model.supports.images) {
            return { 
                valid: false, 
                message: `${model.name} doesn't support image input` 
            };
        }

        if (!hasText && model.type === 'image-generation') {
            return { 
                valid: false, 
                message: 'Image generation requires a text prompt' 
            };
        }

        return { valid: true };
    }
}

// Create global instance
window.puterModelCapabilities = new PuterModelCapabilities();
