/* ============================================================
   SCMS — CHART.JS ANALYTICS (charts.js)
   Attendance, fees, results, enrollment charts
   ============================================================ */

const CHART_DEFAULTS = {
  font: { family: 'Inter, sans-serif', size: 12 },
  color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a8a9a',
};

function getThemeColor() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? '#f0f0f5' : '#0a0a0a';
}
function getMutedColor() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? '#606070' : '#d0d0d8';
}

function baseOptions(title = '') {
  const tc = getThemeColor();
  const mc = getMutedColor();
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: tc, font: { family: 'Inter', size: 11 }, boxWidth: 12 } },
      title:  { display: !!title, text: title, color: tc, font: { family: 'Space Grotesk', size: 13, weight: 600 } },
      tooltip: { backgroundColor: tc, titleColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0a0a0a':'#fff',
                 bodyColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0a0a0a':'#fff',
                 borderWidth: 0, cornerRadius: 8, padding: 10 }
    },
    scales: {
      x: { ticks: { color: tc, font: { size: 11 } }, grid: { color: mc } },
      y: { ticks: { color: tc, font: { size: 11 } }, grid: { color: mc } }
    }
  };
}

/* ─── Attendance Bar Chart ─── */
function renderAttendanceChart(canvasId, labels, presentArr, absentArr) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const tc = getThemeColor();
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Present', data: presentArr, backgroundColor: tc, borderRadius: 4 },
        { label: 'Absent',  data: absentArr,  backgroundColor: getMutedColor(), borderRadius: 4 }
      ]
    },
    options: { ...baseOptions('Monthly Attendance'), barPercentage: 0.7 }
  });
}

/* ─── Doughnut Chart ─── */
function renderDoughnutChart(canvasId, labels, data, title = '') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const tc = getThemeColor();
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [tc, getMutedColor(), 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.1)'],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      ...baseOptions(title),
      cutout: '68%',
      scales: {}
    }
  });
}

/* ─── Line Chart ─── */
function renderLineChart(canvasId, labels, datasets, title = '') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const tc = getThemeColor();
  const styledDatasets = datasets.map((ds, i) => ({
    ...ds,
    borderColor:     i === 0 ? tc : getMutedColor(),
    backgroundColor: i === 0 ? tc + '18' : getMutedColor() + '18',
    tension: 0.4, pointRadius: 3, pointHoverRadius: 5,
    fill: true, borderWidth: 2,
  }));
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: styledDatasets },
    options: baseOptions(title)
  });
}

/* ─── Horizontal Bar Chart (rankings, top students) ─── */
function renderHBarChart(canvasId, labels, data, title = '') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const tc = getThemeColor();
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: title, data, backgroundColor: tc, borderRadius: 4 }]
    },
    options: { ...baseOptions(title), indexAxis: 'y', scales: { x: { grid: { color: getMutedColor() }, ticks: { color: tc } }, y: { grid: { color: 'transparent' }, ticks: { color: tc } } } }
  });
}

/* ─── Pie Chart ─── */
function renderPieChart(canvasId, labels, data, title = '') {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const tc = getThemeColor();
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#1a1a1a','#3a3a3a','#666','#999','#ccc'],
        borderWidth: 2,
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0a0a0a' : '#fff'
      }]
    },
    options: { ...baseOptions(title), scales: {} }
  });
}
