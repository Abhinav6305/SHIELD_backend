// ShieldScan - Popup Logic
document.addEventListener('DOMContentLoaded', async () => {
    const scoreValue = document.getElementById('score-value');
    const scoreRing = document.getElementById('score-ring');
    const integrityPct = document.getElementById('integrity-pct');
    const integrityBar = document.getElementById('integrity-bar');
    const aiPct = document.getElementById('ai-pct');
    const aiBar = document.getElementById('ai-bar');
    const ageBadge = document.getElementById('age-badge');
    const domainText = document.getElementById('domain-text');
    const issuesContainer = document.getElementById('issues-container');
    const appContainer = document.getElementById('app-container');
    const shieldIcon = document.getElementById('shield-icon');

    const CIRCUMFERENCE = 2 * Math.PI * 70;

    const themes = {
        excellent: { bg: 'linear-gradient(135deg, #022c22 0%, #050810 100%)', accent: '#10B981' },
        good: { bg: 'linear-gradient(135deg, #082f49 0%, #050810 100%)', accent: '#3B82F6' },
        fair: { bg: 'linear-gradient(135deg, #422006 0%, #050810 100%)', accent: '#F59E0B' },
        poor: { bg: 'linear-gradient(135deg, #450a0a 0%, #050810 100%)', accent: '#EF4444' },
        dangerous: { bg: 'linear-gradient(135deg, #450a0a 0%, #200000 100%)', accent: '#991B1B' }
    };

    function getTheme(score) {
        if (score >= 90) return themes.excellent;
        if (score >= 70) return themes.good;
        if (score >= 50) return themes.fair;
        if (score >= 30) return themes.poor;
        return themes.dangerous;
    }

    function setScore(score) {
        const theme = getTheme(score);
        const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
        
        gsap.to(scoreRing, {
            strokeDashoffset: offset,
            duration: 1,
            ease: "expo.out",
            color: theme.accent
        });

        let counter = { val: 0 };
        gsap.to(counter, {
            val: score,
            duration: 1,
            roundProps: "val",
            onUpdate: () => { scoreValue.innerText = counter.val; }
        });

        appContainer.style.background = theme.bg;
        shieldIcon.style.backgroundColor = theme.accent;

        if (score < 30) {
            appContainer.classList.add('shake-anim');
            setTimeout(() => appContainer.classList.remove('shake-anim'), 300);
        }
        if (score >= 95) triggerConfetti();
    }

    async function performScan() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const domain = tab ? new URL(tab.url).hostname : '---';
        domainText.innerText = domain;

        await new Promise(r => setTimeout(r, 600));

        let mockData = {
            score: 88,
            integrity: 92,
            ai: 14,
            age: 'All Ages',
            issues: [
                { title: 'Data Retention', type: 'Privacy' },
                { title: 'Scarcity Patterns', type: 'UX' }
            ]
        };

        if (domain.includes('github') || domain.includes('google')) {
            mockData.score = 97;
            mockData.integrity = 98;
            mockData.issues = [];
        }

        setScore(mockData.score);
        gsap.to(integrityBar, { width: `${mockData.integrity}%`, duration: 0.8 });
        gsap.to(aiBar, { width: `${mockData.ai}%`, duration: 0.8 });

        integrityPct.innerText = `${mockData.integrity}%`;
        aiPct.innerText = `${mockData.ai}%`;
        ageBadge.innerText = mockData.age;

        issuesContainer.innerHTML = '';
        mockData.issues.forEach((issue, i) => {
            const card = document.createElement('div');
            card.className = 'glass-card rounded-xl p-3 flex items-center justify-between opacity-0';
            card.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-orange-400 text-xs">⚠️</span>
                    <span class="text-[10px] font-black uppercase text-white/80">${issue.title}</span>
                </div>
                <span class="text-[8px] text-white/20 uppercase font-black">${issue.type}</span>
            `;
            issuesContainer.appendChild(card);
            gsap.to(card, { opacity: 1, duration: 0.4, delay: 0.8 + (i * 0.1) });
        });
    }

    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 600;
        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * 500, y: 600, r: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 8, dy: -Math.random() * 12 - 8,
            color: `hsl(${Math.random() * 360}, 60%, 50%)`
        }));
        function frame() {
            ctx.clearRect(0, 0, 500, 600);
            particles.forEach(p => { p.x += p.dx; p.y += p.dy; p.dy += 0.4; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
            if (particles.some(p => p.y < 700)) requestAnimationFrame(frame);
        }
        frame();
    }

    performScan();
});