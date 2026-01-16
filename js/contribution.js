// Contribution Graph and Statistics
class ContributionGraph {
    constructor() {
        this.data = this.loadData();
        this.graphContainer = document.getElementById('contributionGraph');
        this.streakCountEl = document.getElementById('streakCount');
        this.totalDaysEl = document.getElementById('totalDays');
        this.totalHoursEl = document.getElementById('totalHours');
        
        this.render();
        this.updateStats();
    }
    
    loadData() {
        const saved = localStorage.getItem('studyContributionData');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveData() {
        localStorage.setItem('studyContributionData', JSON.stringify(this.data));
    }
    
    // Record a study session
    recordSession(date, duration, tag) {
        const dateKey = this.getDateKey(date);
        
        if (!this.data[dateKey]) {
            this.data[dateKey] = {
                totalTime: 0,
                sessions: [],
                tags: {}
            };
        }
        
        this.data[dateKey].totalTime += duration;
        this.data[dateKey].sessions.push({
            time: duration,
            tag: tag || 'untagged',
            timestamp: date.getTime()
        });
        
        // Track time per tag
        if (tag) {
            if (!this.data[dateKey].tags[tag]) {
                this.data[dateKey].tags[tag] = 0;
            }
            this.data[dateKey].tags[tag] += duration;
        }
        
        this.saveData();
        this.render();
        this.updateStats();
    }
    
    getDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    // Calculate current streak
    calculateStreak() {
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);
        
        while (true) {
            const dateKey = this.getDateKey(currentDate);
            if (this.data[dateKey] && this.data[dateKey].totalTime > 0) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    // Get total study days
    getTotalDays() {
        return Object.keys(this.data).filter(key => this.data[key].totalTime > 0).length;
    }
    
    // Get total study hours
    getTotalHours() {
        let totalMs = 0;
        Object.values(this.data).forEach(day => {
            totalMs += day.totalTime || 0;
        });
        return Math.round(totalMs / 3600000 * 10) / 10; // Round to 1 decimal
    }
    
    updateStats() {
        this.streakCountEl.textContent = this.calculateStreak();
        this.totalDaysEl.textContent = this.getTotalDays();
        this.totalHoursEl.textContent = this.getTotalHours();
    }
    
    // Render contribution graph (last 12 weeks)
    render() {
        const today = new Date();
        const weeks = 12;
        const days = weeks * 7;
        
        let html = '<div class="graph-weeks">';
        
        // Generate graph for last 12 weeks
        for (let week = 0; week < weeks; week++) {
            html += '<div class="graph-week">';
            
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(today);
                currentDate.setDate(currentDate.getDate() - (weeks * 7 - 1) + (week * 7 + day));
                
                const dateKey = this.getDateKey(currentDate);
                const dayData = this.data[dateKey];
                const studyTime = dayData ? dayData.totalTime : 0;
                
                let level = 0;
                if (studyTime > 0) {
                    if (studyTime < 1800000) level = 1; // < 30 min
                    else if (studyTime < 3600000) level = 2; // < 1 hour
                    else if (studyTime < 7200000) level = 3; // < 2 hours
                    else level = 4; // >= 2 hours
                }
                
                const tooltip = this.formatTooltip(currentDate, dayData);
                
                html += `<div class="graph-day level-${level}" 
                             data-date="${dateKey}" 
                             title="${tooltip}"></div>`;
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        
        // Add legend
        html += `
            <div class="graph-legend">
                <span>Less</span>
                <div class="legend-scale">
                    <div class="legend-box level-0"></div>
                    <div class="legend-box level-1"></div>
                    <div class="legend-box level-2"></div>
                    <div class="legend-box level-3"></div>
                    <div class="legend-box level-4"></div>
                </div>
                <span>More</span>
            </div>
        `;
        
        this.graphContainer.innerHTML = html;
    }
    
    formatTooltip(date, dayData) {
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        if (!dayData || dayData.totalTime === 0) {
            return `${dateStr}: No study`;
        }
        
        const hours = Math.floor(dayData.totalTime / 3600000);
        const minutes = Math.floor((dayData.totalTime % 3600000) / 60000);
        const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        
        return `${dateStr}: ${timeStr} studied`;
    }
    
    // Get detailed statistics
    getDetailedStats() {
        const stats = {
            tagStats: {},
            timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
            bestDay: { date: null, time: 0 },
            recentDays: []
        };
        
        // Calculate tag statistics
        Object.values(this.data).forEach(day => {
            if (day.tags) {
                Object.entries(day.tags).forEach(([tag, time]) => {
                    if (!stats.tagStats[tag]) {
                        stats.tagStats[tag] = { time: 0, sessions: 0 };
                    }
                    stats.tagStats[tag].time += time;
                    stats.tagStats[tag].sessions += day.sessions.filter(s => s.tag === tag).length;
                });
            }
            
            // Time of day analysis
            day.sessions.forEach(session => {
                const hour = new Date(session.timestamp).getHours();
                if (hour >= 5 && hour < 12) stats.timeOfDay.morning += session.time;
                else if (hour >= 12 && hour < 17) stats.timeOfDay.afternoon += session.time;
                else if (hour >= 17 && hour < 21) stats.timeOfDay.evening += session.time;
                else stats.timeOfDay.night += session.time;
            });
        });
        
        // Find best day
        Object.entries(this.data).forEach(([date, day]) => {
            if (day.totalTime > stats.bestDay.time) {
                stats.bestDay = { date, time: day.totalTime };
            }
        });
        
        // Recent 7 days
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            const dayData = this.data[dateKey];
            
            stats.recentDays.push({
                date: dateKey,
                time: dayData ? dayData.totalTime : 0,
                tags: dayData ? dayData.tags : {}
            });
        }
        
        return stats;
    }
}

// Detailed Statistics Modal
class StatsModal {
    constructor(contributionGraph) {
        this.graph = contributionGraph;
        this.modal = document.getElementById('statsModal');
        this.closeBtn = document.getElementById('closeStatsModalBtn');
        this.viewStatsBtn = document.getElementById('viewStatsBtn');
        this.statsContent = document.getElementById('statsContent');
        
        this.viewStatsBtn.addEventListener('click', () => this.show());
        this.closeBtn.addEventListener('click', () => this.hide());
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }
    
    show() {
        const stats = this.graph.getDetailedStats();
        this.renderStats(stats);
        this.modal.classList.add('active');
    }
    
    hide() {
        this.modal.classList.remove('active');
    }
    
    renderStats(stats) {
        let html = '';
        
        // Tag Statistics
        html += '<div class="stat-section">';
        html += '<h4><i class="fas fa-tags"></i> Time by Tag</h4>';
        
        if (Object.keys(stats.tagStats).length > 0) {
            html += '<div class="tag-stats-list">';
            
            const sortedTags = Object.entries(stats.tagStats)
                .sort((a, b) => b[1].time - a[1].time);
            
            sortedTags.forEach(([tag, data]) => {
                const hours = Math.floor(data.time / 3600000);
                const minutes = Math.floor((data.time % 3600000) / 60000);
                const timeStr = `${hours}h ${minutes}m`;
                const percentage = (data.time / this.graph.getTotalHours() / 36000) * 100;
                
                html += `
                    <div class="tag-stat-item">
                        <div class="tag-stat-header">
                            <span class="tag-name">${tag}</span>
                            <span class="tag-time">${timeStr}</span>
                        </div>
                        <div class="tag-stat-bar">
                            <div class="tag-stat-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="tag-stat-meta">${data.sessions} sessions</div>
                    </div>
                `;
            });
            
            html += '</div>';
        } else {
            html += '<p class="no-data">No tagged sessions yet</p>';
        }
        
        html += '</div>';
        
        // Time of Day
        html += '<div class="stat-section">';
        html += '<h4><i class="fas fa-clock"></i> Best Study Time</h4>';
        html += '<div class="time-of-day-grid">';
        
        const timeLabels = {
            morning: '🌅 Morning (5am-12pm)',
            afternoon: '☀️ Afternoon (12pm-5pm)',
            evening: '🌆 Evening (5pm-9pm)',
            night: '🌙 Night (9pm-5am)'
        };
        
        Object.entries(stats.timeOfDay).forEach(([period, time]) => {
            const hours = (time / 3600000).toFixed(1);
            html += `
                <div class="time-period-card">
                    <div class="time-period-label">${timeLabels[period]}</div>
                    <div class="time-period-value">${hours}h</div>
                </div>
            `;
        });
        
        html += '</div></div>';
        
        // Best Day
        html += '<div class="stat-section">';
        html += '<h4><i class="fas fa-trophy"></i> Best Study Day</h4>';
        
        if (stats.bestDay.date) {
            const hours = Math.floor(stats.bestDay.time / 3600000);
            const minutes = Math.floor((stats.bestDay.time % 3600000) / 60000);
            html += `
                <div class="best-day-card">
                    <div class="best-day-date">${stats.bestDay.date}</div>
                    <div class="best-day-time">${hours}h ${minutes}m</div>
                </div>
            `;
        } else {
            html += '<p class="no-data">Start studying to see your best day!</p>';
        }
        
        html += '</div>';
        
        // Recent 7 Days
        html += '<div class="stat-section full-width">';
        html += '<h4><i class="fas fa-calendar-week"></i> Last 7 Days</h4>';
        html += '<div class="recent-days-chart">';
        
        stats.recentDays.reverse().forEach(day => {
            const height = Math.min((day.time / 14400000) * 100, 100); // Max 4 hours
            const hours = (day.time / 3600000).toFixed(1);
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            html += `
                <div class="recent-day-bar">
                    <div class="bar-container">
                        <div class="bar-fill" style="height: ${height}%"></div>
                    </div>
                    <div class="bar-label">${hours}h</div>
                    <div class="bar-day">${dayName}</div>
                </div>
            `;
        });
        
        html += '</div></div>';
        
        this.statsContent.innerHTML = html;
    }
}

// Initialize
let contributionGraph;
let statsModal;

document.addEventListener('DOMContentLoaded', () => {
    contributionGraph = new ContributionGraph();
    statsModal = new StatsModal(contributionGraph);
});
