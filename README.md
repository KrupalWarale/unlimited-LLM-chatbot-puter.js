# Puter AI Chatbot

A modern, multimodal AI chatbot powered by the Puter platform. Experience seamless interactions with GPT-4, Claude, and DALL-E 3 through a single, intuitive interface with no backend required!

## 🌟 Features

- **Powered by Puter.js**: Serverless AI, cloud storage, and authentication
- **Multiple AI Models**: GPT-4.1 nano, GPT-4, Claude, and DALL-E 3
- **Multimodal Interactions**: Text conversations, image analysis, and image generation
- **Vision Capabilities**: Upload images and ask questions about them
- **Streaming Responses**: Real-time response streaming for better UX
- **Test Mode**: Free DALL-E 3 image generation for testing
- **Drag & Drop**: Easy image upload with drag-and-drop support
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **No Backend Required**: Everything runs client-side with Puter.js

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for Puter.js library

### Installation

1. **Clone or download** the project files
2. **Open index.html** in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js http-server
   npx http-server -p 8080
   
   # Or simply open index.html in your browser
   ```

3. **Start chatting!** The app will automatically load Puter.js and initialize

### Basic Usage

1. **Select a Model**: Choose from GPT-4.1 nano, GPT-4, Claude, or DALL-E 3
2. **Type your message**: Use the text area to ask questions or give prompts
3. **Upload images**: Drag & drop or click to upload images for analysis
4. **Use streaming**: Click "Stream" for real-time response generation
5. **Try examples**: Click quick example buttons to get started

## 🤖 Available Models

| Model | Type | Capabilities | Description |
|-------|------|-------------|-------------|
| **GPT-4.1 nano** | Text | Fast text generation | Efficient model for quick responses |
| **GPT-4** | Multimodal | Text + Vision | Advanced model with image analysis |
| **Claude** | Multimodal | Text + Vision | Anthropic's reasoning-focused model |
| **DALL-E 3** | Image Generation | Text to Image | Create images from text descriptions |

## 🎯 Use Cases

### Text Conversations
- Ask questions about any topic
- Get explanations and tutorials  
- Creative writing assistance
- Code help and debugging

### Image Analysis
1. Upload an image (JPG, PNG, WebP)
2. Ask questions like "What do you see?" or "Describe this image"
3. Get detailed analysis and descriptions

### Image Generation
1. Select DALL-E 3 model
2. Enable "Test Mode" for free generation
3. Describe the image you want
4. Get AI-generated artwork

### Streaming Chat
- Click "Stream" button for real-time responses
- Watch text appear as the AI generates it
- Better experience for longer responses

## ⚙️ Settings & Features

### Model Options
- **Test Mode**: Free DALL-E 3 image generation
- **Stream Mode**: Real-time response streaming

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Send message
- **Ctrl/Cmd + Shift + Enter**: Stream message
- **Escape**: Clear input
- **Ctrl/Cmd + K**: Focus input
- **F1**: Show help dialog

### File Uploads
- **Supported formats**: JPG, PNG, GIF, WebP
- **Drag & Drop**: Drop images anywhere on the page
- **Multiple files**: Upload multiple images at once
- **Preview**: See uploaded images before sending

## 🏗️ Architecture

### Core Components

#### Puter Integration
- **PuterModelCapabilities**: Model registry and capability management
- **PuterUIManager**: Dynamic UI updates and user interactions
- **PuterChatManager**: API communication with Puter services
- **PuterApp**: Application initialization and coordination

### File Structure
```
putterJsBot/
├── index.html                      # Main application HTML
├── styles.css                      # Complete styling
├── js/
│   ├── puterModelCapabilities.js   # Model definitions and validation
│   ├── puterUIManager.js          # UI management and interactions
│   ├── puterChatManager.js        # API communication layer
│   └── puterApp.js                # Application coordinator
├── package.json                    # Project metadata
└── README.md                      # This file
```

## 🔧 Customization

### Adding Quick Examples
Modify the examples in `index.html`:
```html
<button class="example-btn" data-example="Your prompt here">Button Text</button>
```

### Styling Customization
Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4f46e5;     /* Main theme color */
    --puter-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding New Models
Extend the model registry in `puterModelCapabilities.js`:
```javascript
'new-model': {
    name: 'New Model',
    type: 'chat',
    supports: { text: true, vision: false },
    service: 'puter.ai.chat',
    parameters: { model: 'new-model' }
}
```

## 🌐 About Puter

[Puter](https://puter.com) is an open-source cloud operating system that provides:
- **Privacy-focused**: No tracking or data monetization
- **Serverless architecture**: No backend setup required
- **Free tier**: Generous free usage limits
- **Open source**: Transparent and community-driven

## 🛠️ Development

### Debug Mode
Open browser console to access debug information:
```javascript
// Check app status
puterApp.getStatus();

// Show help
puterApp.showHelp();

// Access managers
puterUIManager.showError('Test message');
```

### Local Development
1. Clone the repository
2. Make your changes
3. Test in browser
4. No build process required!

## 🐛 Troubleshooting

### Common Issues

**"Puter.js library failed to load"**
- Check internet connection
- Try refreshing the page
- Check browser console for errors

**Images not uploading**
- Ensure file size is reasonable (< 10MB recommended)
- Check file format (JPG, PNG, WebP supported)
- Try refreshing the page

**Model not responding**
- Check if you have internet connection
- Try switching models
- Look at browser console for error messages

**Vision/image analysis not working**
- Make sure you selected GPT-4 or Claude
- Upload image first, then ask your question
- Try the "Analyze Image" example button

### Debug Information
1. Press **F12** to open browser developer tools
2. Check the **Console** tab for error messages
3. Press **F1** in the app to show help dialog
4. Try refreshing the page if issues persist

## 📱 Mobile Support

The chatbot is fully responsive and works great on mobile devices:
- Touch-friendly interface
- Mobile-optimized layout  
- Drag & drop support on mobile
- All features available on smaller screens

## 🔒 Privacy & Security

- **No data storage**: Conversations are not stored
- **Client-side only**: No server-side processing
- **Puter privacy**: Puter doesn't track or monetize data
- **Secure connections**: All API calls use HTTPS

## 📄 License

MIT License - feel free to modify and distribute.

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section above
2. Try refreshing the page
3. Check browser console for error messages
4. Visit [Puter Documentation](https://docs.puter.com) for API details

---

**Built with ❤️ using Puter.js and modern web technologies**

Try it now by opening `index.html` in your browser!
