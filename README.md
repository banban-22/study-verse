# My Study Space 📚

A comprehensive, focused study environment designed to maximize productivity and track your learning journey. This web application provides all essential study tools with advanced features like contribution graphs, session tagging, and structured AI assistance.

## 🌟 Core Features

### 1. **Study Timer with Session Tags** ⏱️🏷️
- Count-up timer to track study sessions
- Start, pause, and reset functionality
- **Session Tagging System:**
  - Tag each session with subjects: 財務諸表論, 簿記論, 理論, 計算
  - Activity tags: Past Exam, Review, Memorize
  - Track which topics you study most
- Automatic session tracking:
  - Total study time today
  - Number of completed study sessions
- Persistent timer state (survives page reloads)
- Data automatically resets at midnight
- **Study sessions are recorded when you click Start → Pause/Reset**

### 2. **Contribution Graph & Study Streak** 📊🔥
- **Visual contribution graph** (GitHub-style) showing last 12 weeks
- **Study streak tracker** - consecutive days studied
- Color-coded intensity based on study duration:
  - No study (dark)
  - < 30 minutes (light)
  - 30 min - 1 hour (medium)
  - 1-2 hours (bright)
  - 2+ hours (intense)
- Hover to see detailed study time for each day
- Real-time stats: current streak, total study days, total hours

### 3. **Detailed Study Statistics** 📈
Click "Detailed Stats" to view:
- **Time by Tag**: See how much time you've spent on each subject/activity
  - Visual progress bars
  - Session counts per tag
  - Percentage breakdown
- **Best Study Time**: Analyze when you study most effectively
  - Morning (5am-12pm)
  - Afternoon (12pm-5pm)
  - Evening (5pm-9pm)
  - Night (9pm-5am)
- **Best Study Day**: Your most productive day with total hours
- **Last 7 Days Chart**: Visual bar chart of recent study patterns

### 4. **Study Tasks (Todo List)** ✅
- Add, complete, and delete study tasks
- Visual indication of completed tasks
- Task counter showing active tasks
- One-click clear completed tasks
- All tasks saved to local storage
- Empty state with helpful prompt

### 5. **Study With Me (YouTube Player)** 🎵
- Embedded YouTube video player for study ambience
- **ASMR & Quiet Study Videos**:
  - Library ASMR
  - Quiet Study Sessions
  - Silent Study Environments
- Change videos by pasting YouTube URL or video ID
- Remembers your last played video
- Perfect for creating a focused study atmosphere

### 6. **AI Assistants** 🤖

#### Quick Access Links:
- **ChatGPT** - For questions, explanations, and brainstorming
- **Google AI Studio** - For research and learning with Gemini

#### Quick Prompt Templates:
One-click copy prompts:
- "Explain this concept in simple terms:"
- "Create a study plan for:"
- "Quiz me on:"
- "Summarize:"

#### **Structured AI Help** 💬 (NEW!)
Click **"I'm stuck. Explain like I'm studying for an exam."** to open a structured template:
- **Question**: What are you trying to understand?
- **What I tried**: Your attempted approaches
- **What I need**: Specific help required
- **Output format**: Choose bullet points, step-by-step, or examples

The template is automatically formatted and can be:
- Copied to clipboard
- Opened directly in ChatGPT
- Opened directly in Google AI Studio

This structured approach helps AI give you better, more focused answers!

### 7. **Focus Mode** 🎯
- Toggle to dim all panels except the timer
- Minimizes distractions during deep focus sessions
- Keyboard shortcut: `Ctrl+F` (or `Cmd+F` on Mac)
- Focus state persists across sessions

### 8. **Additional Features**
- Real-time date and time display
- Clean, modern dark theme for reduced eye strain
- Fully responsive design (works on desktop, tablet, mobile)
- Keyboard shortcuts:
  - `Ctrl+F` / `Cmd+F`: Toggle Focus Mode
  - `Ctrl+Space` / `Cmd+Space`: Start/Pause Timer
- Custom notification system for user feedback
- All data persists using local storage

## 🚀 Getting Started

Simply open `index.html` in your web browser. No installation or setup required!

## 📁 Project Structure

```
my-study-space/
├── index.html              # Main HTML structure
├── css/
│   └── style.css          # Complete styling with dark theme
├── js/
│   ├── timer.js           # Timer functionality with tagging
│   ├── todo.js            # Todo list functionality
│   ├── youtube.js         # YouTube player controls
│   ├── contribution.js    # Contribution graph & statistics
│   └── main.js            # Main app logic, focus mode, AI modal
└── README.md              # This file
```

## 🎨 Design Philosophy

This study space was designed with focus and productivity in mind:

1. **Minimal Distractions**: Clean interface with a calming dark theme
2. **Everything in One Place**: All study tools accessible without switching tabs
3. **Track Your Progress**: Visual feedback on study habits and streaks
4. **Data-Driven Learning**: Understand your study patterns and optimize
5. **Focus Mode**: Special mode to eliminate distractions when you need deep concentration
6. **Structured Learning**: AI assistance template for better Q&A results
7. **Persistent Data**: Your progress, tasks, and preferences are automatically saved
8. **Responsive Design**: Works seamlessly across all devices

## 💡 Usage Tips

### Starting a Study Session:
1. **Select a session tag** (e.g., 財務諸表論, Review, Past Exam)
2. **Add your study tasks** for the session
3. **Click Start** on the timer (this marks you as "studying today")
4. **Play background ambience** if it helps you focus
5. Work through your tasks

### Tracking Your Progress:
- **Click Reset** when finishing a session to record it in your contribution graph
- Sessions are tagged and counted toward your daily total
- Check your study streak in the Contribution Graph panel
- View **Detailed Stats** to see which subjects you focus on most

### Staying Focused:
- Use **Focus Mode** (`Ctrl+F`) when you need maximum concentration
- The timer keeps running and automatically saves progress
- Only the timer is visible in focus mode

### Getting Help:
- Click **"I'm stuck. Explain like I'm studying for an exam."**
- Fill in the structured template with your question
- Choose your preferred answer format (bullets/steps/examples)
- Copy and paste into ChatGPT or Google AI Studio
- Get better, more targeted answers!

### Analyzing Your Study Habits:
- View the **contribution graph** to visualize your consistency
- Check your **study streak** to stay motivated
- Open **Detailed Stats** to see:
  - Which subjects need more time
  - Your most productive time of day
  - Recent study trends

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks, pure JS for best performance
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family
- **Local Storage API**: Data persistence
- **Canvas/SVG**: Contribution graph visualization

### Browser Compatibility
Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### Data Storage
All data is stored locally in your browser using `localStorage`:
- Timer sessions and daily totals
- Session tags and timestamps
- Contribution graph data (last 12 weeks)
- Study statistics by tag and time of day
- Todo list tasks
- Last played YouTube video
- Focus mode preference

**Note**: Clearing browser data will reset all saved information.

## 📊 Understanding the Contribution Graph

The contribution graph works like GitHub's:
- Each square = one day
- Color intensity = study duration
- Hover over any day to see exact time studied
- A "study day" = any day you started the timer
- Build streaks by studying consecutive days

## 🎯 What Makes This Different?

This isn't just a timer app - it's a complete study analytics platform:
- **Track what you study**, not just when
- **Visualize your consistency** with contribution graphs
- **Understand your patterns** with time-of-day analysis
- **Get better AI help** with structured question templates
- **Stay motivated** with streak tracking
- **Focus deeply** with distraction-free mode

## 🎓 Perfect For:

- **Exam preparation** (especially with session tags for different subjects)
- **CPA study** (財務諸表論, 簿記論 support)
- **Professional certifications**
- **Language learning**
- **Self-study programs**
- **Anyone serious about tracking study progress**

## 📝 Future Enhancement Ideas

Potential additions could include:
- Pomodoro timer mode
- Export study data to CSV/PDF
- Weekly/monthly reports
- Goal setting (e.g., "Study 20 hours this week")
- Customizable tag colors
- Multiple timer presets
- Study session notes
- Integration with calendar apps

## 🙏 Acknowledgments

Designed for serious students who want to track their learning journey. Stay focused, stay consistent, build your streak! 🎓🔥

---

**Version**: 2.0.0 (Contribution Graph Edition)  
**Last Updated**: January 2026  
**License**: Free to use and modify

---

## 🚀 Deployment

To make this website live and accessible online, go to the **Publish tab** where you can publish your project with one click. The Publish tab will handle all deployment processes automatically and provide you with the live website URL.

Happy Studying! Build that streak! 📚✨🔥
# study-verse
