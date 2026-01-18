// Daily schedule functionality
const scheduleData = {
    office: {
        label: 'Office Day',
        timeline: [
            { start: '04:00', end: '04:30', title: '起床・朝食', purpose: '体の起動' },
            { start: '04:30', end: '06:50', title: '🔥 集中学習（140分）', purpose: '計算・重タスク' },
            { start: '06:50', end: '07:50', title: '身支度・出発準備', purpose: '切替' },
            { start: '07:50', end: '09:00', title: '出発', purpose: '移動' },
            { start: '09:00', end: '18:15', title: '勤務', purpose: '—' },
            { start: '19:00', end: '19:40', title: '帰宅・夕食', purpose: '回復' },
            { start: '19:40', end: '20:20', title: '🚿 入浴', purpose: '神経回復' },
            { start: '20:30', end: '21:15', title: '⚡ 軽学習（45分）', purpose: '定着' },
            { start: '21:30', end: '23:59', title: '就寝準備', purpose: '睡眠' }
        ],
        guidelines: [
            {
                title: '🎯 朝（出社日）',
                items: ['🧮 計算問題', '🧠 新論点理解', '✍️ 解法テンプレ構築', '🔍 ミス分析']
            },
            {
                title: '🌙 夜（出社日）',
                items: ['📖 理論音読', '🗂 ノート整理', '📒 Log更新']
            }
        ]
    },
    remote: {
        label: 'Remote Day',
        timeline: [
            { start: '04:00', end: '04:30', title: '起床・朝食', purpose: '起動' },
            { start: '04:30', end: '06:00', title: '🔥 集中①（90分）', purpose: '最難関' },
            { start: '06:00', end: '06:15', title: '休憩', purpose: '回復' },
            { start: '06:15', end: '07:45', title: '🔥 集中②（90分）', purpose: '応用' },
            { start: '07:45', end: '08:00', title: '休憩', purpose: '回復' },
            { start: '08:00', end: '08:40', title: '🔥 集中③（40分）', purpose: '軽重' },
            { start: '08:40', end: '18:15', title: '勤務', purpose: '—' },
            { start: '18:15', end: '19:00', title: '夕食', purpose: '回復' },
            { start: '19:00', end: '19:40', title: '🚿 入浴', purpose: '神経回復' },
            { start: '20:00', end: '21:00', title: '⚡ 軽学習（60分）', purpose: '定着' },
            { start: '21:30', end: '23:59', title: '就寝準備', purpose: '睡眠' }
        ],
        guidelines: [
            {
                title: '🎯 朝（リモート日）',
                items: ['🥇 集中①：最難関（計算・新論点）', '🥈 集中②：準難関（応用）', '🥉 集中③：復習・整理']
            }
        ]
    },
    weekend: {
        label: 'Holiday / Weekend',
        timeline: [
            { start: '04:00', end: '04:30', title: '起床・朝食', purpose: '起動' },
            { start: '04:30', end: '06:00', title: '🔥 集中①', purpose: '超集中ゾーン' },
            { start: '06:00', end: '06:15', title: '休憩', purpose: '回復' },
            { start: '06:15', end: '07:45', title: '🔥 集中②', purpose: '超集中ゾーン' },
            { start: '07:45', end: '08:15', title: '休憩・軽運動', purpose: '回復' },
            { start: '08:15', end: '09:45', title: '🔥 集中③', purpose: '超集中ゾーン' },
            { start: '09:45', end: '10:15', title: '休憩', purpose: '回復' },
            { start: '10:15', end: '11:30', title: '散歩・回復', purpose: 'リフレッシュ' },
            { start: '11:30', end: '12:30', title: '昼食', purpose: '回復' },
            { start: '12:30', end: '14:00', title: '⚡ 軽学習①', purpose: '定着' },
            { start: '14:00', end: '14:30', title: '休憩', purpose: '回復' },
            { start: '14:30', end: '16:00', title: '⚡ 軽学習②', purpose: '定着' },
            { start: '16:00', end: '17:00', title: '自由', purpose: 'リラックス' },
            { start: '17:00', end: '18:00', title: '夕食', purpose: '回復' },
            { start: '18:00', end: '18:40', title: '🚿 入浴', purpose: '神経回復' },
            { start: '19:00', end: '20:00', title: '⚡ 軽学習③', purpose: '仕上げ' },
            { start: '20:00', end: '21:00', title: 'リラックス', purpose: '回復' },
            { start: '21:30', end: '23:59', title: '就寝', purpose: '睡眠' }
        ],
        guidelines: [
            {
                title: '📚 タスク仕分けルール',
                items: [
                    '🔥 朝タスク：計算問題 / 新論点理解 / 解法テンプレ構築 / ミス構造分析 / 答案構成',
                    '⚡ 夜タスク：理論音読 / ノート整理 / 図解・要約 / 学習ログ / 暗記カード',
                    '🟨 調整タスク：軽い計算復習 / 解説読み'
                ]
            },
            {
                title: '😴 睡眠・回復ルール',
                items: ['⭐ 起床4:00固定', '⭐ 就寝21:30目標', '⭐ 入浴は必須回復装置', '⭐ 週2日は睡眠延長トライ', '⭐ 昼寝15分OK']
            }
        ]
    }
};

function parseTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTimeRange(start, end) {
    return `${start}–${end}`;
}

function getCurrentScheduleEntry(timeline, nowMinutes) {
    for (let i = 0; i < timeline.length; i++) {
        const entry = timeline[i];
        const start = parseTimeToMinutes(entry.start);
        const end = parseTimeToMinutes(entry.end);
        if (nowMinutes >= start && nowMinutes < end) {
            return { currentIndex: i, entry };
        }
    }
    return { currentIndex: -1, entry: null };
}

function updateScheduleUI() {
    const scheduleType = document.getElementById('scheduleType');
    const scheduleList = document.getElementById('scheduleList');
    const scheduleGuidelines = document.getElementById('scheduleGuidelines');
    const currentTitle = document.getElementById('currentScheduleTitle');
    const currentTime = document.getElementById('currentScheduleTime');
    const currentPurpose = document.getElementById('currentSchedulePurpose');
    const nextTitle = document.getElementById('nextScheduleTitle');
    const nextTime = document.getElementById('nextScheduleTime');
    const nextPurpose = document.getElementById('nextSchedulePurpose');

    const selectedKey = scheduleType.value;
    const schedule = scheduleData[selectedKey];

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const { currentIndex, entry } = getCurrentScheduleEntry(schedule.timeline, nowMinutes);

    scheduleList.innerHTML = schedule.timeline
        .map((item, index) => {
            const isActive = index === currentIndex;
            return `
                <div class="schedule-item ${isActive ? 'active' : ''}">
                    <div class="schedule-time">${formatTimeRange(item.start, item.end)}</div>
                    <div class="schedule-details">
                        <div class="schedule-title">${item.title}</div>
                        <div class="schedule-purpose">${item.purpose}</div>
                    </div>
                </div>
            `;
        })
        .join('');

    if (entry) {
        currentTitle.textContent = entry.title;
        currentTime.textContent = formatTimeRange(entry.start, entry.end);
        currentPurpose.textContent = entry.purpose;
    } else {
        currentTitle.textContent = 'No active block';
        currentTime.textContent = '—';
        currentPurpose.textContent = 'Take a breather before the next block.';
    }

    const nextEntry = schedule.timeline[currentIndex + 1] || schedule.timeline[0];
    if (nextEntry) {
        nextTitle.textContent = nextEntry.title;
        nextTime.textContent = formatTimeRange(nextEntry.start, nextEntry.end);
        nextPurpose.textContent = nextEntry.purpose;
    }

    scheduleGuidelines.innerHTML = schedule.guidelines
        .map(section => {
            const items = section.items
                .map(item => `<li>${item}</li>`)
                .join('');
            return `
                <div class="schedule-guideline-card">
                    <h4>${section.title}</h4>
                    <ul>${items}</ul>
                </div>
            `;
        })
        .join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const scheduleType = document.getElementById('scheduleType');
    const savedType = localStorage.getItem('scheduleType');

    if (savedType && scheduleData[savedType]) {
        scheduleType.value = savedType;
    }

    scheduleType.addEventListener('change', () => {
        localStorage.setItem('scheduleType', scheduleType.value);
        updateScheduleUI();
    });

    updateScheduleUI();
    setInterval(updateScheduleUI, 60000);
});
