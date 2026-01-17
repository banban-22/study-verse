// Timer functionality with local storage persistence
class StudyTimer {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.currentTag = null;
        this.sessionStartTime = null;
        this.currentDate = new Date().toDateString();
        this.tags = this.loadTags();
        
        // Load saved data
        this.loadData();
        if (this.currentTag && !this.tags.includes(this.currentTag)) {
            this.tags.push(this.currentTag);
            this.saveTags();
        }
        
        // DOM elements
        this.display = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.todayTimeDisplay = document.getElementById('todayTime');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.selectedTagDisplay = document.getElementById('selectedTag');
        this.tagInput = document.getElementById('tagInput');
        this.addTagBtn = document.getElementById('addTagBtn');
        this.tagsContainer = document.getElementById('sessionTags');
        this.tagsEmpty = document.getElementById('tagsEmpty');
        
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
            const parseNumber = (value, fallback = 0) => {
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : fallback;
            };
            
            // Reset if new day
            if (data.date !== today) {
                this.currentDate = today;
                this.todayTime = 0;
                this.sessionCount = 0;
                this.elapsedTime = 0;
                this.isRunning = false;
                this.startTime = 0;
                this.sessionStartTime = null;
            } else {
                this.currentDate = data.date || today;
                this.todayTime = parseNumber(data.todayTime);
                this.sessionCount = Math.max(0, Math.floor(parseNumber(data.sessionCount)));
                this.elapsedTime = parseNumber(data.elapsedTime);
                this.isRunning = data.isRunning || false;
                this.startTime = parseNumber(data.startTime);
                this.currentTag = data.currentTag || null;
                const parsedSessionStartTime = data.sessionStartTime ? new Date(data.sessionStartTime) : null;
                this.sessionStartTime = parsedSessionStartTime && !Number.isNaN(parsedSessionStartTime.getTime())
                    ? parsedSessionStartTime
                    : null;
            }
        } else {
            this.todayTime = 0;
            this.sessionCount = 0;
        }
    }

    loadTags() {
        const savedTags = localStorage.getItem('studyTimerTags');
        return savedTags ? JSON.parse(savedTags) : [];
    }

    saveTags() {
        localStorage.setItem('studyTimerTags', JSON.stringify(this.tags));
    }
    
    initializeTagSelector() {
        this.renderTags();
        this.addTagBtn.addEventListener('click', () => this.addCustomTag());
        this.tagInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.addCustomTag();
            }
        });
    }

    renderTags() {
        this.tagsContainer.innerHTML = '';

        if (this.tags.length === 0) {
            this.tagsEmpty.style.display = 'block';
        } else {
            this.tagsEmpty.style.display = 'none';
        }

        this.tags.forEach(tag => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tag-btn';
            button.textContent = tag;
            button.setAttribute('data-tag', tag);

            if (this.currentTag === tag) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => this.selectTag(tag));
            this.tagsContainer.appendChild(button);
        });

        this.updateSelectedTagDisplay();
    }

    addCustomTag() {
        const tag = this.tagInput.value.trim();
        if (!tag) return;

        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.saveTags();
        }

        this.tagInput.value = '';
        this.selectTag(tag);
    }

    selectTag(tag) {
        if (this.currentTag === tag) {
            this.currentTag = null;
        } else {
            this.currentTag = tag;
        }

        this.saveData();
        this.renderTags();
    }
    
    saveData() {
        const data = {
            date: this.currentDate,
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
            this.ensureCurrentDay();
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
            
            this.updateStats();
            this.saveData();
        }
    }
    
    reset() {
        this.ensureCurrentDay();
        // Add current session to today's time and contribution graph
        if (this.elapsedTime > 0) {
            this.todayTime += this.elapsedTime;
            this.sessionCount++;
            
            // Record in contribution graph
            if (window.contributionGraph) {
                const sessionStartTime = this.sessionStartTime || new Date();
                window.contributionGraph.recordSession(
                    sessionStartTime,
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
            this.ensureCurrentDay();
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
            this.updateStats();
            
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
        const totalTime = this.todayTime + this.elapsedTime;
        const totalHours = Math.floor(totalTime / 3600000);
        const totalMinutes = Math.floor((totalTime % 3600000) / 60000);
        
        this.todayTimeDisplay.textContent = `${totalHours}h ${totalMinutes}m`;
        this.sessionCountDisplay.textContent = this.sessionCount;
    }

    updateSelectedTagDisplay() {
        this.selectedTagDisplay.textContent = this.currentTag || 'No tag selected';
    }

    ensureCurrentDay() {
        const today = new Date().toDateString();
        if (this.currentDate !== today) {
            this.currentDate = today;
            this.todayTime = 0;
            this.sessionCount = 0;

            if (this.isRunning) {
                this.startTime = Date.now();
                this.elapsedTime = 0;
                this.sessionStartTime = new Date();
            } else {
                this.elapsedTime = 0;
                this.startTime = 0;
                this.sessionStartTime = null;
            }
        }
    }
}

// Initialize timer when page loads
let studyTimer;
document.addEventListener('DOMContentLoaded', () => {
    studyTimer = new StudyTimer();
});
