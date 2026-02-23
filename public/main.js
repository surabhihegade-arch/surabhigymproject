// Global state
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    loadTrainers();
    animateCounters();
    initSmoothScrolling();
    initMobileMenu();
    initProgramCards();
    initPlanSelection();
    initJoinNowModal();
    initTestimonials();
    initInquiryForm();
    initAuth();
    checkAuthStatus();
});

// Authentication functions
function initAuth() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openAuthModal('login'));
    }

    // Signup button
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => openAuthModal('signup'));
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Dashboard button
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', openDashboard);
    }

    // Auth modal
    const authModal = document.getElementById('authModal');
    if (authModal) {
        const closeBtn = authModal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            authModal.classList.remove('active');
        });

        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('active');
            }
        });
    }

    // Switch between login and signup
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    
    if (showSignup) {
        showSignup.addEventListener('click', () => {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('signupForm').style.display = 'block';
            document.getElementById('authModalTitle').textContent = 'SIGN UP';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', () => {
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('authModalTitle').textContent = 'SIGN IN';
        });
    }

    // Login form submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submit
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Dashboard modal
    const dashboardModal = document.getElementById('dashboardModal');
    if (dashboardModal) {
        const closeDashboard = document.getElementById('closeDashboard');
        if (closeDashboard) {
            closeDashboard.addEventListener('click', () => {
                dashboardModal.classList.remove('active');
            });
        }

        dashboardModal.addEventListener('click', (e) => {
            if (e.target === dashboardModal) {
                dashboardModal.classList.remove('active');
            }
        });
    }

    // Membership action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.dataset.plan;
            const price = btn.dataset.price;
            purchaseMembership(planName, price);
        });
    });

    // Get membership button
    const getMembershipBtn = document.querySelector('.get-membership-btn');
    if (getMembershipBtn) {
        getMembershipBtn.addEventListener('click', () => {
            document.getElementById('dashboardModal').classList.remove('active');
            document.querySelector('#plans').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function openAuthModal(type) {
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authModalTitle = document.getElementById('authModalTitle');

    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authModalTitle.textContent = 'SIGN IN';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authModalTitle.textContent = 'SIGN UP';
    }

    authModal.classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userId', result.user.id);
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('userEmail', result.user.email);
            
            currentUser = result.user;
            updateUIForAuth();
            
            document.getElementById('loginMsg').innerHTML = '<p class="success-msg">Login successful!</p>';
            setTimeout(() => {
                document.getElementById('authModal').classList.remove('active');
                document.getElementById('loginMsg').innerHTML = '';
                e.target.reset();
            }, 1000);
        } else {
            document.getElementById('loginMsg').innerHTML = `<p class="error-msg">${result.error}</p>`;
        }
    } catch (err) {
        console.error(err);
        document.getElementById('loginMsg').innerHTML = '<p class="error-msg">Connection error. Please try again.</p>';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userId', result.user.id);
            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('userEmail', result.user.email);
            
            currentUser = result.user;
            updateUIForAuth();
            
            document.getElementById('signupMsg').innerHTML = '<p class="success-msg">Account created successfully!</p>';
            setTimeout(() => {
                document.getElementById('authModal').classList.remove('active');
                document.getElementById('signupMsg').innerHTML = '';
                e.target.reset();
            }, 1000);
        } else {
            document.getElementById('signupMsg').innerHTML = `<p class="error-msg">${result.error}</p>`;
        }
    } catch (err) {
        console.error(err);
        document.getElementById('signupMsg').innerHTML = '<p class="error-msg">Connection error. Please try again.</p>';
    }
}

function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    currentUser = null;
    updateUIForAuth();
}

function checkAuthStatus() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (userId && userName) {
        currentUser = { id: userId, name: userName, email: userEmail };
        updateUIForAuth();
    }
}

function updateUIForAuth() {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');

    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userGreeting) userGreeting.textContent = `Hi, ${currentUser.name.split(' ')[0]}!`;
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

async function openDashboard() {
    if (!currentUser) return;

    const dashboardModal = document.getElementById('dashboardModal');
    const dashboardUserName = document.getElementById('dashboardUserName');
    const dashboardUserEmail = document.getElementById('dashboardUserEmail');

    dashboardUserName.textContent = currentUser.name;
    dashboardUserEmail.textContent = currentUser.email;

    // Load membership info
    await loadMembershipInfo();

    dashboardModal.classList.add('active');
}

async function loadMembershipInfo() {
    const membershipInfo = document.getElementById('membershipInfo');
    
    try {
        const response = await fetch(`/api/membership?userId=${currentUser.id}`);
        const membership = await response.json();

        if (membership) {
            const startDate = new Date(membership.start_date).toLocaleDateString();
            const endDate = new Date(membership.end_date).toLocaleDateString();
            
            membershipInfo.innerHTML = `
                <div class="membership-active">
                    <div class="plan-name">${membership.plan_name}</div>
                    <div class="plan-details">Price: ${membership.price}</div>
                    <div class="plan-details">Started: ${startDate}</div>
                    <div class="plan-details">Valid until: ${endDate}</div>
                    <div class="plan-status">✓ Active Membership</div>
                </div>
            `;
        } else {
            membershipInfo.innerHTML = `
                <p class="no-membership">No active membership</p>
                <button class="btn get-membership-btn">Get Membership</button>
            `;
            
            // Re-attach event listener
            const getMembershipBtn = membershipInfo.querySelector('.get-membership-btn');
            getMembershipBtn.addEventListener('click', () => {
                document.getElementById('dashboardModal').classList.remove('active');
                document.querySelector('#plans').scrollIntoView({ behavior: 'smooth' });
            });
        }
    } catch (err) {
        console.error(err);
        membershipInfo.innerHTML = '<p class="no-membership">Unable to load membership info</p>';
    }
}

async function purchaseMembership(planName, price) {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }

    if (!confirm(`Activate ${planName} for ${price}?`)) return;

    try {
        const response = await fetch('/api/membership', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                planName: planName,
                planType: planName.split(' ')[0].toLowerCase(),
                price: price
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            await loadMembershipInfo();
        } else {
            alert(result.error || 'Failed to activate membership');
        }
    } catch (err) {
        console.error(err);
        alert('Connection error. Please try again.');
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Create mobile menu button if not exists
    let menuBtn = document.querySelector('.menu-toggle');
    if (!menuBtn) {
        menuBtn = document.createElement('div');
        menuBtn.className = 'menu-toggle';
        menuBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        nav.appendChild(menuBtn);
    }

    menuBtn.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
}

// Program cards click handler
function initProgramCards() {
    const programCards = document.querySelectorAll('.category');
    programCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const programName = card.querySelector('span:nth-of-type(1)')?.textContent;
            openJoinModal(programName);
        });
    });
}

// Plan selection logic
function initPlanSelection() {
    const planCards = document.querySelectorAll('.plan');
    planCards.forEach(card => {
        card.addEventListener('click', () => {
            const planName = card.querySelector('span:nth-of-type(1)')?.textContent;
            const planPrice = card.querySelector('span:nth-of-type(2)')?.textContent;
            openJoinModal(`Membership - ${planName}`, planPrice);
        });
    });
}

// Modal functionality
function initJoinNowModal() {
    // Create modal if not exists
    let modal = document.getElementById('joinModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'joinModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>JOIN NOW</h2>
                <p id="selectedProgram">Selected Program</p>
                <form id="joinForm">
                    <input type="text" name="name" placeholder="Your Name" required>
                    <input type="email" name="email" placeholder="Your Email" required>
                    <input type="tel" name="phone" placeholder="Your Phone Number">
                    <textarea name="message" placeholder="Your Fitness Goals" rows="4" required></textarea>
                    <input type="hidden" name="program" id="modalProgram">
                    <button type="submit" class="btn submit-btn">Submit Application</button>
                </form>
                <div id="formMsg"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Close modal handlers
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openJoinModal(program, price = '') {
    const modal = document.getElementById('joinModal');
    const programText = document.getElementById('selectedProgram');
    const programInput = document.getElementById('modalProgram');
    
    programText.textContent = price ? `${program} (${price})` : program;
    programInput.value = program;
    modal.classList.add('active');
}

function initInquiryForm() {
    const form = document.getElementById('joinForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('formMsg').innerHTML = '<p class="success-msg">Application Sent Successfully!</p>';
                    form.reset();
                    setTimeout(() => {
                        document.getElementById('joinModal').classList.remove('active');
                        document.getElementById('formMsg').innerHTML = '';
                    }, 2000);
                } else {
                    document.getElementById('formMsg').innerHTML = '<p class="error-msg">Something went wrong.</p>';
                }
            } catch (err) {
                console.error(err);
                document.getElementById('formMsg').innerHTML = '<p class="error-msg">Connection error. Please try again.</p>';
            }
        });
    }
}

// Testimonials carousel
function initTestimonials() {
    const testimonials = [
        {
            text: "I made the right choice by choosing Surabhi Gym. I've already achieved my ideal body in just 3 months!",
            name: "Surabhi Hegade",
            role: "Lead Trainer & Member",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
        },
        {
            text: "The trainers here are amazing! They helped me transform my lifestyle completely. Best gym experience ever!",
            name: "Rahul Sharma",
            role: "Member since 2023",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
        },
        {
            text: "Great facilities and expert coaches. The personalized training programs really make a difference!",
            name: "Priya Patel",
            role: "Member since 2024",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
        }
    ];

    let currentIndex = 0;
    const leftT = document.querySelector('.left-t');
    if (!leftT) return;

    // Add navigation dots
    let navDots = document.querySelector('.testimonial-nav');
    if (!navDots) {
        navDots = document.createElement('div');
        navDots.className = 'testimonial-nav';
        const rightT = document.querySelector('.right-t');
        if (rightT) {
            rightT.appendChild(navDots);
        }
    }

    function updateTestimonial(index) {
        const t = testimonials[index];
        const p = leftT.querySelector('p');
        const span = leftT.querySelector('span:nth-of-type(4)');
        
        if (p) p.textContent = `"${t.text}"`;
        if (span) span.innerHTML = `<span style="color: var(--orange)">${t.name}</span> - ${t.role}`;
        
        // Update image
        const img = document.querySelector('.testimonial-images img');
        if (img) img.src = t.image;

        // Update dots
        const dots = navDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Create dots
    navDots.innerHTML = testimonials.map((_, i) => 
        `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');

    // Dot click handlers
    navDots.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.index);
            updateTestimonial(currentIndex);
        });
    });

    // Auto-rotate every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonial(currentIndex);
    }, 5000);
}

async function loadTrainers() {
    try {
        const response = await fetch('/api/trainers');
        const trainers = await response.json();
        const container = document.getElementById('trainer-container');

        if (container) {
            container.innerHTML = trainers.map(t => `
                <div class="trainer-card">
                    <img src="${t.image_url || 'https://via.placeholder.com/400x500?text=Trainer'}" alt="${t.name}">
                    <div class="trainer-info">
                        <span class="exp">${t.experience} Experience</span>
                        <h3>${t.name}</h3>
                        <p class="specialty" style="color: var(--orange); margin-bottom: 5px; font-weight: 700; font-size: 0.9rem;">${t.specialty}</p>
                        <p class="bio" style="font-size: 0.85rem; color: var(--gray);">${t.bio}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to load trainers:", err);
    }
}

function animateCounters() {
    const counters = [
        { id: 'counter-coaches', target: 140 },
        { id: 'counter-members', target: 978 },
        { id: 'counter-programs', target: 50 }
    ];

    counters.forEach(counter => {
        const el = document.getElementById(counter.id);
        if (!el) return;

        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = counter.target / (duration / stepTime);

        const timer = setInterval(() => {
            current += increment;
            if (current >= counter.target) {
                el.innerText = '+' + counter.target;
                clearInterval(timer);
            } else {
                el.innerText = '+' + Math.floor(current);
            }
        }, stepTime);
    });
}
