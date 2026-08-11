// ========================================
// Lisandra & Adilson - Wedding Website JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Floating Particles ----
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        const colors = ['rgba(164,119,100,0.15)', 'rgba(245,230,211,0.2)', 'rgba(196,160,142,0.12)'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.width = p.style.height = (3 + Math.random() * 6) + 'px';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDuration = (15 + Math.random() * 20) + 's';
            p.style.animationDelay = (Math.random() * 15) + 's';
            particlesContainer.appendChild(p);
        }
    }

    // ---- Letter-by-letter animation for names ----
    const heroNames = document.querySelector('.hero-names');
    if (heroNames) {
        const original = heroNames.innerHTML;
        const parts = original.split(/(<span class="amp">.*?<\/span>)/);
        let html = '';
        let delay = 0.6;
        parts.forEach(part => {
            if (part.includes('class="amp"')) {
                html += part;
                delay += 0.15;
            } else {
                for (const char of part) {
                    if (char === ' ') {
                        html += ' ';
                    } else {
                        html += `<span class="letter" style="animation-delay:${delay.toFixed(2)}s">${char}</span>`;
                        delay += 0.05;
                    }
                }
            }
        });
        heroNames.innerHTML = html;
    }

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ---- Mobile menu toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => {
                    item.classList.toggle('active',
                        item.getAttribute('href') === '#' + entry.target.id
                    );
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(section => observerNav.observe(section));

    // ---- Scroll Reveal Animation ----
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Gallery Upload ----
    const uploadArea = document.getElementById('uploadArea');
    const mediaInput = document.getElementById('mediaInput');
    const uploaderName = document.getElementById('uploaderName');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressText = document.getElementById('progressText');
    const progressCount = document.getElementById('progressCount');
    const progressFill = document.getElementById('progressFill');
    const uploadSuccess = document.getElementById('uploadSuccess');

    if (uploadArea && mediaInput) {
        // Drag & drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        mediaInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        async function handleFiles(files) {
            if (!files || files.length === 0) return;

            const validFiles = Array.from(files).filter(f =>
                f.type.startsWith('image/') || f.type.startsWith('video/')
            );

            if (validFiles.length === 0) {
                alert('Por favor seleccione apenas imagens ou vídeos.');
                return;
            }

            const guestName = uploaderName.value.trim() ||
                localStorage.getItem('wedding_confirmed_guest') ||
                'Anónimo';

            uploadSuccess.style.display = 'none';
            uploadProgress.style.display = 'block';
            let success = 0;
            let failed = 0;

            for (let i = 0; i < validFiles.length; i++) {
                const file = validFiles[i];
                progressText.textContent = `A carregar ${file.name}...`;
                progressCount.textContent = `${i + 1}/${validFiles.length}`;
                progressFill.style.width = `${((i) / validFiles.length) * 100}%`;

                const result = await uploadMedia(file, guestName);
                if (result.success) success++;
                else failed++;
            }

            progressFill.style.width = '100%';
            progressText.textContent = failed === 0
                ? `${success} ficheiro(s) carregado(s) com sucesso!`
                : `${success} carregado(s), ${failed} falharam.`;

            setTimeout(() => {
                uploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
                if (success > 0) {
                    uploadSuccess.style.display = 'flex';
                }
            }, 2000);

            mediaInput.value = '';
        }
    }

    // ---- Smooth scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // LOVE IA CHATBOT
    // ========================================

    const WEDDING_DATA = {
        noivos: 'Lisandra e Adilson',
        data: '15 de Agosto de 2026',
        dataFormatada: '15/08/2026',
        diaSemana: 'Sábado',
        horaCerimonia: '14:30',
        local: 'Estaleiro Imbondeiro',
        endereco: 'Gleba GU22 - Zona ZR2B, Talatona, Luanda',
        cerimonia: 'Cerimónia civil às 14:30 seguida do copo d\'água',
        versiculo: '"Onde você for, irei; onde você ficar, ficarei." - Rute 1:16',
        dresscode: 'Traje elegante — tente ofuscar os noivos! Tons terrosos, champagne e dourado são bem-vindos. O tema da festa é "Viagem Gastronómica".',
        confirmar: 'A lista de convidados já se encontra fechada e todas as presenças estão confirmadas. Contamos consigo no dia 15 de Agosto!',
        ticket: 'Na secção "O meu Ticket" pode gerar o seu ticket pessoal — basta escrever o seu nome. O ticket fica guardado no seu telemóvel e pode ser apresentado (impresso ou no ecrã) para levantar o brinde no dia do casamento.',
        galeria: 'Na secção "Galeria" pode partilhar as suas fotografias e vídeos do casamento. Basta escrever o seu nome (opcional), tocar ou arrastar os ficheiros — os noivos farão um álbum especial com todas as memórias.',
        estacionamento: 'O Estaleiro Imbondeiro dispõe de estacionamento para os convidados.',
        criancas: 'Sim, as crianças são bem-vindas ao casamento!',
    };

    const RESPONSES = [
        {
            keywords: ['ola', 'oi', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
            reply: () => `Olá! Bem-vindo ao casamento de ${WEDDING_DATA.noivos}! Estou aqui para ajudar com qualquer dúvida sobre o grande dia. O que gostaria de saber?`
        },
        {
            keywords: ['quando', 'data', 'dia', 'que dia', 'quando e'],
            reply: () => `O casamento será no dia ${WEDDING_DATA.data} (${WEDDING_DATA.diaSemana}). A cerimónia civil começa às ${WEDDING_DATA.horaCerimonia}.`
        },
        {
            keywords: ['hora', 'horario', 'horas', 'que horas', 'comeca'],
            reply: () => `A cerimónia civil começa às ${WEDDING_DATA.horaCerimonia}, seguida do copo d'água. Recomendamos chegar com 15-20 minutos de antecedência.`
        },
        {
            keywords: ['onde', 'local', 'endereco', 'morada', 'localizacao', 'lugar', 'sitio'],
            reply: () => `O casamento será no ${WEDDING_DATA.local}, localizado em ${WEDDING_DATA.endereco}.`
        },
        {
            keywords: ['roupa', 'vestir', 'dress', 'traje', 'dresscode', 'codigo'],
            reply: () => WEDDING_DATA.dresscode
        },
        {
            keywords: ['confirmar', 'confirmacao', 'rsvp', 'presenca'],
            reply: () => WEDDING_DATA.confirmar
        },
        {
            keywords: ['ticket', 'bilhete', 'brinde', 'levantar', 'lembranca', 'lembrança', 'qr', 'codigo'],
            reply: () => WEDDING_DATA.ticket
        },
        {
            keywords: ['galeria', 'foto', 'video', 'partilhar', 'partilha', 'upload', 'carregar', 'album'],
            reply: () => WEDDING_DATA.galeria
        },
        {
            keywords: ['app', 'aplicacao', 'aplicativo', 'instalar', 'download', 'baixar', 'android', 'iphone', 'ios'],
            reply: () => `Sim! Pode instalar o site como app no seu telemóvel. No Android verá o banner "Instalar App" — basta tocar. No iPhone, abra este site no Safari, toque em Partilhar e depois em "Adicionar ao Ecrã Principal".`
        },
        {
            keywords: ['estacionamento', 'parking', 'estacionar', 'carro'],
            reply: () => WEDDING_DATA.estacionamento
        },
        {
            keywords: ['crianca', 'filho', 'filha', 'bebe', 'kids', 'menino', 'menina'],
            reply: () => WEDDING_DATA.criancas
        },
        {
            keywords: ['cerimonia', 'civil', 'religios', 'igreja', 'copo', 'agua', 'recepcao', 'festa'],
            reply: () => `${WEDDING_DATA.cerimonia}. Após a cerimónia, teremos uma celebração com jantar, música e muita alegria!`
        },
        {
            keywords: ['versiculo', 'biblia', 'frase', 'rute', 'citacao'],
            reply: () => `O versículo escolhido pelos noivos é: ${WEDDING_DATA.versiculo}. Uma bela promessa de amor e companheirismo.`
        },
        {
            keywords: ['noivos', 'quem', 'casal', 'lisandra', 'adilson'],
            reply: () => `Os noivos são ${WEDDING_DATA.noivos}! Um casal que decidiu unir as suas vidas e celebrar o seu amor no dia ${WEDDING_DATA.data}.`
        },
        {
            keywords: ['obrigado', 'obrigada', 'agradeco', 'thanks'],
            reply: () => `De nada! É um prazer ajudar. Se tiver mais alguma dúvida, estou aqui. Vemo-nos no casamento!`
        },
        {
            keywords: ['musica', 'danca', 'dancar', 'dj', 'banda'],
            reply: () => `Haverá música e dança durante a celebração após a cerimónia! Preparem-se para uma noite de muita alegria e diversão.`
        },
        {
            keywords: ['menu', 'comida', 'jantar', 'comer', 'refeicao', 'alergia', 'vegetariano'],
            reply: () => `O jantar será servido durante o copo d'água após a cerimónia, com uma "Viagem Gastronómica" que celebra sabores de Angola e do mundo.`
        },
        {
            keywords: ['taxi', 'uber', 'transporte', 'como chegar', 'ir'],
            reply: () => `O ${WEDDING_DATA.local} fica em ${WEDDING_DATA.endereco}. Pode usar táxi, Uber ou viatura própria. Há estacionamento no local.`
        },
        {
            keywords: ['foto', 'fotografia', 'fotografo', 'camera'],
            reply: () => `Haverá fotógrafo profissional no casamento! Sintam-se à vontade para tirar fotos também e partilhar este momento especial com os noivos.`
        },
        {
            keywords: ['amor', 'love', 'felicidade', 'parabens'],
            reply: () => `Obrigado pelas palavras de carinho! ${WEDDING_DATA.noivos} ficam muito felizes com o vosso apoio e amor. ${WEDDING_DATA.versiculo}`
        },
        {
            keywords: ['falta', 'quanto falta', 'contagem', 'countdown'],
            reply: () => {
                const diff = new Date('2026-08-15T14:30:00').getTime() - Date.now();
                if (diff <= 0) return 'O grande dia já chegou!';
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                return `Faltam ${days} dias para o grande dia! Estamos ansiosos!`;
            }
        }
    ];

    function getAIResponse(message) {
        const normalized = message.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '');

        let bestMatch = null;
        let bestScore = 0;

        for (const item of RESPONSES) {
            let score = 0;
            for (const kw of item.keywords) {
                const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (normalized.includes(kwNorm)) {
                    score += kwNorm.length;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        }

        if (bestMatch && bestScore > 0) {
            return bestMatch.reply();
        }

        const fallbacks = [
            `Obrigado pela pergunta! Para informações sobre o casamento de ${WEDDING_DATA.noivos}:\n\n` +
            `- Data: ${WEDDING_DATA.data}\n- Hora: ${WEDDING_DATA.horaCerimonia}\n- Local: ${WEDDING_DATA.local}, ${WEDDING_DATA.endereco}\n\n` +
            `Pergunte-me sobre o ticket de brinde, dresscode, galeria de fotos, ou como instalar a app!`,

            `Não tenho a certeza se entendi. Posso ajudar com:\n- Data e hora do casamento\n- Local e como chegar\n- Dresscode\n- Ticket de Brinde\n- Galeria (partilhar fotos e vídeos)\n- Instalar como app\n\nO que gostaria de saber?`
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // ---- Chat UI ----
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatQuickReplies = document.getElementById('chatQuickReplies');
    const chatBadge = document.getElementById('chatBadge');

    let chatOpen = false;
    let firstOpen = true;

    chatToggle.addEventListener('click', () => {
        chatOpen = !chatOpen;
        chatWindow.classList.toggle('open', chatOpen);
        chatToggle.classList.toggle('active', chatOpen);

        if (chatBadge) chatBadge.style.display = 'none';

        if (chatOpen && firstOpen) {
            firstOpen = false;
            setTimeout(() => {
                addBotMessage(`Olá! Sou a Love IA, assistente do casamento de ${WEDDING_DATA.noivos}! Estou aqui para responder a todas as suas dúvidas sobre o grande dia. Pergunte-me o que quiser!`);
            }, 500);
        }

        if (chatOpen) {
            setTimeout(() => chatInput.focus(), 400);
        }
    });

    function addBotMessage(text) {
        // Show typing
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const delay = Math.min(600 + text.length * 8, 2000);

        setTimeout(() => {
            typing.remove();

            const msg = document.createElement('div');
            msg.className = 'chat-msg bot';
            msg.innerHTML = `
                <div class="chat-msg-avatar">&#10084;</div>
                <div class="chat-msg-bubble">${text.replace(/\n/g, '<br>')}</div>
            `;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, delay);
    }

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg user';
        msg.innerHTML = `
            <div class="chat-msg-avatar">Eu</div>
            <div class="chat-msg-bubble">${text}</div>
        `;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addUserMessage(text);
        chatInput.value = '';

        // Hide quick replies after first message
        if (chatQuickReplies) {
            chatQuickReplies.style.display = 'none';
        }

        const reply = getAIResponse(text);
        addBotMessage(reply);
    }

    chatSendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Quick reply buttons
    document.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.dataset.msg;
            handleSend();
        });
    });

    // Show chat badge after 3 seconds
    setTimeout(() => {
        if (!chatOpen && chatBadge) {
            chatBadge.style.display = 'flex';
        }
    }, 3000);

    // ========================================
    // TICKET DE BRINDE (gerador + QR + persistência)
    // ========================================

    const TICKET_STORAGE_KEY = 'wedding_ticket_la2026';
    const ticketForm = document.getElementById('ticketForm');
    const ticketResult = document.getElementById('ticketResult');
    const ticketNameInput = document.getElementById('ticketName');
    const ticketPhoneInput = document.getElementById('ticketPhone');
    const ticketGenerateBtn = document.getElementById('ticketGenerateBtn');
    const ticketQrEl = document.getElementById('ticketQr');
    const ticketDisplayName = document.getElementById('ticketDisplayName');
    const ticketDisplayCode = document.getElementById('ticketDisplayCode');
    const ticketDisplayDate = document.getElementById('ticketDisplayDate');
    const ticketNewBtn = document.getElementById('ticketNewBtn');
    const ticketShareBtn = document.getElementById('ticketShareBtn');
    const ticketDownloadBtn = document.getElementById('ticketDownloadBtn');

    function generateTicketCode() {
        // Ex: LA-A7X9K2 (6 chars alphanumeric, no confusing chars)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let out = '';
        for (let i = 0; i < 6; i++) {
            out += chars[Math.floor(Math.random() * chars.length)];
        }
        return `LA-${out}`;
    }

    function formatTicketDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
            + ' · ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    }

    function renderTicket(ticket) {
        if (!ticket || !ticketResult) return;

        ticketDisplayName.textContent = ticket.name;
        ticketDisplayCode.textContent = ticket.ticket_code;
        ticketDisplayDate.textContent = formatTicketDate(ticket.created_at);

        ticketQrEl.innerHTML = '<div class="qr-loading">A gerar QR...</div>';

        if (window.QRCode && typeof window.QRCode.toDataURL === 'function') {
            window.QRCode.toDataURL(ticket.ticket_code, {
                width: 220,
                margin: 1,
                errorCorrectionLevel: 'M',
                color: { dark: '#4A2C2A', light: '#FDF8F3' }
            }).then((url) => {
                ticketQrEl.innerHTML = `<img src="${url}" alt="QR ${ticket.ticket_code}">`;
            }).catch((err) => {
                console.error('QR error:', err);
                ticketQrEl.innerHTML = `<div class="qr-fallback">${ticket.ticket_code}</div>`;
            });
        } else {
            console.warn('QRCode lib not loaded — mostrar código como fallback');
            ticketQrEl.innerHTML = `<div class="qr-fallback">${ticket.ticket_code}</div>`;
        }

        ticketForm.style.display = 'none';
        ticketResult.style.display = 'block';
    }

    function showTicketForm() {
        ticketResult.style.display = 'none';
        ticketForm.style.display = 'flex';
        ticketForm.reset();
        ticketNameInput.focus();
    }

    // Restore ticket from localStorage on load
    const savedTicketJSON = localStorage.getItem(TICKET_STORAGE_KEY);
    if (savedTicketJSON) {
        try {
            renderTicket(JSON.parse(savedTicketJSON));
        } catch {
            localStorage.removeItem(TICKET_STORAGE_KEY);
        }
    }

    if (ticketForm) {
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = ticketNameInput.value.trim();
            const phone = ticketPhoneInput.value.trim();
            if (!name) return;

            ticketGenerateBtn.disabled = true;
            const originalHTML = ticketGenerateBtn.innerHTML;
            ticketGenerateBtn.innerHTML = '<span>A gerar...</span>';

            // Try to insert with a few retries in case of code collision
            let ticket = null;
            for (let attempt = 0; attempt < 4 && !ticket; attempt++) {
                const code = generateTicketCode();
                ticket = await createTicket({ ticket_code: code, name, phone });
            }

            ticketGenerateBtn.disabled = false;
            ticketGenerateBtn.innerHTML = originalHTML;

            if (!ticket) {
                alert('Não foi possível gerar o ticket. Verifique a sua ligação e tente novamente.');
                return;
            }

            localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(ticket));
            renderTicket(ticket);
        });
    }

    if (ticketNewBtn) {
        ticketNewBtn.addEventListener('click', () => {
            if (!confirm('Gerar um novo ticket? O ticket anterior continuará válido, mas este dispositivo passará a mostrar o novo.')) return;
            localStorage.removeItem(TICKET_STORAGE_KEY);
            showTicketForm();
        });
    }

    function flashBtn(btn, msg) {
        const orig = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = msg;
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = orig;
        }, 1800);
    }

    if (ticketShareBtn) {
        ticketShareBtn.addEventListener('click', async () => {
            const code = ticketDisplayCode.textContent;
            const name = ticketDisplayName.textContent;
            const text = `Ticket de Brinde · Casamento Lisandra & Adilson\nTitular: ${name}\nCódigo: ${code}`;

            // Try Web Share (mobile) — HTTPS only
            if (navigator.share) {
                try { await navigator.share({ title: 'O meu Ticket · L & A', text }); return; }
                catch { /* user cancelled or blocked */ }
            }
            // Try Clipboard API — HTTPS only
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    flashBtn(ticketShareBtn, 'Copiado!');
                    return;
                } catch { /* fall through */ }
            }
            // Fallback: legacy execCommand (works on file://)
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                if (ok) flashBtn(ticketShareBtn, 'Copiado!');
                else alert('Copie manualmente:\n\n' + text);
            } catch {
                alert('Copie manualmente:\n\n' + text);
            }
        });
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    async function generateQrDataUrl(code, size) {
        if (!window.QRCode) throw new Error('QRCode library not loaded');
        if (typeof window.QRCode.toDataURL === 'function') {
            return await window.QRCode.toDataURL(code, {
                width: size,
                margin: 1,
                errorCorrectionLevel: 'M',
                color: { dark: '#4A2C2A', light: '#FDF8F3' }
            });
        }
        if (typeof window.QRCode.toCanvas === 'function') {
            const qrCanvas = document.createElement('canvas');
            await new Promise((resolve, reject) => {
                window.QRCode.toCanvas(qrCanvas, code, {
                    width: size,
                    margin: 1,
                    errorCorrectionLevel: 'M',
                    color: { dark: '#4A2C2A', light: '#FDF8F3' }
                }, (err) => err ? reject(err) : resolve());
            });
            return qrCanvas.toDataURL('image/png');
        }
        throw new Error('QRCode API not available');
    }

    async function buildTicketExportCanvas(code, name, dateStr) {
        const w = 720, h = 1000;
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#FDF8F3';
        ctx.fillRect(0, 0, w, h);

        // Card border
        ctx.strokeStyle = '#A47764';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 40, w - 80, h - 80);

        // Header band
        ctx.fillStyle = '#4A2C2A';
        ctx.fillRect(40, 40, w - 80, 130);

        ctx.fillStyle = '#FDF8F3';
        ctx.font = '600 52px "Cormorant Garamond", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('L & A', w / 2, 95);
        ctx.font = '14px "Montserrat", Arial, sans-serif';
        ctx.fillStyle = '#F5E6D3';
        ctx.fillText('CASAMENTO · 15 AGOSTO 2026', w / 2, 140);

        // Section label
        ctx.fillStyle = '#A47764';
        ctx.font = '400 13px "Montserrat", Arial, sans-serif';
        ctx.fillText('TICKET DE BRINDE', w / 2, 210);

        // QR — regenerate via toDataURL (most compatible) then draw
        const qrSize = 340;
        try {
            const qrDataUrl = await generateQrDataUrl(code, qrSize);
            const qrImg = await loadImage(qrDataUrl);
            ctx.drawImage(qrImg, (w - qrSize) / 2, 250, qrSize, qrSize);
        } catch (err) {
            console.warn('QR generation failed, drawing fallback:', err);
            ctx.strokeStyle = '#A47764';
            ctx.lineWidth = 2;
            ctx.strokeRect((w - qrSize) / 2, 250, qrSize, qrSize);
            ctx.fillStyle = '#4A2C2A';
            ctx.font = '600 24px "Courier New", monospace';
            ctx.fillText(code, w / 2, 420);
            ctx.font = '14px "Montserrat", Arial, sans-serif';
            ctx.fillStyle = '#A47764';
            ctx.fillText('(mostre este código no evento)', w / 2, 460);
        }

        // Titular
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#A47764';
        ctx.font = '400 12px "Montserrat", Arial, sans-serif';
        ctx.fillText('TITULAR', w / 2, 650);

        ctx.fillStyle = '#4A2C2A';
        ctx.font = '400 30px "Cormorant Garamond", Georgia, serif';
        ctx.fillText(name, w / 2, 685);

        // Código
        ctx.fillStyle = '#A47764';
        ctx.font = '400 12px "Montserrat", Arial, sans-serif';
        ctx.fillText('CÓDIGO', w / 2, 730);

        ctx.font = '600 40px "Courier New", monospace';
        ctx.fillStyle = '#8B6152';
        ctx.fillText(code, w / 2, 780);

        // Data
        ctx.font = '13px "Montserrat", Arial, sans-serif';
        ctx.fillStyle = '#9B8578';
        ctx.fillText('Emitido em ' + dateStr, w / 2, 820);

        // Divider (perforation)
        ctx.strokeStyle = 'rgba(164,119,100,0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(80, 860); ctx.lineTo(w - 80, 860);
        ctx.stroke();
        ctx.setLineDash([]);

        // Footer text
        ctx.font = 'italic 18px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#6B4D3E';
        ctx.fillText('Apresente este ticket no evento', w / 2, 908);
        ctx.fillText('para levantar o seu brinde', w / 2, 938);

        return canvas;
    }

    if (ticketDownloadBtn) {
        ticketDownloadBtn.addEventListener('click', async () => {
            ticketDownloadBtn.disabled = true;
            const origHTML = ticketDownloadBtn.innerHTML;
            ticketDownloadBtn.innerHTML = 'A gerar...';

            try {
                const canvas = await buildTicketExportCanvas(
                    ticketDisplayCode.textContent,
                    ticketDisplayName.textContent,
                    ticketDisplayDate.textContent
                );
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `ticket-${ticketDisplayCode.textContent}.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                flashBtn(ticketDownloadBtn, 'Descarregado!');
            } catch (err) {
                console.error('Download error:', err);
                alert('Não foi possível gerar a imagem. Tente fazer um screenshot ao ticket.');
                ticketDownloadBtn.innerHTML = origHTML;
            } finally {
                ticketDownloadBtn.disabled = false;
                if (ticketDownloadBtn.innerHTML === 'A gerar...') {
                    ticketDownloadBtn.innerHTML = origHTML;
                }
            }
        });
    }

    // ========================================
    // PWA - Install App (Android + iOS)
    // ========================================

    const installBanner = document.getElementById('installBanner');
    const installBtn = document.getElementById('installBtn');
    const installClose = document.getElementById('installClose');
    const iosInstallModal = document.getElementById('iosInstallModal');
    const iosInstallClose = document.getElementById('iosInstallClose');

    let deferredPrompt = null;
    const DISMISS_KEY = 'wedding_install_dismissed';
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    function showInstallBanner() {
        if (isStandalone) return;
        if (localStorage.getItem(DISMISS_KEY)) return;
        if (!installBanner) return;
        installBanner.style.display = 'flex';
        requestAnimationFrame(() => installBanner.classList.add('visible'));
    }

    function hideInstallBanner() {
        if (!installBanner) return;
        installBanner.classList.remove('visible');
        setTimeout(() => { installBanner.style.display = 'none'; }, 300);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(showInstallBanner, 5000);
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    localStorage.setItem(DISMISS_KEY, '1');
                }
                deferredPrompt = null;
                hideInstallBanner();
            } else if (isIOS) {
                iosInstallModal.style.display = 'flex';
                hideInstallBanner();
            }
        });
    }

    if (installClose) {
        installClose.addEventListener('click', () => {
            localStorage.setItem(DISMISS_KEY, '1');
            hideInstallBanner();
        });
    }

    if (iosInstallClose) {
        iosInstallClose.addEventListener('click', () => {
            iosInstallModal.style.display = 'none';
        });
    }

    if (iosInstallModal) {
        iosInstallModal.addEventListener('click', (e) => {
            if (e.target === iosInstallModal) iosInstallModal.style.display = 'none';
        });
    }

    // Show iOS banner (Safari has no beforeinstallprompt)
    if (isIOS && !isStandalone && !localStorage.getItem(DISMISS_KEY)) {
        setTimeout(showInstallBanner, 6000);
    }

    window.addEventListener('appinstalled', () => {
        localStorage.setItem(DISMISS_KEY, '1');
        hideInstallBanner();
        deferredPrompt = null;
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.warn('SW registration failed:', err);
            });
        });
    }

});
