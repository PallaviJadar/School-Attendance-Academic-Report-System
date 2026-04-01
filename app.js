/* ============================================================
   Demo 2 — School Attendance & Academic Report System
   DevXign Solutions | app.js
   ============================================================ */

'use strict';

// ============================================================
// CONSTANTS & SAMPLE DATA
// ============================================================
const SCHOOL = {
    name: 'Vidya Bharathi Public School',
    trust: 'Sri Saraswathi Educational Trust',
    branch: 'Main Branch - Hyderabad',
    phone: '+91-40-23456789',
    email: 'info@vidyabharathi.edu.in'
};

const SUBJECTS = ['Telugu', 'Hindi', 'English', 'Maths', 'Science', 'Social'];
const MAX_MARKS = 100;

const STUDENTS = [
    { id: 'VB001', name: 'Aarav Sharma',   cls: '5',   section: 'A', guardian: 'Rajesh Sharma',   phone: '9876543210' },
    { id: 'VB002', name: 'Priya Reddy',    cls: '3',   section: 'B', guardian: 'Suresh Reddy',    phone: '9876543211' },
    { id: 'VB003', name: 'Arjun Patel',    cls: '7',   section: 'A', guardian: 'Mukesh Patel',    phone: '9876543212' },
    { id: 'VB004', name: 'Sneha Kumari',   cls: '10',  section: 'A', guardian: 'Vijay Kumari',    phone: '9876543213' },
    { id: 'VB005', name: 'Rohan Gupta',    cls: '1',   section: 'A', guardian: 'Amit Gupta',      phone: '9876543214' },
    { id: 'VB006', name: 'Ananya Singh',   cls: 'LKG', section: 'A', guardian: 'Pradeep Singh',   phone: '9876543215' },
    { id: 'VB007', name: 'Karthik Nair',   cls: '8',   section: 'B', guardian: 'Balakrishna Nair',phone: '9876543216' },
    { id: 'VB008', name: 'Meera Joshi',    cls: '5',   section: 'B', guardian: 'Ramesh Joshi',    phone: '9876543217' },
    { id: 'VB009', name: 'Rahul Verma',    cls: '9',   section: 'A', guardian: 'Sanjay Verma',    phone: '9876543218' },
    { id: 'VB010', name: 'Kavya Iyer',     cls: '2',   section: 'A', guardian: 'Krishnan Iyer',   phone: '9876543219' }
];

// Avatar colors per student index
const AVATAR_COLORS = [
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#06b6d4,#0284c7)',
    'linear-gradient(135deg,#ef4444,#b91c1c)',
    'linear-gradient(135deg,#ec4899,#be185d)',
    'linear-gradient(135deg,#14b8a6,#0f766e)',
    'linear-gradient(135deg,#f97316,#c2410c)',
    'linear-gradient(135deg,#84cc16,#4d7c0f)'
];

function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function getAvatarColor(idx) { return AVATAR_COLORS[idx % AVATAR_COLORS.length]; }

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================
const LS_KEYS = {
    attendance: 'att2_attendance',
    marks: 'att2_marks',
    setup: 'att2_setup'
};

let SCHOOL_DATA = loadLS(LS_KEYS.setup);
if (Object.keys(SCHOOL_DATA).length === 0) {
    SCHOOL_DATA = { ...SCHOOL };
}

function loadLS(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
}
function saveLS(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error(e); }
}

// attendance: { "2026-03-01": { "VB001": "P", "VB002": "A", ... } }
function getAttendance() { return loadLS(LS_KEYS.attendance); }
function saveAttendance(data) { saveLS(LS_KEYS.attendance, data); }

// marks: { "Unit Test 1_VB001": { Telugu:88, Hindi:76, ... } }
function getMarks() { return loadLS(LS_KEYS.marks); }
function saveMarks(data) { saveLS(LS_KEYS.marks, data); }

// ============================================================
// PRELOAD SAMPLE DATA
// ============================================================
function preloadSampleData() {
    const att = getAttendance();
    const marksData = getMarks();
    let changed = false;

    // --- Attendance for March 2026 ---
    // Working days in March 2026 (Mon-Sat, skip Sundays)
    const patterns = {
        // studentId: array of absent days (1-indexed)
        'VB001': [5, 15],
        'VB002': [3, 12, 20, 25],
        'VB003': [8],
        'VB004': [2, 18, 26],
        'VB005': [7, 14, 21],
        'VB006': [10, 17, 24],
        'VB007': [4],
        'VB008': [6, 22],
        'VB009': [11, 19, 27],
        'VB010': [13, 28]
    };

    for (let day = 1; day <= 31; day++) {
        const dt = new Date(2026, 2, day); // March = index 2
        if (dt.getMonth() !== 2) continue; // overflow
        if (dt.getDay() === 0) continue;   // Skip Sundays
        const dateStr = formatDate(dt);
        if (!att[dateStr]) {
            att[dateStr] = {};
            changed = true;
            STUDENTS.forEach(s => {
                const isAbsent = (patterns[s.id] || []).includes(day);
                att[dateStr][s.id] = isAbsent ? 'A' : 'P';
            });
        }
    }

    // --- Marks for Unit Test 1 ---
    const ut1Marks = {
        'VB001': [88, 82, 91, 95, 87, 84],
        'VB002': [72, 68, 75, 70, 65, 71],
        'VB003': [95, 91, 97, 98, 94, 93],
        'VB004': [85, 88, 92, 89, 90, 87],
        'VB005': [55, 60, 58, 62, 54, 57],
        'VB006': [78, 74, 80, 76, 72, 79],
        'VB007': [90, 93, 88, 96, 91, 89],
        'VB008': [65, 70, 68, 73, 67, 66],
        'VB009': [82, 79, 85, 88, 83, 81],
        'VB010': [48, 52, 50, 55, 47, 51]
    };

    STUDENTS.forEach(s => {
        const key = `Unit Test 1_${s.id}`;
        if (!marksData[key]) {
            marksData[key] = {};
            SUBJECTS.forEach((sub, i) => {
                marksData[key][sub] = ut1Marks[s.id][i];
            });
            changed = true;
        }
    });

    if (changed) {
        saveAttendance(att);
        saveMarks(marksData);
    }
}

// ============================================================
// DATE UTILITIES
// ============================================================
function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function todayStr() { return formatDate(new Date()); }

function getDaysInMonth(year, month) {
    // month is 1-indexed
    return new Date(year, month, 0).getDate();
}

function isWorkingDay(date) {
    return date.getDay() !== 0; // Skip Sundays
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(msg, type = 'success') {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <span class="toast-msg">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 350);
    }, 3200);
}

// ============================================================
// NAVIGATION
// ============================================================
const pages = ['dashboard', 'attendance', 'register', 'marks', 'reportcards', 'setup'];
const pageTitles = {
    dashboard: 'Dashboard',
    attendance: 'Mark Attendance',
    register: 'Attendance Register',
    marks: 'Academic Marks',
    reportcards: 'Report Cards',
    setup: 'School Setup'
};

function navigateTo(pageId) {
    pages.forEach(p => {
        document.getElementById(`page-${p}`).classList.remove('active');
        document.getElementById(`nav-${p}`)?.classList.remove('active');
    });
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.getElementById(`nav-${pageId}`)?.classList.add('active');
    document.getElementById('currentPageTitle').textContent = pageTitles[pageId];
    if (pageId === 'dashboard') renderDashboard();
    if (pageId === 'reportcards') populateReportCardStudents();
    if (pageId === 'setup') loadSetupForm();
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
    const today = todayStr();
    const att = getAttendance();
    const todayAtt = att[today] || {};

    const totalStudents = STUDENTS.length;
    let presentToday = 0, absentToday = 0;
    STUDENTS.forEach(s => {
        if (todayAtt[s.id] === 'P') presentToday++;
        else if (todayAtt[s.id] === 'A') absentToday++;
    });

    const markedToday = presentToday + absentToday;
    const presentPct = markedToday > 0 ? Math.round((presentToday / markedToday) * 100) : 0;

    // Calculate monthly average attendance (March 2026 data)
    const avgAtt = calcAverageAttendance();

    // Stats update
    document.getElementById('stat-total-students').textContent = totalStudents;
    document.getElementById('stat-present-today').textContent = markedToday > 0 ? `${presentPct}%` : 'N/A';
    document.getElementById('stat-present-count').textContent = `${presentToday} students`;
    document.getElementById('stat-absent-today').textContent = absentToday;
    document.getElementById('stat-absent-count').textContent = markedToday > 0 ? `${markedToday - presentToday} absent` : 'Not marked';
    document.getElementById('stat-avg-attendance').textContent = `${avgAtt}%`;

    // Dashboard date
    const now = new Date();
    document.getElementById('dashboardTodayDate').textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    // Draw trend chart
    drawTrendChart();
    renderTopAttenders();
    renderClassBars(todayAtt);
}

function calcAverageAttendance() {
    const att = getAttendance();
    const dates = Object.keys(att);
    if (dates.length === 0) return 0;
    let totalP = 0, totalCount = 0;
    dates.forEach(d => {
        STUDENTS.forEach(s => {
            if (att[d][s.id] === 'P') totalP++;
            if (att[d][s.id]) totalCount++;
        });
    });
    return totalCount > 0 ? Math.round((totalP / totalCount) * 100) : 0;
}

function drawTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const att = getAttendance();

    // Get last 7 working days
    const days = [];
    const d = new Date(2026, 2, 31); // End of March 2026
    while (days.length < 7) {
        if (isWorkingDay(d) && att[formatDate(d)]) {
            days.unshift({ date: formatDate(d), label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
        }
        d.setDate(d.getDate() - 1);
        if (d < new Date(2026, 2, 1)) break;
    }

    const data = days.map(day => {
        const dayAtt = att[day.date] || {};
        let p = 0, count = 0;
        STUDENTS.forEach(s => { if (dayAtt[s.id] === 'P') p++; if (dayAtt[s.id]) count++; });
        return count > 0 ? Math.round((p / count) * 100) : 0;
    });

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.parentElement.clientWidth || 500;
    const H = 220;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const pad = { top: 20, right: 20, bottom: 40, left: 44 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const barW = Math.min(36, (chartW / Math.max(days.length, 1)) - 10);

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i;
        const val = 100 - i * 25;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 1;
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + chartW, y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(148,163,184,0.7)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val + '%', pad.left - 6, y + 4);
    }
    ctx.setLineDash([]);

    // Bars & Line points
    const points = [];
    days.forEach((day, i) => {
        const x = pad.left + (chartW / (Math.max(days.length, 1))) * i + chartW / (Math.max(days.length, 1)) / 2;
        const barH = (data[i] / 100) * chartH;
        const y = pad.top + chartH - barH;

        // Gradient bar
        const grad = ctx.createLinearGradient(0, y, 0, pad.top + chartH);
        grad.addColorStop(0, 'rgba(16,185,129,0.9)');
        grad.addColorStop(1, 'rgba(16,185,129,0.15)');
        ctx.beginPath();
        ctx.fillStyle = grad;
        const r = 5;
        const bx = x - barW / 2, by = y, bw = barW, bh = barH;
        if (ctx.roundRect) {
            ctx.roundRect(bx, by, bw, bh, [r, r, 0, 0]);
        } else {
            ctx.moveTo(bx + r, by);
            ctx.lineTo(bx + bw - r, by);
            ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
            ctx.lineTo(bx + bw, by + bh);
            ctx.lineTo(bx, by + bh);
            ctx.lineTo(bx, by + r);
            ctx.quadraticCurveTo(bx, by, bx + r, by);
            ctx.closePath();
        }
        ctx.fill();

        points.push({ x, y });

        // Day label
        ctx.fillStyle = 'rgba(148,163,184,0.8)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(day.label, x, H - 6);
    });

    // Line
    if (points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(245,158,11,0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Dots on line
    points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data[i] + '%', p.x, p.y - 10);
    });
}

function renderTopAttenders() {
    const att = getAttendance();
    const dates = Object.keys(att);
    const studentPct = STUDENTS.map((s, idx) => {
        let p = 0, c = 0;
        dates.forEach(d => { if (att[d][s.id] === 'P') p++; if (att[d][s.id]) c++; });
        const pct = c > 0 ? Math.round((p / c) * 100) : 0;
        return { ...s, pct, idx };
    }).sort((a, b) => b.pct - a.pct).slice(0, 5);

    const rankClasses = ['rank-1', 'rank-2', 'rank-3', 'rank-4', 'rank-5'];
    const html = studentPct.map((s, r) => `
        <div class="attender-item">
            <div class="attender-rank ${rankClasses[r]}">${r + 1}</div>
            <div class="attender-avatar" style="background:${getAvatarColor(s.idx)}">${getInitials(s.name)}</div>
            <div class="attender-info">
                <div class="attender-name">${s.name}</div>
                <div class="attender-class">Class ${s.cls}-${s.section}</div>
            </div>
            <div class="attender-pct">${s.pct}%</div>
        </div>`).join('');

    document.getElementById('topAttendersList').innerHTML = html;
}

function renderClassBars(todayAtt) {
    // Group students by class
    const classes = {};
    STUDENTS.forEach(s => {
        const key = `Class ${s.cls}`;
        if (!classes[key]) classes[key] = { p: 0, total: 0 };
        classes[key].total++;
        if (todayAtt[s.id] === 'P') classes[key].p++;
    });

    const container = document.getElementById('classBarsContainer');
    if (!container) return;
    const html = Object.entries(classes).map(([cls, data]) => {
        const marked = Object.values(todayAtt).length > 0;
        const pct = marked && data.total > 0 ? Math.round((data.p / data.total) * 100) : 0;
        const colorClass = pct >= 90 ? '' : pct >= 70 ? 'amber' : 'red';
        return `
            <div class="class-bar-item">
                <div class="class-bar-label">
                    <span>${cls}</span>
                    <span>${marked ? pct + '%' : 'N/A'}</span>
                </div>
                <div class="class-bar-track">
                    <div class="class-bar-fill ${colorClass}" style="width:${pct}%"></div>
                </div>
            </div>`;
    }).join('');
    container.innerHTML = html;
}

// ============================================================
// MARK ATTENDANCE
// ============================================================
let currentAttendanceMap = {}; // studentId -> 'P' | 'A'
let currentAttStudents = [];

function initAttendancePage() {
    const dateInput = document.getElementById('attendanceDate');
    dateInput.value = todayStr();

    document.getElementById('loadAttendanceBtn').addEventListener('click', loadAttendanceStudents);
    document.getElementById('markAllPresentBtn').addEventListener('click', () => markAll('P'));
    document.getElementById('markAllAbsentBtn').addEventListener('click', () => markAll('A'));
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendanceData);
}

function loadAttendanceStudents() {
    const date = document.getElementById('attendanceDate').value;
    const cls = document.getElementById('attendanceClass').value;
    const sec = document.getElementById('attendanceSection').value;

    if (!date) { showToast('Please select a date', 'warning'); return; }

    const att = getAttendance();
    const dayAtt = att[date] || {};

    currentAttStudents = STUDENTS.filter(s => {
        const clsMatch = !cls || s.cls === cls;
        const secMatch = !sec || s.section === sec;
        return clsMatch && secMatch;
    });

    if (currentAttStudents.length === 0) {
        showToast('No students found for selected filters', 'warning');
        return;
    }

    // Initialize attendance map
    currentAttendanceMap = {};
    currentAttStudents.forEach(s => {
        currentAttendanceMap[s.id] = dayAtt[s.id] || 'P';
    });

    renderAttendanceCards();
    updateAttendanceCounts();
    document.getElementById('saveAttendanceBar').style.display = 'flex';
    document.getElementById('saveBarText').textContent = `${currentAttStudents.length} students loaded — ${date}`;
}

function renderAttendanceCards() {
    const grid = document.getElementById('attendanceStudentList');
    grid.innerHTML = currentAttStudents.map((s, i) => {
        const status = currentAttendanceMap[s.id];
        const isPresent = status === 'P';
        return `
        <div class="student-att-card ${isPresent ? 'present' : 'absent'}" id="att-card-${s.id}">
            <div class="student-initials-avatar" style="background:${getAvatarColor(STUDENTS.indexOf(s))}">${getInitials(s.name)}</div>
            <div class="att-student-info">
                <div class="att-student-name">${s.name}</div>
                <div class="att-student-class">Class ${s.cls}-${s.section} · ${s.id}</div>
            </div>
            <div style="text-align:center">
                <button class="att-toggle-btn ${isPresent ? 'present-btn' : 'absent-btn'}" data-id="${s.id}" title="Toggle attendance"></button>
                <div class="att-status-label ${isPresent ? 'present-label' : 'absent-label'}" id="att-lbl-${s.id}">${isPresent ? '✅ Present' : '❌ Absent'}</div>
            </div>
        </div>`;
    }).join('');

    // Bind toggle buttons
    grid.querySelectorAll('.att-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleStudentAttendance(btn.dataset.id));
    });
}

function toggleStudentAttendance(studentId) {
    currentAttendanceMap[studentId] = currentAttendanceMap[studentId] === 'P' ? 'A' : 'P';
    const isPresent = currentAttendanceMap[studentId] === 'P';
    const card = document.getElementById(`att-card-${studentId}`);
    const btn = card.querySelector('.att-toggle-btn');
    const lbl = document.getElementById(`att-lbl-${studentId}`);

    card.className = `student-att-card ${isPresent ? 'present' : 'absent'}`;
    btn.className = `att-toggle-btn ${isPresent ? 'present-btn' : 'absent-btn'}`;
    lbl.className = `att-status-label ${isPresent ? 'present-label' : 'absent-label'}`;
    lbl.textContent = isPresent ? '✅ Present' : '❌ Absent';

    updateAttendanceCounts();
}

function markAll(status) {
    if (currentAttStudents.length === 0) { showToast('Load students first', 'warning'); return; }
    
    if (status === 'A') {
        showConfirm('Confirm Bulk action', 'Are you sure you want to mark ALL students as ABSENT?', () => {
            applyMarkAll(status);
        });
    } else {
        applyMarkAll(status);
    }
}

function applyMarkAll(status) {
    currentAttStudents.forEach(s => { currentAttendanceMap[s.id] = status; });
    renderAttendanceCards();
    updateAttendanceCounts();
    showToast(`All students marked ${status === 'P' ? 'Present ✅' : 'Absent ❌'}`, status === 'P' ? 'success' : 'info');
}

function updateAttendanceCounts() {
    let p = 0, a = 0;
    Object.values(currentAttendanceMap).forEach(v => { if (v === 'P') p++; else a++; });
    document.getElementById('miniPresentCount').textContent = p;
    document.getElementById('miniAbsentCount').textContent = a;
}

function saveAttendanceData() {
    const date = document.getElementById('attendanceDate').value;
    if (!date) { showToast('No date selected', 'error'); return; }
    const att = getAttendance();
    if (!att[date]) att[date] = {};
    Object.assign(att[date], currentAttendanceMap);
    saveAttendance(att);
    showToast(`Attendance saved for ${date} ✅`, 'success');
}

// ============================================================
// ATTENDANCE REGISTER
// ============================================================
function initRegisterPage() {
    document.getElementById('loadRegisterBtn').addEventListener('click', loadRegister);
    document.getElementById('exportRegisterCSVBtn').addEventListener('click', exportRegisterCSV);
    // Register is loaded on demand when user clicks the button or navigates to the page
}

function loadRegister() {
    const month = parseInt(document.getElementById('registerMonth').value);
    const year = parseInt(document.getElementById('registerYear').value);
    const cls = document.getElementById('registerClass').value;
    const sec = document.getElementById('registerSection').value;

    const filtered = STUDENTS.filter(s => {
        return (!cls || s.cls === cls) && (!sec || s.section === sec);
    });

    if (filtered.length === 0) {
        document.getElementById('registerTableWrapper').innerHTML = `
            <div class="empty-state"><div class="empty-icon"><i class="fas fa-table"></i></div>
            <h3>No Students Found</h3><p>Adjust your filters</p></div>`;
        return;
    }

    const att = getAttendance();
    const daysInMonth = getDaysInMonth(year, month);

    // Collect working days in this month
    const workingDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month - 1, d);
        if (isWorkingDay(dt)) workingDays.push(d);
    }

    // Build header
    const monthName = new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long' });
    let html = `<table class="register-table">
    <thead>
    <tr>
        <th class="th-name">Student</th>
        ${workingDays.map(d => `<th title="${d} ${monthName}">${d}</th>`).join('')}
        <th class="th-stat">P</th><th class="th-stat">A</th><th class="th-stat">%</th>
    </tr>
    </thead>
    <tbody>`;

    filtered.forEach((s, idx) => {
        let present = 0, absent = 0;
        const cells = workingDays.map(d => {
            const dt = new Date(year, month - 1, d);
            const dateStr = formatDate(dt);
            const status = att[dateStr]?.[s.id];
            if (status === 'P') { present++; return `<td><span class="att-cell-P">P</span></td>`; }
            if (status === 'A') { absent++; return `<td><span class="att-cell-A">A</span></td>`; }
            return `<td><span class="att-cell-empty">-</span></td>`;
        }).join('');

        const total = present + absent;
        const pct = total > 0 ? Math.round((present / total) * 100) : 0;
        const pctClass = pct >= 90 ? 'register-pct-high' : pct >= 75 ? 'register-pct-mid' : 'register-pct-low';
        html += `<tr>
            <td class="td-name">
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:white;flex-shrink:0;background:${getAvatarColor(idx)}">${getInitials(s.name)}</div>
                    <div>
                        <div>${s.name}</div>
                        <div style="font-size:0.65rem;color:var(--text-muted);font-weight:400;">Cls ${s.cls}-${s.section}</div>
                    </div>
                </div>
            </td>
            ${cells}
            <td class="register-pct-cell" style="color:var(--emerald)">${present}</td>
            <td class="register-pct-cell" style="color:var(--red)">${absent}</td>
            <td class="register-pct-cell ${pctClass}">${pct}%</td>
        </tr>`;
    });

    html += '</tbody></table>';
    document.getElementById('registerTableWrapper').innerHTML = html;
    showToast(`Register loaded for ${monthName} ${year}`, 'info');
}

function exportRegisterCSV() {
    const month = parseInt(document.getElementById('registerMonth').value);
    const year = parseInt(document.getElementById('registerYear').value);
    const cls = document.getElementById('registerClass').value;
    const sec = document.getElementById('registerSection').value;
    const filtered = STUDENTS.filter(s => (!cls || s.cls === cls) && (!sec || s.section === sec));
    const att = getAttendance();
    const daysInMonth = getDaysInMonth(year, month);
    const workingDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
        if (isWorkingDay(new Date(year, month - 1, d))) workingDays.push(d);
    }

    const monthName = new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long' });
    let csv = `${SCHOOL.name} - Attendance Register - ${monthName} ${year}\n`;
    csv += `Student ID,Student Name,Class,Section,${workingDays.join(',')},Total Present,Total Absent,Percentage\n`;

    filtered.forEach(s => {
        let p = 0, a = 0;
        const row = workingDays.map(d => {
            const dt = new Date(year, month - 1, d);
            const status = att[formatDate(dt)]?.[s.id];
            if (status === 'P') { p++; return 'P'; }
            if (status === 'A') { a++; return 'A'; }
            return '-';
        });
        const total = p + a;
        const pct = total > 0 ? Math.round((p / total) * 100) + '%' : 'N/A';
        csv += `${s.id},${s.name},${s.cls},${s.section},${row.join(',')},${p},${a},${pct}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `attendance_${monthName}_${year}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('Register exported to CSV ✅', 'success');
}

// ============================================================
// ACADEMIC MARKS
// ============================================================
function initMarksPage() {
    document.getElementById('loadMarksBtn').addEventListener('click', loadMarksTable);
}

function loadMarksTable() {
    const cls = document.getElementById('marksClass').value;
    const sec = document.getElementById('marksSection').value;
    const exam = document.getElementById('marksExamType').value;

    if (!cls) { showToast('Please select a class', 'warning'); return; }
    if (!exam) { showToast('Please select an exam type', 'warning'); return; }

    const filtered = STUDENTS.filter(s => (!cls || s.cls === cls) && (!sec || s.section === sec));
    if (filtered.length === 0) {
        showToast('No students found for selected class', 'warning');
        return;
    }

    const marksData = getMarks();
    const container = document.getElementById('marksTableContainer');

    let html = `
    <div class="marks-table-card">
        <div class="marks-table-header">
            <h3><i class="fas fa-pen-to-square"></i> ${exam} — Class ${cls}${sec ? '-' + sec : ''}</h3>
            <div style="display:flex;gap:10px">
                <span style="font-size:0.78rem;color:var(--text-muted)">Max Marks: <strong style="color:var(--text-primary)">${MAX_MARKS}</strong> per subject</span>
            </div>
        </div>
        <div class="marks-table-wrapper">
        <table class="marks-table">
        <thead>
        <tr>
            <th class="th-student-name">Student</th>
            ${SUBJECTS.map(s => `<th>${s}</th>`).join('')}
            <th class="th-grade">Total</th>
            <th class="th-grade">%</th>
            <th class="th-grade">Grade</th>
        </tr>
        </thead>
        <tbody>`;

    filtered.forEach((s, idx) => {
        const key = `${exam}_${s.id}`;
        const sm = marksData[key] || {};
        html += `<tr data-student="${s.id}">
            <td class="td-student-name">
                <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:white;background:${getAvatarColor(STUDENTS.indexOf(s))};flex-shrink:0">${getInitials(s.name)}</div>
                    <div>
                        <div style="font-weight:600">${s.name}</div>
                        <div style="font-size:0.65rem;color:var(--text-muted)">${s.id}</div>
                    </div>
                </div>
            </td>
            ${SUBJECTS.map(sub => `<td><input type="number" class="marks-input" min="0" max="${MAX_MARKS}" value="${sm[sub] !== undefined ? sm[sub] : ''}" data-student="${s.id}" data-subject="${sub}" placeholder="-"></td>`).join('')}
            <td class="marks-total-cell" id="total-${s.id}">-</td>
            <td class="marks-pct-cell" id="pct-${s.id}">-</td>
            <td id="grade-${s.id}">-</td>
        </tr>`;
    });

    html += `</tbody></table></div>
    <div class="marks-save-row">
        <button class="btn btn-outline btn-sm" id="clearMarksBtn"><i class="fas fa-eraser"></i> Clear All</button>
        <button class="btn btn-primary" id="saveMarksBtn"><i class="fas fa-save"></i> Save Marks</button>
    </div>
    </div>`;

    container.innerHTML = html;

    // Compute initial totals
    filtered.forEach(s => computeMarkTotals(s.id));

    // Bind input events
    container.querySelectorAll('.marks-input').forEach(inp => {
        inp.addEventListener('input', () => computeMarkTotals(inp.dataset.student));
    });

    document.getElementById('saveMarksBtn').addEventListener('click', () => saveMarksData(exam, filtered));
    document.getElementById('clearMarksBtn').addEventListener('click', () => {
        showConfirm('Clear All Marks', 'Are you sure you want to clear all entered marks for this table?', () => {
            clearMarks(filtered);
        });
    });
    showToast(`Marks table loaded for ${exam} — Class ${cls}`, 'info');
}

function computeMarkTotals(studentId) {
    const inputs = document.querySelectorAll(`.marks-input[data-student="${studentId}"]`);
    let total = 0, count = 0;
    inputs.forEach(inp => {
        const v = parseFloat(inp.value);
        if (!isNaN(v)) { total += v; count++; }
    });
    const totalCell = document.getElementById(`total-${studentId}`);
    const pctCell = document.getElementById(`pct-${studentId}`);
    const gradeCell = document.getElementById(`grade-${studentId}`);
    if (!totalCell) return;

    if (count === SUBJECTS.length) {
        const maxTotal = MAX_MARKS * SUBJECTS.length;
        const pct = Math.round((total / maxTotal) * 100);
        const { grade, cls } = getGrade(pct);
        totalCell.textContent = `${total}/${maxTotal}`;
        pctCell.textContent = `${pct}%`;
        pctCell.style.color = pct >= 90 ? 'var(--emerald)' : pct >= 60 ? 'var(--amber)' : 'var(--red)';
        gradeCell.innerHTML = `<span class="grade-badge ${cls}">${grade}</span>`;
    } else {
        totalCell.textContent = '-';
        pctCell.textContent = '-';
        gradeCell.innerHTML = '-';
    }
}

function getGrade(pct) {
    if (pct >= 90) return { grade: 'A+', cls: 'grade-A-plus' };
    if (pct >= 80) return { grade: 'A',  cls: 'grade-A' };
    if (pct >= 70) return { grade: 'B+', cls: 'grade-B-plus' };
    if (pct >= 60) return { grade: 'B',  cls: 'grade-B' };
    if (pct >= 50) return { grade: 'C',  cls: 'grade-C' };
    return { grade: 'F', cls: 'grade-F' };
}

function saveMarksData(exam, students) {
    const marksData = getMarks();
    let saved = 0;
    students.forEach(s => {
        const key = `${exam}_${s.id}`;
        marksData[key] = {};
        SUBJECTS.forEach(sub => {
            const inp = document.querySelector(`.marks-input[data-student="${s.id}"][data-subject="${sub}"]`);
            if (inp && inp.value !== '') marksData[key][sub] = parseFloat(inp.value) || 0;
        });
        saved++;
    });
    saveMarks(marksData);
    showToast(`Marks saved for ${saved} students in ${exam} ✅`, 'success');
}

function clearMarks(students) {
    students.forEach(s => {
        document.querySelectorAll(`.marks-input[data-student="${s.id}"]`).forEach(inp => { inp.value = ''; });
        computeMarkTotals(s.id);
    });
    showToast('All marks cleared', 'info');
}

// ============================================================
// REPORT CARDS
// ============================================================
function populateReportCardStudents() {
    const sel = document.getElementById('reportCardStudent');
    const current = sel.value;
    sel.innerHTML = '<option value="">-- Select Student --</option>';
    STUDENTS.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} — Class ${s.cls}-${s.section} (${s.id})`;
        sel.appendChild(opt);
    });
    if (current) sel.value = current;
}

function initReportCardsPage() {
    document.getElementById('generateReportCardBtn').addEventListener('click', generateReportCard);
    document.getElementById('printReportCardBtn').addEventListener('click', () => window.print());
}

function generateReportCard() {
    const studentId = document.getElementById('reportCardStudent').value;
    const exam = document.getElementById('reportCardExam').value;

    if (!studentId) { showToast('Please select a student', 'warning'); return; }
    if (!exam) { showToast('Please select an exam type', 'warning'); return; }

    const student = STUDENTS.find(s => s.id === studentId);
    if (!student) { showToast('Student not found', 'error'); return; }

    const marksData = getMarks();
    const key = `${exam}_${studentId}`;
    const sm = marksData[key];

    const att = getAttendance();
    // Calculate attendance stats for all available dates
    let totalDays = 0, presentDays = 0;
    Object.values(att).forEach(dayAtt => {
        if (dayAtt[studentId] !== undefined) {
            totalDays++;
            if (dayAtt[studentId] === 'P') presentDays++;
        }
    });
    const absentDays = totalDays - presentDays;
    const attPct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Marks calculation
    let total = 0, validSubjects = 0;
    const subjectRows = SUBJECTS.map(sub => {
        const marks = sm?.[sub];
        if (marks !== undefined) { total += marks; validSubjects++; }
        const pct = marks !== undefined ? Math.round((marks / MAX_MARKS) * 100) : null;
        return { sub, marks, pct };
    });

    const allFilled = validSubjects === SUBJECTS.length;
    const totalMax = MAX_MARKS * SUBJECTS.length;
    const totalPct = allFilled ? Math.round((total / totalMax) * 100) : null;
    const { grade, cls: gradeClass } = totalPct !== null ? getGrade(totalPct) : { grade: 'N/A', cls: '' };

    // Rank among class (same class & section)
    const classmates = STUDENTS.filter(s => s.cls === student.cls && s.section === student.section);
    const classmateScores = classmates.map(s => {
        const sk = `${exam}_${s.id}`;
        const sm2 = marksData[sk];
        let t = 0, cnt = 0;
        SUBJECTS.forEach(sub => { if (sm2?.[sub] !== undefined) { t += sm2[sub]; cnt++; } });
        return { id: s.id, total: cnt === SUBJECTS.length ? t : -1 };
    }).sort((a, b) => b.total - a.total);
    const rank = classmateScores.findIndex(x => x.id === studentId) + 1;

    // Remarks
    const remarks = totalPct !== null
        ? (totalPct >= 90 ? 'Excellent performance! Keep it up.' :
           totalPct >= 80 ? 'Very good academic performance. Well done!' :
           totalPct >= 70 ? 'Good performance. Continue to work hard.' :
           totalPct >= 60 ? 'Satisfactory. Regular study and practice recommended.' :
           totalPct >= 50 ? 'Average performance. Needs improvement in some subjects.' :
           'Needs significant improvement. Please consult class teacher.')
        : 'Marks not recorded for this exam.';

    const container = document.getElementById('reportCardContainer');
    container.innerHTML = `
    <div class="report-card-wrapper">
    <div class="report-card" id="printableReportCard">
        <div class="rc-header">
            <div class="rc-trust-name">${SCHOOL_DATA.trust}</div>
            <div class="rc-school-name">${SCHOOL_DATA.name}</div>
            <div class="rc-branch">${SCHOOL_DATA.branch} &bull; ${SCHOOL_DATA.phone}</div>
        </div>
        <div class="rc-title-bar">Progress Report Card — ${exam} — Academic Year 2025-26</div>
        <div class="rc-body">
            <div class="rc-student-info">
                <div class="rc-info-row"><div class="rc-info-label">Student Name</div><div class="rc-info-value">${student.name}</div></div>
                <div class="rc-info-row"><div class="rc-info-label">Student ID</div><div class="rc-info-value">${student.id}</div></div>
                <div class="rc-info-row"><div class="rc-info-label">Class & Section</div><div class="rc-info-value">Class ${student.cls} — Section ${student.section}</div></div>
                <div class="rc-info-row"><div class="rc-info-label">Guardian Name</div><div class="rc-info-value">${student.guardian}</div></div>
                <div class="rc-info-row"><div class="rc-info-label">Exam</div><div class="rc-info-value">${exam}</div></div>
                <div class="rc-info-row"><div class="rc-info-label">Generated On</div><div class="rc-info-value">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
            </div>

            <div class="rc-marks-title">Academic Performance</div>
            <table class="rc-marks-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Marks Obtained</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${subjectRows.map(r => `
                    <tr>
                        <td>${r.sub}</td>
                        <td>${MAX_MARKS}</td>
                        <td>${r.marks !== undefined ? r.marks : 'N/A'}</td>
                        <td>${r.pct !== null ? r.pct + '%' : 'N/A'}</td>
                        <td>${r.pct !== null ? getGrade(r.pct).grade : 'N/A'}</td>
                    </tr>`).join('')}
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>${totalMax}</strong></td>
                        <td><strong>${allFilled ? total : 'N/A'}</strong></td>
                        <td><strong>${totalPct !== null ? totalPct + '%' : 'N/A'}</strong></td>
                        <td><strong>${grade}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div class="rc-summary">
                <div class="rc-summary-box result-box">
                    <div class="rc-summary-label">Overall Grade</div>
                    <div class="rc-summary-value">${grade}</div>
                    <div style="font-size:0.72rem;color:#059669;margin-top:4px">${totalPct !== null ? totalPct + '%' : 'N/A'}</div>
                </div>
                <div class="rc-summary-box attendance-box">
                    <div class="rc-summary-label">Attendance</div>
                    <div class="rc-summary-value">${attPct}%</div>
                    <div class="rc-att-details">
                        <div class="rc-att-item"><div class="rc-att-num">${totalDays}</div><div class="rc-att-lbl">Total</div></div>
                        <div class="rc-att-item"><div class="rc-att-num">${presentDays}</div><div class="rc-att-lbl">Present</div></div>
                        <div class="rc-att-item"><div class="rc-att-num">${absentDays}</div><div class="rc-att-lbl">Absent</div></div>
                        <div class="rc-att-item"><div class="rc-att-num">${attPct}%</div><div class="rc-att-lbl">Rate</div></div>
                    </div>
                </div>
                <div class="rc-summary-box rank-box">
                    <div class="rc-summary-label">Class Rank</div>
                    <div class="rc-summary-value">${rank > 0 ? '#' + rank : 'N/A'}</div>
                    <div style="font-size:0.72rem;color:#d97706;margin-top:4px">of ${classmates.length} students</div>
                </div>
            </div>

            <div class="rc-remarks">
                <div class="rc-remarks-title">📝 Teacher's Remarks</div>
                <div class="rc-remarks-text">${remarks}</div>
            </div>

            <div class="rc-footer">
                <div class="rc-sign-box"><div class="rc-sign-line"></div><div class="rc-sign-label">Class Teacher</div></div>
                <div class="rc-sign-box"><div class="rc-sign-line"></div><div class="rc-sign-label">Principal</div></div>
                <div class="rc-sign-box"><div class="rc-sign-line"></div><div class="rc-sign-label">Parent / Guardian</div></div>
            </div>
        </div>
        <div class="rc-watermark">
            This is a computer-generated report card. Powered by DevXign Solutions — School Management System
        </div>
    </div>
    </div>`;

    document.getElementById('printReportCardBtn').style.display = 'flex';
    showToast(`Report card generated for ${student.name} ✅`, 'success');
}

// ============================================================
// CONFIRM MODAL
// ============================================================
function showConfirm(title, message, onOk) {
    const overlay = document.getElementById('confirmModal');
    document.getElementById('confirmModalTitle').innerHTML = `<i class="fas fa-question-circle"></i> ${title}`;
    document.getElementById('confirmModalMessage').textContent = message;
    overlay.classList.add('active');

    const okBtn = document.getElementById('okConfirmBtn');
    const cancelBtn = document.getElementById('cancelConfirmBtn');
    const closeBtn = document.getElementById('closeConfirmModal');

    const close = () => overlay.classList.remove('active');
    const ok = () => { close(); onOk(); };

    okBtn.onclick = ok;
    cancelBtn.onclick = close;
    closeBtn.onclick = close;
    overlay.onclick = e => { if (e.target === overlay) close(); };
}

// ============================================================
// SIDEBAR TOGGLE
// ============================================================
function initSidebarToggle() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// ============================================================
// TOPBAR DATE & TIME
// ============================================================
function updateClock() {
    const now = new Date();
    const str = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const el = document.getElementById('currentDate');
    if (el) el.textContent = str;
}

// ============================================================
// SPLASH SCREEN
// ============================================================
function hideSplash() {
    const splash = document.getElementById('splashScreen');
    const app = document.getElementById('app');
    splash.classList.add('hiding');
    setTimeout(() => {
        splash.style.display = 'none';
        app.classList.remove('hidden');
        renderDashboard();
    }, 700);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Preload sample data
    preloadSampleData();

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const pageId = item.dataset.page;
            if (pageId) navigateTo(pageId);
        });
    });

    // Init page-specific handlers
    initAttendancePage();
    initRegisterPage();
    initMarksPage();
    initReportCardsPage();
    initSetupPage();
    updateInstitutionUI();
    populateReportCardStudents();
    initSidebarToggle();
    updateClock();
    setInterval(updateClock, 60000);

    // Window resize → redraw chart
    window.addEventListener('resize', () => {
        const dash = document.getElementById('page-dashboard');
        if (dash.classList.contains('active')) drawTrendChart();
    });

    // Splash
    setTimeout(hideSplash, 2400);
});

// ============================================================
// SETUP LOGIC
// ============================================================
function initSetupPage() {
    const form = document.getElementById('setupForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            trust: document.getElementById('setupTrustName').value,
            name: document.getElementById('setupSchoolName').value,
            branch: document.getElementById('setupBranchName').value,
            phone: document.getElementById('setupPhone').value,
            email: document.getElementById('setupEmail').value
        };
        SCHOOL_DATA = data;
        saveLS(LS_KEYS.setup, data);
        updateInstitutionUI();
        showToast('Institution details updated successfully! ✅', 'success');
    });
}

function loadSetupForm() {
    document.getElementById('setupTrustName').value = SCHOOL_DATA.trust || '';
    document.getElementById('setupSchoolName').value = SCHOOL_DATA.name || '';
    document.getElementById('setupBranchName').value = SCHOOL_DATA.branch || '';
    document.getElementById('setupPhone').value = SCHOOL_DATA.phone || '';
    document.getElementById('setupEmail').value = SCHOOL_DATA.email || '';
}

function updateInstitutionUI() {
    document.getElementById('sidebarSchoolName').textContent = SCHOOL_DATA.name;
    document.getElementById('sidebarBranch').textContent = SCHOOL_DATA.branch;
}
