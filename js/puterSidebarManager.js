/**
 * Enhanced Sidebar Manager for Puter.js AI Chatbot
 * Manages model categories, selection, and sidebar interactions
 */

class PuterSidebarManager {
    constructor(modelConfig, chatMemory) {
        this.modelConfig = modelConfig;
        this.chatMemory = chatMemory;
        this.currentModel = null;
        this.collapsedCategories = new Set();
        
        this.initializeSidebar();
    }

    initializeSidebar() {
        this.populateModelCategories();
        this.bindSidebarEvents();
        this.loadSidebarState();
    }

    populateModelCategories() {
        const categories = ['chat', 'vision', 'txt2img', 'img2txt', 'txt2speech'];
        
        categories.forEach(category => {
            const models = this.modelConfig.getModelsByCategory(category);
            const container = document.getElementById(`${category}Models`);
            
            if (container && models.length > 0) {
                container.innerHTML = this.renderModelList(models, category);
            }
        });
    }

    renderModelList(models, category) {
        return models.map(model => `
            <div class="model-item" data-model-id="${model.id}" data-category="${category}">
                <div class="model-info">
                    <div class="model-provider" style="color: ${this.modelConfig.getProviderColor(model.provider)}">
                        ${model.provider}
                    </div>
                </div>
                <div class="model-actions">
                    <button class="model-select-btn" data-model-id="${model.id}" title="Select this model">
                        Select
                    </button>
                </div>
            </div>
        `).join('');
    }

    bindSidebarEvents() {
        // Category toggle events
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.toggleCategory(category);
            });
        });

        // Model selection events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('model-select-btn')) {
                const modelId = e.target.dataset.modelId;
                this.selectModel(modelId);
            }
        });

        // Sidebar toggle handled by UI Manager to avoid conflicts

        // Click outside to close
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('settingsSidebar');
            const toggleBtn = document.getElementById('toggleParams');
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    toggleCategory(category) {
        const header = document.querySelector(`[data-category="${category}"]`);
        const content = document.getElementById(`${category}Models`);
        const toggle = header.querySelector('.category-toggle');
        
        if (this.collapsedCategories.has(category)) {
            // Expand
            this.collapsedCategories.delete(category);
            content.style.display = 'block';
            toggle.textContent = '▼';
            header.classList.remove('collapsed');
        } else {
            // Collapse
            this.collapsedCategories.add(category);
            content.style.display = 'none';
            toggle.textContent = '▶';
            header.classList.add('collapsed');
        }
        
        this.saveSidebarState();
    }

    selectModel(modelId) {
        const model = this.modelConfig.getModelById(modelId);
        if (!model) return;

        // Update current model
        this.currentModel = model;

        // Update main model selector
        const mainSelector = document.getElementById('modelSelect');
        if (mainSelector) {
            mainSelector.value = modelId;
        }

        // Update UI to show selected model
        document.querySelectorAll('.model-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`[data-model-id="${modelId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        // Update model capabilities in UI
        this.updateModelCapabilities(modelId);

        // Dispatch model change event
        this.dispatchModelChangeEvent(model);

        // Show selection feedback
        this.showModelSelectionFeedback(model);
    }

    updateModelCapabilities(modelId) {
        const capabilities = this.modelConfig.getModelCapabilities(modelId);
        if (!capabilities) return;

        // Update max tokens slider if needed
        const maxTokensSlider = document.getElementById('maxTokensInput');
        if (maxTokensSlider) {
            maxTokensSlider.max = capabilities.maxTokens;
            if (parseInt(maxTokensSlider.value) > capabilities.maxTokens) {
                maxTokensSlider.value = capabilities.maxTokens;
                document.getElementById('maxTokensValue').textContent = capabilities.maxTokens;
            }
        }

        // Show/hide relevant UI elements based on capabilities
        this.updateUIForCapabilities(capabilities);
    }

    updateUIForCapabilities(capabilities) {
        // Update file upload visibility - only for GPT-4 Vision
        const fileUpload = document.querySelector('.file-upload');
        if (fileUpload) {
            fileUpload.style.display = capabilities.supportsImageInput ? 'block' : 'none';
        }

        // Update streaming option availability
        const streamMode = document.getElementById('streamMode');
        if (streamMode) {
            streamMode.disabled = !capabilities.streaming;
        }
    }

    showModelInfo(modelId) {
        // Model info popup removed - simplified interface
    }

    showModelSelectionFeedback(model) {
        // Create feedback message
        const feedback = document.createElement('div');
        feedback.className = 'model-selection-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">✅</span>
                <span class="feedback-text">Selected: ${model.provider}</span>
            </div>
        `;

        // Add to sidebar
        const sidebar = document.getElementById('settingsSidebar');
        if (sidebar) {
            sidebar.appendChild(feedback);
            
            // Remove after animation
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 2000);
        }
    }

    dispatchModelChangeEvent(model) {
        const event = new CustomEvent('modelChanged', {
            detail: { model, capabilities: this.modelConfig.getModelCapabilities(model.id) }
        });
        document.dispatchEvent(event);
    }

    getCurrentModel() {
        return this.currentModel;
    }

    saveSidebarState() {
        const state = {
            collapsedCategories: Array.from(this.collapsedCategories),
            currentModel: this.currentModel?.id || null
        };
        localStorage.setItem('puter_sidebar_state', JSON.stringify(state));
    }

    loadSidebarState() {
        try {
            const stored = localStorage.getItem('puter_sidebar_state');
            if (stored) {
                const state = JSON.parse(stored);
                
                // Restore collapsed categories
                if (state.collapsedCategories) {
                    state.collapsedCategories.forEach(category => {
                        this.collapsedCategories.add(category);
                        this.toggleCategory(category);
                    });
                }
                
                // Restore selected model
                if (state.currentModel) {
                    this.selectModel(state.currentModel);
                }
            }
        } catch (error) {
            console.warn('Failed to load sidebar state:', error);
        }
    }

    // Search functionality for models
    searchModels(query) {
        const allModels = this.modelConfig.getAllModels();
        const results = allModels.filter(model => 
            model.name.toLowerCase().includes(query.toLowerCase()) ||
            model.description.toLowerCase().includes(query.toLowerCase()) ||
            model.provider.toLowerCase().includes(query.toLowerCase())
        );
        
        return results;
    }

    // Filter models by provider
    filterByProvider(provider) {
        const allModels = this.modelConfig.getAllModels();
        return allModels.filter(model => model.provider === provider);
    }
}

// Export for use in other modules
window.PuterSidebarManager = PuterSidebarManager;