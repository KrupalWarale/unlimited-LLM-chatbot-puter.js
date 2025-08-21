# Puter AI Chatbot

A clean, efficient AI chatbot powered by the Puter platform. Chat with multiple AI models including OpenAi, Gemini, Claude, and DALL-E 3 with no backend required!

## 🌟 Features

- **Multiple AI Models**: 30+ models including GPT-4, Claude, Gemini, and DALL-E 3
- **Vision Capabilities**: Upload images and ask questions about them (GPT-4 Vision)
- **Image Generation**: Create images with DALL-E 3
- **Streaming Responses**: Real-time response streaming
- **Mobile Optimized**: Works perfectly on all devices
- **No Backend Required**: Everything runs client-side with Puter.js

## 🚀 Quick Start

1. **Open `index.html`** in your browser, or use a local server:
   ```bash
   python -m http.server 8080
   ```

2. **Start chatting!** Select a model and begin your conversation.

## 🤖 Available Models

- **Chat Models**: GPT-4o, Claude, Gemini, Llama, DeepSeek, and more
- **Vision Models**: GPT-4 Vision for image analysis
- **Image Generation**: DALL-E 3 for creating images from text

## 🎯 Use Cases

- **Text Conversations**: Ask questions, get explanations, creative writing help
- **Image Analysis**: Upload images and ask "What do you see?"
- **Image Generation**: Describe an image and let DALL-E 3 create it
- **Code Help**: Get programming assistance and debugging help

## 🏗️ Architecture

Simple, clean architecture with just 4 core files:

```
├── index.html                      # Main application
├── styles.css                      # Styling
├── js/
│   ├── puterModelCapabilities.js   # Model definitions
│   ├── puterVisionHandler.js       # Image analysis
│   ├── puterUIManager.js           # UI management
│   ├── puterChatManager.js         # API communication
│   └── puterApp.js                 # Application coordinator
└── manifest.json                   # PWA manifest
```

## 🔧 Customization

### Add New Models
Edit `puterModelCapabilities.js`:
```javascript
'new-model': {
    name: 'New Model',
    type: 'chat',
    supports: { text: true, vision: false },
    service: 'puter.ai.chat',
    parameters: { model: 'new-model' }
}
```

### Styling
Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4f46e5;
    --puter-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🌐 About Puter

[Puter](https://puter.com) provides serverless AI with no tracking or data monetization.

## 💸 Free & Unlimited LLMs with Puter

- **Free to use**: Start chatting instantly — no credit card, no API keys.
- **Unlimited conversations**: Explore long sessions and high‑volume chatting without worrying about quotas.
- **All-in-one hub**: Access a wide catalog of leading models (GPT, Claude, Gemini, Llama, DeepSeek, and more) from one UI.
- **Zero backend costs**: Everything runs client‑side with Puter.js — nothing to deploy or maintain.
- **Privacy-first**: No tracking, no data monetization.

> Note: Model lineup and availability are continuously improving. Usage terms may evolve; check Puter’s site for the latest details.

## 📚 Full Model List (Configured in this project)

### Chat Models
- GPT-4o Mini (`gpt-4o-mini`)
- GPT-4.1 (`gpt-4.1`)
- GPT-4.1 Mini (`gpt-4.1-mini`)
- GPT-4.1 Nano (`gpt-4.1-nano`)
- GPT-4.5 Preview (`gpt-4.5-preview`)
- GPT-5 (`gpt-5`)
- GPT-5 Mini (`gpt-5-mini`)
- GPT-5 Nano (`gpt-5-nano`)
- GPT-5 Chat Latest (`gpt-5-chat-latest`)
- O1 (`o1`)
- O1 Mini (`o1-mini`)
- O1 Pro (`o1-pro`)
- O3 (`o3`)
- O3 Mini (`o3-mini`)
- O4 Mini (`o4-mini`)
- Claude Sonnet 4 (`claude-sonnet-4`)
- Claude Opus 4 (`claude-opus-4`)
- Claude 3.7 Sonnet (`claude-3-7-sonnet`)
- Claude 3.5 Sonnet (`claude-3-5-sonnet`)
- DeepSeek Chat (`deepseek-chat`)
- DeepSeek Reasoner (`deepseek-reasoner`)
- Gemini 2.0 Flash (`gemini-2.0-flash`)
- Gemini 1.5 Flash (`gemini-1.5-flash`)
- Llama 3.1 8B Instruct (`meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo`)
- Llama 3.1 70B Instruct (`meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`)
- Llama 3.1 405B Instruct (`meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo`)
- Mistral Large Latest (`mistral-large-latest`)
- Pixtral Large Latest (`pixtral-large-latest`)
- Codestral Latest (`codestral-latest`)
- Gemma 2 27B IT (`google/gemma-2-27b-it`)
- Grok Beta (`grok-beta`)

### Vision Models (special code path)
- GPT-4 Vision (`gpt-4`)

### Image Generation
- DALL-E 3 (`dall-e-3`)

## 📱 Mobile Support

Fully responsive design with touch-friendly interface and mobile-optimized layout.

## 🔒 Privacy

- No data storage - conversations are not saved
- Client-side only processing
- Secure HTTPS connections

## 📄 License

MIT License - free to use and modify.

---

**Built with Puter.js - Simple, Clean, Efficient**

