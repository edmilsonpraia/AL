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
            `Pergunte-me sobre o dresscode, a galeria de fotos, ou como instalar a app!`,

            `Não tenho a certeza se entendi. Posso ajudar com:\n- Data e hora do casamento\n- Local e como chegar\n- Dresscode\n- Galeria (partilhar fotos e vídeos)\n- Instalar como app\n\nO que gostaria de saber?`
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
