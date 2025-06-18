// --- Matrix Rain Effect ---
(function matrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hue = 120;
    function draw() {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        ctx.font = fontSize + "px monospace";
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `hsl(${hue},80%,60%)`);
        gradient.addColorStop(1, `hsl(${hue+60},80%,40%)`);
        ctx.fillStyle = gradient;
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.98) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        hue = (hue + 1) % 360;
    }
    let interval = setInterval(draw, 50);
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
})();

// Parse and validate input as a list of integers
function parseNumbersInput() {
    const input = document.getElementById('numbers').value;
    if (!input.trim()) {
        displayResult('Please enter at least one number.', true);
        return null;
    }
    const nums = input.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(Number);
    if (nums.length < 1 || nums.some(n => !Number.isInteger(n))) {
        displayResult('Enter only integers, separated by commas.', true);
        return null;
    }
    return nums;
}

// Display result and add to history
function displayResult(message, isError = false, historyEntry = null) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.style.color = isError ? '#ff4d4d' : '#00cc00';
    resultDiv.style.opacity = 0;
    resultDiv.style.animation = 'fadeIn 0.5s forwards';
    if (!isError && historyEntry) addToHistory(historyEntry);
    addCopyButton();
    announceResult(message);
}

// Copy Result to Clipboard
function addCopyButton() {
    let resultDiv = document.getElementById('result');
    if (!document.getElementById('copy-result-btn')) {
        const btn = document.createElement('button');
        btn.id = 'copy-result-btn';
        btn.textContent = 'Copy';
        btn.onclick = function() {
            navigator.clipboard.writeText(resultDiv.textContent);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 1000);
        };
        resultDiv.parentNode.insertBefore(btn, resultDiv.nextSibling);
    }
}

// Persistent History
function saveHistory() {
    const list = document.getElementById('history-list');
    const entries = Array.from(list.children).map(li => li.textContent);
    localStorage.setItem('lcmgcd-history', JSON.stringify(entries));
}
function loadHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    const entries = JSON.parse(localStorage.getItem('lcmgcd-history') || '[]');
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        list.appendChild(li);
    });
}
function clearHistory() {
    localStorage.removeItem('lcmgcd-history');
    document.getElementById('history-list').innerHTML = '';
}

// Add Clear History Button
function addClearHistoryButton() {
    if (!document.getElementById('clear-history-btn')) {
        const btn = document.createElement('button');
        btn.id = 'clear-history-btn';
        btn.textContent = 'Clear History';
        btn.onclick = clearHistory;
        const container = document.getElementById('history-container');
        container.insertBefore(btn, container.querySelector('ul'));
    }
}

// Accessibility: Announce result
function announceResult(message) {
    let live = document.getElementById('result-live');
    if (!live) {
        live = document.createElement('div');
        live.id = 'result-live';
        live.setAttribute('aria-live', 'assertive');
        live.style.position = 'absolute';
        live.style.left = '-9999px';
        document.body.appendChild(live);
    }
    live.textContent = message;
}

// Add entry to result history
function addToHistory(entry) {
    const list = document.getElementById('history-list');
    if (!list) return;
    const li = document.createElement('li');
    li.textContent = entry;
    list.insertBefore(li, list.firstChild);
    while (list.children.length > 10) list.removeChild(list.lastChild);
    saveHistory();
}

// Show prime factors
function showPrimeFactors(factors) {
    const div = document.getElementById('prime-factors');
    if (!factors) {
        div.textContent = '';
        return;
    }
    div.innerHTML = '<b>Prime Factors:</b><br>' +
        Object.entries(factors)
            .map(([n, pf]) => `${n}: ${pf.join(' × ')}`)
            .join('<br>');
}

// Show step-by-step explanation
function showExplanation(steps) {
    const div = document.getElementById('explanation');
    if (!steps) {
        div.textContent = '';
        return;
    }
    div.innerHTML = '<b>Steps:</b><br>' + steps.map(s => `<div>${s}</div>`).join('');
}

// Draw chart
let chartInstance = null;
function drawChart(type, numbers, chartData) {
    const ctx = document.getElementById('chart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    if (!chartData || !Array.isArray(chartData.labels)) {
        ctx.clearRect(0, 0, 400, 120);
        return;
    }
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: chartData.datasets
        },
        options: {
            plugins: { legend: { display: true } },
            responsive: true,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

// Export as text
function exportAsText() {
    let txt = document.getElementById('result').textContent + '\n';
    txt += document.getElementById('prime-factors').textContent + '\n';
    txt += document.getElementById('explanation').textContent + '\n';
    const blob = new Blob([txt], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lcm_gcd_result.txt';
    a.click();
}

// Export as PDF
function exportAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    doc.text(document.getElementById('result').textContent, 10, y);
    y += 10;
    doc.text(document.getElementById('prime-factors').textContent, 10, y);
    y += 10;
    doc.text(document.getElementById('explanation').textContent, 10, y);
    doc.save('lcm_gcd_result.pdf');
}

// Voice input
let recognition = null;
document.getElementById('voice-btn').addEventListener('click', function() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice input not supported in this browser.');
        return;
    }
    if (!recognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('numbers').value = transcript.replace(/[^0-9,-]/g, '');
            document.getElementById('voice-btn').classList.remove('active');
            showNumberTypes(parseNumbersInput());
            document.getElementById('numbers').dispatchEvent(new Event('input'));
        };
        recognition.onerror = function() {
            document.getElementById('voice-btn').classList.remove('active');
        };
        recognition.onend = function() {
            document.getElementById('voice-btn').classList.remove('active');
        };
    }
    document.getElementById('voice-btn').classList.add('active');
    recognition.start();
});

// Detect and display number types
function showNumberTypes(nums) {
    if (!nums || !nums.length) {
        document.getElementById('number-types').textContent = '';
        return;
    }
    const types = nums.map(n => {
        let t = [];
        let abs_n = Math.abs(n);
        if (abs_n === 2) t.push('prime');
        else if (abs_n > 2 && isPrime(abs_n)) t.push('prime');
        t.push(abs_n % 2 === 0 ? 'even' : 'odd');
        return `${n}: <b>${t.join(', ')}</b>`;
    });
    document.getElementById('number-types').innerHTML = '<b>Number Types:</b><br>' + types.join('<br>');
}
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; ++i) if (n % i === 0) return false;
    return true;
}

// Call API
async function calculate(type, triggeredByUser = false) {
    const nums = parseNumbersInput();
    if (!nums) {
        showPrimeFactors(null);
        showExplanation(null);
        drawChart();
        return;
    }
    displayResult('Calculating...');
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numbers: nums })
        });
        const data = await response.json();
        if (response.ok) {
            const entry = `${type.toUpperCase()}(${nums.join(', ')}) = ${data.result}`;
            displayResult(`${type.toUpperCase()}: ${data.result}`, false, triggeredByUser ? entry : null);
            showPrimeFactors(data.prime_factors);
            showExplanation(data.steps);
            drawChart(type, nums, data.chart);
        } else {
            displayResult(data.error || 'An error occurred.', true);
            showPrimeFactors(null);
            showExplanation(null);
            drawChart();
        }
    } catch (err) {
        displayResult('Could not connect to server.', true);
        showPrimeFactors(null);
        showExplanation(null);
        drawChart();
    }
}

// Ripple effect for buttons
function addRippleEffect(e) {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();
    circle.classList.add('ripple');
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    button.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
}

// Clear form
function clearAll() {
    document.getElementById('numbers').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('result').style.opacity = 0;
    showPrimeFactors(null);
    showExplanation(null);
    drawChart();
}

// Theme toggle
function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}
document.getElementById('theme-toggle').addEventListener('change', (e) => {
    setTheme(e.target.checked);
});
window.addEventListener('DOMContentLoaded', () => {
    setTheme(localStorage.getItem('theme') === 'dark');
    document.getElementById('theme-toggle').checked = document.body.classList.contains('dark');
});

// Device toggle
const container = document.querySelector('.container');
const deviceToggleBtn = document.getElementById('device-toggle-btn');
container.classList.add('mobile-mode');
deviceToggleBtn.addEventListener('click', () => {
    if (container.classList.contains('mobile-mode')) {
        container.classList.remove('mobile-mode');
        container.classList.add('fullscreen-mode');
        deviceToggleBtn.textContent = 'Mobile View';
    } else {
        container.classList.remove('fullscreen-mode');
        container.classList.add('mobile-mode');
        deviceToggleBtn.textContent = 'PC View';
    }
});

// Event listeners
document.getElementById('gcd-btn').addEventListener('click', (e) => {
    addRippleEffect(e);
    calculate('gcd', true);
});
document.getElementById('lcm-btn').addEventListener('click', (e) => {
    addRippleEffect(e);
    calculate('lcm', true);
});
document.getElementById('clear-btn').addEventListener('click', (e) => {
    addRippleEffect(e);
    clearAll();
});

// Real-time calculation
let debounceTimer = null;
document.getElementById('numbers').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const nums = parseNumbersInput();
    showNumberTypes(nums);
    debounceTimer = setTimeout(() => {
        calculate('gcd');
        calculate('lcm');
    }, 500);
});

// Keyboard shortcuts
document.getElementById('numbers').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculate('lcm', true);
    } else if (e.key === 'Escape') {
        clearAll();
    }
});

// Export buttons
document.getElementById('export-txt-btn').addEventListener('click', exportAsText);
document.getElementById('export-pdf-btn').addEventListener('click', exportAsPDF);

// On page load
window.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    addClearHistoryButton();
});