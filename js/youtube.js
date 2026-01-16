// YouTube video player functionality
class YouTubePlayer {
    constructor() {
        this.player = document.getElementById('youtubePlayer');
        this.videoUrlInput = document.getElementById('videoUrlInput');
        this.changeVideoBtn = document.getElementById('changeVideoBtn');
        this.suggestionButtons = document.querySelectorAll('.btn-suggestion');
        
        // Event listeners
        this.changeVideoBtn.addEventListener('click', () => this.changeVideo());
        this.videoUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.changeVideo();
        });
        
        // Suggestion buttons
        this.suggestionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const videoId = btn.getAttribute('data-video');
                this.loadVideo(videoId);
            });
        });
        
        // Load saved video
        this.loadSavedVideo();
    }
    
    loadSavedVideo() {
        const savedVideoId = localStorage.getItem('youtubeVideoId');
        if (savedVideoId) {
            this.loadVideo(savedVideoId);
        }
    }
    
    changeVideo() {
        const input = this.videoUrlInput.value.trim();
        if (!input) {
            alert('Please enter a YouTube URL or video ID');
            return;
        }
        
        const videoId = this.extractVideoId(input);
        if (videoId) {
            this.loadVideo(videoId);
            this.videoUrlInput.value = '';
        } else {
            alert('Invalid YouTube URL or video ID. Please try again.');
        }
    }
    
    extractVideoId(input) {
        // If it's just a video ID (11 characters)
        if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
            return input;
        }
        
        // Extract from various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
        ];
        
        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        return null;
    }
    
    loadVideo(videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0`;
        this.player.src = embedUrl;
        
        // Save to local storage
        localStorage.setItem('youtubeVideoId', videoId);
    }
}

// Initialize YouTube player when page loads
let youtubePlayer;
document.addEventListener('DOMContentLoaded', () => {
    youtubePlayer = new YouTubePlayer();
});
