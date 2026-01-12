// Counter Application with Local Storage
class CounterApp {
    constructor() {
        // DOM Elements
        this.counterValue = document.getElementById('counter-value');
        this.incrementBtn = document.getElementById('increment-btn');
        this.decrementBtn = document.getElementById('decrement-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.lastUpdated = document.getElementById('last-updated');
        
        // Local Storage Key
        this.storageKey = 'personalCounterData';
        
        // Initialize
        this.init();
    }
    
    init() {
        // Load saved data from local storage
        this.loadFromStorage();
        
        // Attach event listeners
        this.attachEventListeners();
        
        // Display initial last updated time
        this.updateLastUpdated();
    }
    
    attachEventListeners() {
        this.incrementBtn.addEventListener('click', () => this.increment());
        this.decrementBtn.addEventListener('click', () => this.decrement());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === '+') {
                e.preventDefault();
                this.increment();
            } else if (e.key === 'ArrowDown' || e.key === '-') {
                e.preventDefault();
                this.decrement();
            } else if (e.key === 'r' || e.key === 'R') {
                this.reset();
            }
        });
    }
    
    getCurrentCount() {
        return parseInt(this.counterValue.textContent) || 0;
    }
    
    setCount(value) {
        this.counterValue.textContent = value;
        this.addPulseAnimation();
        this.saveToStorage(value);
        this.updateLastUpdated();
    }
    
    increment() {
        const currentValue = this.getCurrentCount();
        this.setCount(currentValue + 1);
    }
    
    decrement() {
        const currentValue = this.getCurrentCount();
        this.setCount(currentValue - 1);
    }
    
    reset() {
        // Confirm reset action
        if (confirm('Are you sure you want to reset the counter to 0?')) {
            this.setCount(0);
        }
    }
    
    addPulseAnimation() {
        this.counterValue.classList.remove('pulse');
        // Trigger reflow to restart animation
        void this.counterValue.offsetWidth;
        this.counterValue.classList.add('pulse');
    }
    
    saveToStorage(count) {
        const data = {
            count: count,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to local storage:', error);
            this.showError('Unable to save data. Your browser may have storage disabled.');
        }
    }
    
    loadFromStorage() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            
            if (savedData) {
                const data = JSON.parse(savedData);
                this.counterValue.textContent = data.count || 0;
                
                // Update last updated time if available
                if (data.lastUpdated) {
                    this.updateLastUpdated(data.lastUpdated);
                }
            }
        } catch (error) {
            console.error('Error loading from local storage:', error);
            this.showError('Unable to load saved data.');
        }
    }
    
    updateLastUpdated(timestamp = null) {
        if (!timestamp) {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                timestamp = data.lastUpdated;
            }
        }
        
        if (timestamp) {
            const date = new Date(timestamp);
            this.lastUpdated.textContent = this.formatDate(date);
        } else {
            this.lastUpdated.textContent = 'Never';
        }
    }
    
    formatDate(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-US', options);
        }
    }
    
    showError(message) {
        // Simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CounterApp();
});
