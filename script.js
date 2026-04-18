/**
 * EventOrch Core Logic
 * Clean, production-ready implementation with dynamic user states.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. UI Elements & Global Configuration
    const yearEl = document.getElementById('year');
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('auth-modal');
    const authMsg = document.getElementById('auth-msg');
    const eventsGrid = document.getElementById('events-grid');
    const adminLinkContainer = document.getElementById('admin-link-container');
    
    // Hero Dynamic Elements
    const heroHeadline = document.getElementById('hero-headline');
    const heroSubhead = document.getElementById('hero-subhead');
    const heroCta = document.getElementById('hero-cta');

    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. State Management (Global Store)
    let allEvents = [];
    let currentFilter = 'all';
    let currentUser = null;

    // Provide accessor for registration module
    window.getEventById = (id) => allEvents.find(e => e.$id === id);

    // 3. Core Functions
    async function updateUIState() {
        try {
            currentUser = await window.auth.getUser();
            const isAdmin = await window.auth.isAdmin();

            if (currentUser) {
                // Logged In State
                authBtn.textContent = currentUser.name;
                authBtn.onclick = null;

                // Update Hero Content (Personalized)
                if (heroHeadline) heroHeadline.textContent = `Ready to Orchestrate, ${currentUser.name.split(' ')[0]}?`;
                if (heroSubhead) heroSubhead.textContent = "Your curated event lineup is waiting. Explore new opportunities or manage your bookings below.";
                if (heroCta) {
                    heroCta.innerHTML = `
                        <button class="btn btn-primary" onclick="window.openTicketsModal()">View My Tickets</button>
                        <a class="btn btn-ghost" href="#events">Explore Events</a>
                    `;
                }

                // Action Center
                adminLinkContainer.innerHTML = `
                    <div style="display:flex; gap:12px; justify-content:center; align-items:center;">
                        ${isAdmin ? '<a href="admin.html" class="btn btn-ghost" style="scale:0.9; color:var(--accent)">Admin Dashboard</a>' : ''}
                        <button onclick="window.openTicketsModal()" class="btn btn-ghost" style="scale:0.9">My Tickets</button>
                        <button onclick="window.handleLogout()" class="btn btn-ghost" style="scale:0.9">Sign Out</button>
                    </div>
                `;
            } else {
                // Logged Out State
                authBtn.textContent = 'Login / Signup';
                authBtn.onclick = () => window.openAuthModal();
                
                if (heroHeadline) heroHeadline.textContent = 'Seamless Event Orchestration';
                if (heroSubhead) heroSubhead.textContent = 'Powered by Appwrite. Built for world-class creators.';
                if (heroCta) {
                    heroCta.innerHTML = `
                        <a class="btn btn-primary" href="#events">Explore Events</a>
                        <a class="btn btn-ghost" href="#contact">Contact Support</a>
                    `;
                }
                adminLinkContainer.innerHTML = '';
            }
        } catch (e) {
            console.error('UI State Sync Error:', e);
        }
    }

    async function loadEvents() {
        try {
            if (eventsGrid) eventsGrid.innerHTML = '<div class="loading">Sourcing world-class events...</div>';
            allEvents = await window.db.getEvents();
            renderEvents();
        } catch (e) {
            if (eventsGrid) eventsGrid.innerHTML = '<div class="muted">Connectivity interrupted. Please refresh.</div>';
        }
    }

    function renderEvents() {
        if (!eventsGrid) return;
        const filtered = currentFilter === 'all' 
            ? allEvents 
            : allEvents.filter(e => e.category === currentFilter);

        eventsGrid.innerHTML = '';
        if (filtered.length === 0) {
            eventsGrid.innerHTML = '<div class="muted" style="grid-column: 1/-1; padding: 60px; text-align:center;">No orchestrations found in this category.</div>';
            return;
        }

        filtered.forEach(ev => {
            const card = document.createElement('article');
            card.className = 'card reveal tilt';
            const dateStr = new Date(ev.date).toLocaleDateString();
            
            card.innerHTML = `
                <span class="badge ${ev.category.toLowerCase()}">${ev.category}</span>
                <h3>${ev.title}</h3>
                <p class="muted">${ev.description}</p>
                <div class="metadata" style="margin-top:20px; font-weight:600; font-size:0.9rem">
                    <span>📅 ${dateStr}</span> | 
                    <span style="color:var(--accent)">👥 Limit: ${ev.capacity}</span>
                </div>
                <!-- Call to Registration Module -->
                <button class="btn btn-primary" style="margin-top:24px; width:100%" onclick="window.Registration.openModal('${ev.$id}')">Secure Spot</button>
            `;
            eventsGrid.appendChild(card);
        });
        
        // Re-init visuals
        if (typeof initScrollReveal === 'function') initScrollReveal();
        if (typeof initTilt === 'function') initTilt();
    }

    // 4. Global Exposed Handlers
    window.filterEvents = (cat) => {
        currentFilter = cat;
        document.querySelectorAll('.filter-tabs .badge').forEach(b => b.classList.remove('active'));
        if (event) event.target.classList.add('active');
        renderEvents();
    };

    window.openAuthModal = () => authModal.setAttribute('aria-hidden', 'false');
    window.closeAuthModal = () => {
        authModal.setAttribute('aria-hidden', 'true');
        authMsg.textContent = '';
    };

    window.showAuthTab = (t) => {
        const isLogin = t === 'login';
        document.getElementById('login-form').classList.toggle('hidden', !isLogin);
        document.getElementById('signup-form').classList.toggle('hidden', isLogin);
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-signup').classList.toggle('active', !isLogin);
    };

    window.handleLogin = async () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        try {
            authMsg.textContent = 'Authenticating...';
            await window.auth.login(email, pass);
            authMsg.textContent = 'Identity Verified. Syncing...';
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            authMsg.textContent = err.message;
        }
    };

    window.handleSignup = async () => {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        try {
            authMsg.textContent = 'Creating orchestrator profile...';
            await window.auth.signup(email, pass, name);
            authMsg.textContent = 'Account Created. Logging in...';
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            authMsg.textContent = err.message;
        }
    };

    window.handleLogout = async () => {
        await window.auth.logout();
        location.reload();
    };

    // Ticket Management
    window.openTicketsModal = async () => {
        const modal = document.getElementById('tickets-modal');
        const list = document.getElementById('tickets-list');
        modal.setAttribute('aria-hidden', 'false');
        list.innerHTML = '<div class="loading">Retrieving your orchestrations...</div>';

        try {
            const regs = await window.db.getUserRegistrations();
            list.innerHTML = '';
            if (regs.length === 0) {
                list.innerHTML = '<div class="muted" style="text-align:center; padding: 40px;">No registrations found. Start your journey below!</div>';
                return;
            }

            regs.forEach(r => {
                const item = document.createElement('div');
                item.className = 'card';
                item.style.padding = '20px';
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h4 style="margin:0; font-size:1.1rem">${r.eventTitle}</h4>
                            <p class="muted" style="margin:8px 0 0 0; font-size:0.85rem">${new Date(r.timestamp).toLocaleString()}</p>
                        </div>
                        <span class="badge" style="background:var(--accent-glow); color:var(--accent)">VERIFIED</span>
                    </div>
                `;
                list.appendChild(item);
            });
        } catch (e) {
            list.innerHTML = `<div class="muted">Discovery Error: ${e.message}</div>`;
        }
    };

    window.closeTicketsModal = () => document.getElementById('tickets-modal').setAttribute('aria-hidden', 'true');

    // 5. Initialize Page
    if (typeof initParticles === 'function') initParticles();
    if (typeof initScrollReveal === 'function') initScrollReveal();
    if (typeof initTilt === 'function') initTilt();
    
    await updateUIState();
    await loadEvents();

    // Support Form
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.onclick = () => {
            const msg = document.getElementById('msg');
            msg.textContent = 'Message Received. We will reach out within 24 hours.';
            document.getElementById('contactForm').reset();
        };
    }

    // Theme Support
    const tToggle = document.getElementById('themeToggle');
    const setTheme = (dark) => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        if (tToggle) tToggle.textContent = dark ? '🌙' : '☀️';
        localStorage.setItem('dark', dark ? '1' : '0');
    };
    if (tToggle) tToggle.onclick = () => setTheme(localStorage.getItem('dark') !== '1');
    if (localStorage.getItem('dark') === '1') setTheme(true);
});

/* Helper Visual Modules */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
    window.addEventListener('resize', resize); resize();

    function create() {
        particles = Array.from({ length: Math.floor((w * h) / 100000) }, () => ({
            x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.5, vx: (Math.random() - .5) / 2.5, vy: (Math.random() - .5) / 2.5
        }));
    }
    create();
    function tick() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(tick);
    }
    tick();
}

function initScrollReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(n => io.observe(n));
}

function initTilt() {
    document.querySelectorAll('.tilt, .card').forEach(el => {
        el.onmousemove = (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            el.style.transform = `perspective(800px) rotateX(${(-y * 8)}deg) rotateY(${x * 10}deg)`;
        };
        el.onmouseleave = () => el.style.transform = '';
    });
}