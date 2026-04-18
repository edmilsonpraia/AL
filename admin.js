// ========================================
// Admin Panel - Lisandra & Adilson
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Default credentials (hashed) ----
    const DEFAULT_USER = 'admin';
    const DEFAULT_PASS = 'LA2026';

    function getCredentials() {
        const stored = localStorage.getItem('admin_credentials');
        if (stored) return JSON.parse(stored);
        return { user: DEFAULT_USER, pass: DEFAULT_PASS };
    }

    function setCredentials(user, pass) {
        localStorage.setItem('admin_credentials', JSON.stringify({ user, pass }));
    }

    // ---- Login ----
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Check if already logged in
    if (sessionStorage.getItem('admin_logged') === 'true') {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'flex';
        loadDashboard();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value;
        const creds = getCredentials();

        if (user === creds.user && pass === creds.pass) {
            sessionStorage.setItem('admin_logged', 'true');
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            loadDashboard();
        } else {
            loginError.style.display = 'block';
            document.getElementById('loginPass').value = '';
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('admin_logged');
        location.reload();
    });

    // ---- Mobile sidebar ----
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // ---- Tab Navigation ----
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');

            sidebar.classList.remove('open');
        });
    });

    // ---- Load Dashboard Data ----
    function getRSVPs() {
        return JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    }

    function loadDashboard() {
        const rsvps = getRSVPs();
        loadStats(rsvps);
        loadRecentList(rsvps);
        loadGuestsTable(rsvps);
        loadMessages(rsvps);
        loadMenuItems();
    }

    // ---- Stats ----
    function loadStats(rsvps) {
        const confirmed = rsvps.filter(r => r.attendance === 'sim');
        const declined = rsvps.filter(r => r.attendance === 'nao');

        let totalPeople = 0;
        confirmed.forEach(r => {
            totalPeople += 1 + (parseInt(r.guests) || 0);
        });

        const daysLeft = Math.max(0, Math.floor(
            (new Date('2026-08-15T15:30:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        ));

        document.getElementById('statConfirmed').textContent = confirmed.length;
        document.getElementById('statDeclined').textContent = declined.length;
        document.getElementById('statTotal').textContent = totalPeople;
        document.getElementById('statDays').textContent = daysLeft;
    }

    // ---- Recent List ----
    function loadRecentList(rsvps) {
        const container = document.getElementById('recentList');
        if (rsvps.length === 0) {
            container.innerHTML = '<p class="empty-state">Ainda não há confirmações.</p>';
            return;
        }

        const recent = [...rsvps].reverse().slice(0, 8);
        container.innerHTML = recent.map(r => `
            <div class="recent-item">
                <div>
                    <span class="ri-name">${escapeHtml(r.name || 'Sem nome')}</span>
                    <span class="ri-date">${formatDate(r.date)}</span>
                </div>
                <span class="badge ${r.attendance === 'sim' ? 'confirmed' : 'declined'}">
                    ${r.attendance === 'sim' ? 'Confirmado' : 'Não vai'}
                </span>
            </div>
        `).join('');
    }

    // ---- Guests Table ----
    function loadGuestsTable(rsvps, filter = 'todos', search = '') {
        const tbody = document.getElementById('guestsTableBody');
        const noGuests = document.getElementById('noGuests');

        let filtered = rsvps;
        if (filter !== 'todos') {
            filtered = filtered.filter(r => r.attendance === filter);
        }
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(r => (r.name || '').toLowerCase().includes(s));
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '';
            noGuests.style.display = 'block';
            return;
        }

        noGuests.style.display = 'none';
        tbody.innerHTML = filtered.map((r, i) => `
            <tr>
                <td><strong>${escapeHtml(r.name || 'Sem nome')}</strong></td>
                <td>${escapeHtml(r.phone || '-')}</td>
                <td>${r.guests || '0'}</td>
                <td>
                    <span class="badge ${r.attendance === 'sim' ? 'confirmed' : 'declined'}">
                        ${r.attendance === 'sim' ? 'Confirmado' : 'Não vai'}
                    </span>
                </td>
                <td style="font-size:0.78rem;color:var(--text-light);">${formatDate(r.date)}</td>
                <td>
                    <button class="delete-btn" data-index="${i}" title="Remover">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                </td>
            </tr>
        `).join('');

        // Delete handlers
        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                if (confirm('Tem a certeza que deseja remover este convidado?')) {
                    const rsvps = getRSVPs();
                    rsvps.splice(idx, 1);
                    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
                    loadDashboard();
                }
            });
        });
    }

    // Search & Filter
    const searchInput = document.getElementById('searchGuests');
    const filterSelect = document.getElementById('filterGuests');

    searchInput.addEventListener('input', () => {
        loadGuestsTable(getRSVPs(), filterSelect.value, searchInput.value);
    });

    filterSelect.addEventListener('change', () => {
        loadGuestsTable(getRSVPs(), filterSelect.value, searchInput.value);
    });

    // Export CSV
    document.getElementById('exportBtn').addEventListener('click', () => {
        const rsvps = getRSVPs();
        if (rsvps.length === 0) return alert('Não há dados para exportar.');

        const headers = ['Nome', 'Telefone', 'Acompanhantes', 'Estado', 'Mensagem', 'Data'];
        const rows = rsvps.map(r => [
            r.name || '',
            r.phone || '',
            r.guests || '0',
            r.attendance === 'sim' ? 'Confirmado' : 'Não vai',
            (r.message || '').replace(/"/g, '""'),
            formatDate(r.date)
        ]);

        let csv = '\uFEFF' + headers.join(';') + '\n';
        rows.forEach(row => {
            csv += row.map(v => `"${v}"`).join(';') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'convidados_lisandra_adilson.csv';
        a.click();
        URL.revokeObjectURL(url);
    });

    // ---- Messages ----
    function loadMessages(rsvps) {
        const container = document.getElementById('messagesList');
        const withMessages = rsvps.filter(r => r.message && r.message.trim());

        if (withMessages.length === 0) {
            container.innerHTML = '<p class="empty-state">Ainda não há mensagens dos convidados.</p>';
            return;
        }

        container.innerHTML = withMessages.reverse().map(r => `
            <div class="message-card">
                <div class="mc-header">
                    <span class="mc-name">${escapeHtml(r.name || 'Anónimo')}</span>
                    <span class="mc-date">${formatDate(r.date)}</span>
                </div>
                <p class="mc-text">"${escapeHtml(r.message)}"</p>
            </div>
        `).join('');
    }

    // ---- Menu Items ----
    function getMenuItems() {
        return JSON.parse(localStorage.getItem('wedding_menu') || '{}');
    }

    function saveMenuItems(items) {
        localStorage.setItem('wedding_menu', JSON.stringify(items));
    }

    function loadMenuItems() {
        const saved = getMenuItems();

        Object.keys(saved).forEach(category => {
            const container = document.getElementById('menu-' + category);
            if (container && saved[category]) {
                saved[category].forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'menu-item';
                    div.innerHTML = `
                        <span class="item-name">${escapeHtml(item.name)}</span>
                        <span class="item-tag">${escapeHtml(item.tag)}</span>
                    `;
                    container.appendChild(div);
                });
            }
        });
    }

    // Add Item Modal
    const addItemModal = document.getElementById('addItemModal');
    const addItemForm = document.getElementById('addItemForm');

    document.querySelectorAll('.add-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('newItemCategory').value = btn.dataset.category;
            document.getElementById('newItemName').value = '';
            addItemModal.style.display = 'flex';
        });
    });

    document.getElementById('cancelAddItem').addEventListener('click', () => {
        addItemModal.style.display = 'none';
    });

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newItemName').value.trim();
        const tag = document.getElementById('newItemTag').value;
        const category = document.getElementById('newItemCategory').value;

        if (!name) return;

        // Add to DOM
        const container = document.getElementById('menu-' + category);
        if (container) {
            const div = document.createElement('div');
            div.className = 'menu-item';
            div.innerHTML = `
                <span class="item-name">${escapeHtml(name)}</span>
                <span class="item-tag">${escapeHtml(tag)}</span>
            `;
            container.appendChild(div);
        }

        // Save to localStorage
        const items = getMenuItems();
        if (!items[category]) items[category] = [];
        items[category].push({ name, tag });
        saveMenuItems(items);

        addItemModal.style.display = 'none';
    });

    // ---- Change Password ----
    document.getElementById('changePassForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const current = document.getElementById('currentPass').value;
        const newPass = document.getElementById('newPass').value;
        const confirm = document.getElementById('confirmPass').value;
        const msg = document.getElementById('passMsg');

        const creds = getCredentials();

        if (current !== creds.pass) {
            msg.textContent = 'Palavra-passe actual incorrecta.';
            msg.className = 'config-msg error';
            msg.style.display = 'block';
            return;
        }

        if (newPass !== confirm) {
            msg.textContent = 'As palavras-passe não coincidem.';
            msg.className = 'config-msg error';
            msg.style.display = 'block';
            return;
        }

        if (newPass.length < 4) {
            msg.textContent = 'A palavra-passe deve ter pelo menos 4 caracteres.';
            msg.className = 'config-msg error';
            msg.style.display = 'block';
            return;
        }

        setCredentials(creds.user, newPass);
        msg.textContent = 'Palavra-passe alterada com sucesso!';
        msg.className = 'config-msg success';
        msg.style.display = 'block';

        document.getElementById('currentPass').value = '';
        document.getElementById('newPass').value = '';
        document.getElementById('confirmPass').value = '';

        setTimeout(() => { msg.style.display = 'none'; }, 3000);
    });

    // ---- Clear Data ----
    document.getElementById('clearDataBtn').addEventListener('click', () => {
        if (confirm('Tem a certeza? Todos os dados de confirmação serão apagados permanentemente.')) {
            localStorage.removeItem('wedding_rsvps');
            localStorage.removeItem('wedding_menu');
            loadDashboard();
            alert('Todos os dados foram limpos.');
        }
    });

    // ---- Helpers ----
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-PT', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

});
