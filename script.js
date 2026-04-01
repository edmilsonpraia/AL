// ========================================
// Lisandra & Adilson - Wedding Website JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Floating Hearts in Hero ----
    const heroHearts = document.querySelector('.hero-hearts');
    if (heroHearts) {
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.innerHTML = ['&#9829;', '&#10084;', '&#9825;'][Math.floor(Math.random() * 3)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (0.6 + Math.random() * 1.2) + 'rem';
            heart.style.animationDuration = (8 + Math.random() * 12) + 's';
            heart.style.animationDelay = (Math.random() * 10) + 's';
            heroHearts.appendChild(heart);
        }
    }

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

    // ---- Countdown Timer ----
    const weddingDate = new Date('2026-08-15T15:30:00').getTime();
    let prevSeconds = -1;

    function updateCountdown() {
        const now = Date.now();
        const diff = weddingDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');

        const secEl = document.getElementById('seconds');
        secEl.textContent = String(seconds).padStart(2, '0');

        if (seconds !== prevSeconds) {
            secEl.classList.remove('tick');
            void secEl.offsetWidth;
            secEl.classList.add('tick');
            prevSeconds = seconds;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ---- Copy IBAN ----
    const copyBtn = document.getElementById('copyIban');
    const ibanNumber = document.getElementById('ibanNumber');

    if (copyBtn && ibanNumber) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(ibanNumber.textContent.trim());
                copyBtn.classList.add('copied');
                copyBtn.querySelector('span').textContent = 'Copiado!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('span').textContent = 'Copiar';
                }, 2000);
            } catch {
                const range = document.createRange();
                range.selectNodeContents(ibanNumber);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                document.execCommand('copy');
                sel.removeAllRanges();
                copyBtn.querySelector('span').textContent = 'Copiado!';
                setTimeout(() => {
                    copyBtn.querySelector('span').textContent = 'Copiar';
                }, 2000);
            }
        });
    }

    // ---- Confetti Effect ----
    function launchConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#A47764', '#F5E6D3', '#C4A08E', '#8B6152', '#4A2C2A', '#e8c8b8'];
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            piece.style.animationDelay = (Math.random() * 0.8) + 's';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), 5000);
    }

    // ---- RSVP Form ----
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                guests: document.getElementById('guests').value,
                attendance: document.getElementById('attendance').value,
                message: document.getElementById('message').value
            };

            const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            rsvps.push({ ...formData, date: new Date().toISOString() });
            localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

            rsvpForm.style.display = 'none';
            rsvpSuccess.style.display = 'block';
            rsvpSuccess.style.animation = 'fadeInUp 0.6s ease forwards';

            if (formData.attendance === 'sim') {
                launchConfetti();
            }
        });
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
        diaSemana: 'Sabado',
        horaCerimonia: '15:30',
        local: 'Estaleiro Imbondeiro',
        endereco: 'Gleba GU22 - Zona ZR2B, Talatona, Luanda',
        cerimonia: 'Cerimonia civil as 15:30 seguida do copo d\'agua',
        versiculo: '"Onde voce for, irei; onde voce ficar, ficarei." - Rute 1:16',
        dresscode: 'Traje elegante/formal. As cores do casamento sao Champagne, Mocha Mousse e Espresso (tons terrosos e elegantes).',
        presentes: 'Ha lista de presentes em loja fisica ou online, ou podem contribuir para a lua de mel por IBAN.',
        confirmar: 'Podem confirmar a presenca ate 15 de Julho de 2026, preenchendo o formulario na seccao "Confirmar Presenca" do site.',
        estacionamento: 'O Estaleiro Imbondeiro dispoe de estacionamento para os convidados.',
        criancas: 'Sim, as criancas sao bem-vindas ao casamento!',
    };

    const RESPONSES = [
        {
            keywords: ['ola', 'oi', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
            reply: () => `Ola! Bem-vindo ao casamento de ${WEDDING_DATA.noivos}! Estou aqui para ajudar com qualquer duvida sobre o grande dia. O que gostaria de saber?`
        },
        {
            keywords: ['quando', 'data', 'dia', 'que dia', 'quando e'],
            reply: () => `O casamento sera no dia ${WEDDING_DATA.data} (${WEDDING_DATA.diaSemana}). A cerimonia civil comeca as ${WEDDING_DATA.horaCerimonia}.`
        },
        {
            keywords: ['hora', 'horario', 'horas', 'que horas', 'comeca'],
            reply: () => `A cerimonia civil comeca as ${WEDDING_DATA.horaCerimonia}, seguida do copo d'agua. Recomendamos chegar com 15-20 minutos de antecedencia.`
        },
        {
            keywords: ['onde', 'local', 'endereco', 'morada', 'localizacao', 'lugar', 'sitio'],
            reply: () => `O casamento sera no ${WEDDING_DATA.local}, localizado em ${WEDDING_DATA.endereco}. Pode ver a localizacao no mapa na seccao "Cerimonia" do site.`
        },
        {
            keywords: ['roupa', 'vestir', 'dress', 'traje', 'dresscode', 'codigo'],
            reply: () => WEDDING_DATA.dresscode
        },
        {
            keywords: ['presente', 'prenda', 'oferecer', 'lista', 'gift'],
            reply: () => WEDDING_DATA.presentes
        },
        {
            keywords: ['iban', 'transferencia', 'contribui', 'dinheiro', 'lua de mel', 'honeymoon'],
            reply: () => `Podem contribuir para a lua de mel dos noivos por transferencia bancaria. O IBAN esta disponivel na seccao "Presentes" do site. Muito obrigado pela generosidade!`
        },
        {
            keywords: ['confirmar', 'confirmacao', 'rsvp', 'presenca'],
            reply: () => WEDDING_DATA.confirmar
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
            reply: () => `${WEDDING_DATA.cerimonia}. Apos a cerimonia, teremos uma celebracao com jantar, musica e muita alegria!`
        },
        {
            keywords: ['versiculo', 'biblia', 'frase', 'rute', 'citacao'],
            reply: () => `O versiculo escolhido pelos noivos e: ${WEDDING_DATA.versiculo}. Uma bela promessa de amor e companheirismo.`
        },
        {
            keywords: ['noivos', 'quem', 'casal', 'lisandra', 'adilson'],
            reply: () => `Os noivos sao ${WEDDING_DATA.noivos}! Um casal que decidiu unir as suas vidas e celebrar o seu amor no dia ${WEDDING_DATA.data}.`
        },
        {
            keywords: ['obrigado', 'obrigada', 'agradeco', 'thanks'],
            reply: () => `De nada! E um prazer ajudar. Se tiver mais alguma duvida, estou aqui. Nos vemos no casamento!`
        },
        {
            keywords: ['musica', 'danca', 'dancar', 'dj', 'banda'],
            reply: () => `Havera musica e danca durante a celebracao apos a cerimonia! Preparem-se para uma noite de muita alegria e diversao.`
        },
        {
            keywords: ['menu', 'comida', 'jantar', 'comer', 'refeicao', 'alergia', 'vegetariano'],
            reply: () => `O jantar sera servido durante o copo d'agua apos a cerimonia. Se tiver alguma restricao alimentar ou alergia, por favor indique no formulario de confirmacao.`
        },
        {
            keywords: ['taxi', 'uber', 'transporte', 'como chegar', 'ir'],
            reply: () => `O ${WEDDING_DATA.local} fica em ${WEDDING_DATA.endereco}. Pode usar taxi, Uber ou viatura propria. Ha estacionamento no local.`
        },
        {
            keywords: ['foto', 'fotografia', 'fotografo', 'camera'],
            reply: () => `Havera fotografo profissional no casamento! Sintam-se a vontade para tirar fotos tambem e partilhar este momento especial com os noivos.`
        },
        {
            keywords: ['amor', 'love', 'felicidade', 'parabens'],
            reply: () => `Obrigado pelas palavras de carinho! ${WEDDING_DATA.noivos} ficam muito felizes com o vosso apoio e amor. ${WEDDING_DATA.versiculo}`
        },
        {
            keywords: ['falta', 'quanto falta', 'contagem', 'countdown'],
            reply: () => {
                const diff = new Date('2026-08-15T15:30:00').getTime() - Date.now();
                if (diff <= 0) return 'O grande dia ja chegou!';
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
            `Obrigado pela pergunta! Para informacoes sobre o casamento de ${WEDDING_DATA.noivos}:\n\n` +
            `- Data: ${WEDDING_DATA.data}\n- Hora: ${WEDDING_DATA.horaCerimonia}\n- Local: ${WEDDING_DATA.local}, ${WEDDING_DATA.endereco}\n\n` +
            `Pergunte-me sobre presentes, dresscode, confirmacao, ou qualquer outro detalhe!`,

            `Nao tenho a certeza se entendi. Posso ajudar com:\n- Data e hora do casamento\n- Local e como chegar\n- Dresscode\n- Presentes e IBAN\n- Confirmacao de presenca\n\nO que gostaria de saber?`
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
                addBotMessage(`Ola! Sou a Love IA, assistente do casamento de ${WEDDING_DATA.noivos}! Estou aqui para responder todas as suas duvidas sobre o grande dia. Pergunte-me o que quiser!`);
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

});
