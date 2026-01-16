// Timer functionality with local storage persistence
class StudyTimer {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.currentTag = null;
        this.sessionStartTime = null;
        
        // Load saved data
        this.loadData();
        
        // DOM elements
        this.display = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.todayTimeDisplay = document.getElementById('todayTime');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.selectedTagDisplay = document.getElementById('selectedTag');
        
        // Session tags
        this.initializeTagSelector();
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Initialize display
        this.updateDisplay();
        this.updateStats();
        
        // Check if timer was running before page reload
        if (this.isRunning) {
            this.continueTimer();
        }
    }
    
    loadData() {
        const savedData = localStorage.getItem('studyTimerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const today = new Date().toDateString();
            
            // Reset if new day
            if (data.date !== today) {
                this.todayTime = 0;
                this.sessionCount = 0;
            } else {
                this.todayTime = data.todayTime || 0;
                this.sessionCount = data.sessionCount || 0;
                this.elapsedTime = data.elapsedTime || 0;
                this.isRunning = data.isRunning || false;
                this.startTime = data.startTime || 0;
                this.currentTag = data.currentTag || null;
                this.sessionStartTime = data.sessionStartTime || null;
            }
        } else {
            this.todayTime = 0;
            this.sessionCount = 0;
        }
    }
    
    initializeTagSelector() {
        const tagButtons = document.querySelectorAll('.tag-btn');
        tagButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tagButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Set current tag
                this.currentTag = btn.getAttribute('data-tag');
                this.selectedTagDisplay.textContent = this.currentTag;
                
                // Save
                this.saveData();
            });
        });
        
        // Display saved tag
        if (this.currentTag) {
            this.selectedTagDisplay.textContent = this.currentTag;
            tagButtons.forEach(btn => {
                if (btn.getAttribute('data-tag') === this.currentTag) {
                    btn.classList.add('active');
                }
            });
        }
    }
    
    saveData() {
        const data = {
            date: new Date().toDateString(),
            todayTime: this.todayTime,
            sessionCount: this.sessionCount,
            elapsedTime: this.elapsedTime,
            isRunning: this.isRunning,
            startTime: this.startTime,
            currentTag: this.currentTag,
            sessionStartTime: this.sessionStartTime
        };
        localStorage.setItem('studyTimerData', JSON.stringify(data));
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.sessionStartTime = new Date();
            this.timerInterval = setInterval(() => this.tick(), 100);
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            this.saveData();
        }
    }
    
    continueTimer() {
        if (this.isRunning && this.startTime > 0) {
            this.timerInterval = setInterval(() => this.tick(), 100);
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            
            this.saveData();
        }
    }
    
    reset() {
        const shouldReset = confirm('Reset timer? This will save your current session time.');
        if (!shouldReset) return;
        
        // Add current session to today's time and contribution graph
        if (this.elapsedTime > 0) {
            this.todayTime += this.elapsedTime;
            this.sessionCount++;
            
            // Record in contribution graph
            if (window.contributionGraph && this.sessionStartTime) {
                window.contributionGraph.recordSession(
                    this.sessionStartTime,
                    this.elapsedTime,
                    this.currentTag
                );
            }
        }
        
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.elapsedTime = 0;
        this.startTime = 0;
        this.sessionStartTime = null;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        this.updateDisplay();
        this.updateStats();
        this.saveData();
    }
    
    tick() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
            
            // Save every minute
            if (Math.floor(this.elapsedTime / 1000) % 60 === 0) {
                this.saveData();
            }
        }
    }
    
    updateDisplay() {
        const hours = Math.floor(this.elapsedTime / 3600000);
        const minutes = Math.floor((this.elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        
        this.display.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateStats() {
        const totalHours = Math.floor(this.todayTime / 3600000);
        const totalMinutes = Math.floor((this.todayTime % 3600000) / 60000);
        
        this.todayTimeDisplay.textContent = `${totalHours}h ${totalMinutes}m`;
        this.sessionCountDisplay.textContent = this.sessionCount;
    }
}

// Initialize timer when page loads
let studyTimer;
document.addEventListener('DOMContentLoaded', () => {
    studyTimer = new StudyTimer();
});
