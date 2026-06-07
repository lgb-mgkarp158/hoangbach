document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. TAB NAVIGATION SYSTEM
    // ==========================================
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabViews = document.querySelectorAll('.tab-view');
    const tabList = Array.from(navButtons).map(btn => btn.getAttribute('data-tab'));
    let currentTabIndex = 0;

    function switchTab(tabId) {
        // Find tab index
        const index = tabList.indexOf(tabId);
        if (index === -1) return;
        currentTabIndex = index;

        // Update active nav button
        navButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update active section
        tabViews.forEach(view => {
            if (view.id === `view-${tabId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Close sidebar on mobile after switching
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }

        // Scroll to top of main content container
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // ==========================================
    // 2. KEYBOARD NAVIGATION SUPPORT
    // ==========================================
    window.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentTabIndex + 1) % tabList.length;
            switchTab(tabList[nextIndex]);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (currentTabIndex - 1 + tabList.length) % tabList.length;
            switchTab(tabList[prevIndex]);
        }
    });

    // ==========================================
    // 3. MOBILE SIDEBAR TOGGLE
    // ==========================================
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ==========================================
    // 4. AVATAR MOUSEOVER PARTICLE SPARKS
    // ==========================================
    const avatarImg = document.getElementById('avatar-img');
    const emitter = document.getElementById('particle-emitter');

    if (avatarImg && emitter) {
        let lastSpawnTime = 0;

        avatarImg.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastSpawnTime < 50) return; // Limit spawn rate (throttle)
            lastSpawnTime = now;

            const rect = avatarImg.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            createSpark(mouseX, mouseY);
        });

        function createSpark(x, y) {
            const particle = document.createElement('span');
            particle.classList.add('avatar-particle');
            
            // Random direction offsets (dx, dy)
            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 35;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            // Apply style parameters dynamically
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--dx', `${dx}px`);
            particle.style.setProperty('--dy', `${dy}px`);
            
            // Randomize size and animation duration slightly
            const size = 3 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDuration = `${0.45 + Math.random() * 0.4}s`;

            emitter.appendChild(particle);

            // Self cleanup after animation ends
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }
});
