/* ===== RivaUX — comportamento da home ===== */

window.addEventListener('DOMContentLoaded', () => {
        // =====================================================================
        // CONFIGURAÇÃO — o único bloco que você precisa editar
        // =====================================================================
        const WHATSAPP = '5511939271712';
        const EMAIL = 'contato@rivaux.com.br';

        // ---------------------------------------------------------------------
        // ENVIO DO FORMULÁRIO — escolha UMA das duas opções e preencha
        //
        // Opção A) Web3Forms (recomendada: sem cadastro, 250 envios/mês grátis)
        //   1. Vá em web3forms.com, informe contato@rivaux.com.br
        //   2. Você recebe uma "access key" por e-mail
        //   3. Cole a chave em FORM_ACCESS_KEY e deixe o endpoint como está abaixo
        //      const FORM_ENDPOINT   = 'https://api.web3forms.com/submit';
        //      const FORM_ACCESS_KEY = 'cole-a-chave-aqui';
        //
        // Opção B) Formspree (formspree.io, 50 envios/mês grátis)
        //   1. Crie um formulário e copie o ID que aparece na URL
        //      const FORM_ENDPOINT   = 'https://formspree.io/f/SEU_ID';
        //      const FORM_ACCESS_KEY = '';
        //
        // Com os dois campos vazios, o formulário abre o programa de e-mail do
        // visitante com a mensagem pronta (funciona, mas converte menos).
        // ---------------------------------------------------------------------
        const FORM_ENDPOINT = '';
        const FORM_ACCESS_KEY = '';

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        document.getElementById('ano').textContent = new Date().getFullYear();

        // Imagem que ainda não foi enviada não mostra ícone quebrado
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => img.classList.add('img-missing'));
        });

        // --- PRELOADER ---
        const preloader = document.getElementById('preloader');
        const finishLoad = () => {
            if (reduceMotion || typeof gsap === 'undefined') {
                preloader.style.display = 'none';
            } else {
                gsap.to(preloader, { y: '-100%', duration: 0.8, ease: 'power4.inOut',
                    onComplete: () => preloader.style.display = 'none' });
            }
            initPlexus();
            initScrollAnimations();
            initHeroIntro();
            initTyping();
        };

        if (typeof gsap !== 'undefined' && !reduceMotion) {
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
            gsap.to('.loader-bar-fill', { width: '100%', duration: 0.9, onComplete: finishLoad });
        } else {
            finishLoad();
        }

        // --- SCROLL SUAVE (Lenis) ---
        if (typeof Lenis !== 'undefined' && !reduceMotion) {
            const lenis = new Lenis({ duration: 1.5 });
            if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
            const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
            document.querySelectorAll('a[href^="#"]').forEach(a => {
                a.addEventListener('click', (e) => {
                    const target = document.querySelector(a.getAttribute('href'));
                    if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -90 }); }
                });
            });
        }

        // --- MENU MOBILE ---
        const tempoAnimacaoMenu = 0.8;
        const ham = document.getElementById('hamburger'),
              overlay = document.getElementById('mobile-overlay'),
              logoCont = document.querySelector('.logo'),
              navBar = document.getElementById('main-nav');

        const moveOverlay = (top) => {
            if (typeof gsap !== 'undefined' && !reduceMotion) {
                gsap.to(overlay, { top, duration: tempoAnimacaoMenu, ease: 'power3.inOut' });
            } else {
                overlay.style.top = top;
            }
        };

        function fecharMenuMobile() {
            ham.classList.remove('ham-active');
            ham.setAttribute('aria-expanded', 'false');
            ham.setAttribute('aria-label', 'Abrir menu');
            moveOverlay('-100%');
            setTimeout(() => {
                navBar.classList.remove('nav-active-mobile');
                logoCont.classList.remove('hide-logo');
            }, tempoAnimacaoMenu * 800);
        }

        ham.addEventListener('click', () => {
            const abrindo = !ham.classList.contains('ham-active');
            if (abrindo) {
                ham.classList.add('ham-active');
                ham.setAttribute('aria-expanded', 'true');
                ham.setAttribute('aria-label', 'Fechar menu');
                navBar.classList.add('nav-active-mobile');
                logoCont.classList.add('hide-logo');
                moveOverlay('0%');
            } else {
                fecharMenuMobile();
            }
        });

        overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenuMobile));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && ham.classList.contains('ham-active')) fecharMenuMobile();
        });

        // --- TEXTO ROTATIVO DO HERO ---
        function initTyping() {
            if (reduceMotion || typeof gsap === 'undefined' || typeof TextPlugin === 'undefined') return;
            const palavras = ['SITES INSTITUCIONAIS', 'LANDING PAGES', 'SISTEMAS DE GESTÃO'];
            const tl = gsap.timeline({ repeat: -1 });
            palavras.forEach(p => {
                tl.add(gsap.timeline({ repeatDelay: 2 })
                    .to('#type-target', { text: p, duration: 1 })
                    .to('#type-target', { text: '', duration: 0.6, delay: 1.8 }));
            });
        }

        // --- REVELAÇÃO NO SCROLL ---
        // Elemento com .scroll-reveal aparece sozinho.
        // Se também tiver .cascade, quem aparece são os filhos, um depois do outro.
        function initScrollAnimations() {
            const alvos = document.querySelectorAll('.scroll-reveal');
            if (reduceMotion || typeof gsap === 'undefined') {
                alvos.forEach(el => {
                    el.style.opacity = 1;
                    Array.from(el.children).forEach(f => f.style.opacity = 1);
                });
                return;
            }

            alvos.forEach(el => {
                const cascata = el.classList.contains('cascade');
                const itens = cascata ? Array.from(el.children) : [el];
                if (!itens.length) return;

                gsap.fromTo(itens,
                    { opacity: 0, y: cascata ? 26 : 40 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.85, ease: 'power3.out',
                        stagger: cascata ? 0.13 : 0,
                        // limpa o transform no fim: elemento com transform ativo
                        // atrapalha o position:sticky do empilhamento no mobile
                        clearProps: 'transform',
                        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
                    });
            });
        }

        // --- CASCATA DE ENTRADA DA HERO (sem esperar scroll) ---
        function initHeroIntro() {
            if (reduceMotion || typeof gsap === 'undefined') return;
            gsap.from('.hero-content > *', {
                opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
                stagger: 0.14, clearProps: 'transform'
            });
        }

        // --- FUNDO ANIMADO (PLEXUS) ---
        function initPlexus() {
            if (reduceMotion) return;
            const canvas = document.getElementById('plexus-canvas');
            const ctx = canvas.getContext('2d');
            let pontos = [], frameId = null;

            function montar() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // menos partículas em telas pequenas: economiza bateria no celular
                const densidade = window.innerWidth < 768 ? 60000 : 35000;
                const total = Math.min(90, Math.floor(canvas.width * canvas.height / densidade));
                pontos = Array.from({ length: total }, () => ({
                    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 1.4, vy: (Math.random() - 0.5) * 1.4, s: 2.6
                }));
            }

            function desenhar() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < pontos.length; i++) {
                    const p = pontos[i];
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                    ctx.fillStyle = 'rgba(255,255,255,0.4)';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill();
                    // começa em i+1: cada par é desenhado uma vez, não duas
                    for (let j = i + 1; j < pontos.length; j++) {
                        const q = pontos[j];
                        const d = Math.hypot(p.x - q.x, p.y - q.y);
                        if (d < 170) {
                            ctx.strokeStyle = `rgba(0,194,255,${(1 - d / 180) * 0.35})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                        }
                    }
                }
                frameId = requestAnimationFrame(desenhar);
            }

            montar();
            desenhar();

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(montar, 200);
            });

            // pausa quando a aba sai de foco
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) { cancelAnimationFrame(frameId); frameId = null; }
                else if (!frameId) desenhar();
            });
        }

        // --- SUBLINHADO DO MENU ---
        const underline = document.getElementById('nav-underline');
        const navCenter = document.querySelector('.nav-center');
        if (navCenter && typeof gsap !== 'undefined') {
            navCenter.querySelectorAll('.magnetic-link').forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const rect = link.getBoundingClientRect(), parent = navCenter.getBoundingClientRect();
                    gsap.to(underline, { left: rect.left - parent.left, width: rect.width, opacity: 1, duration: 0.3 });
                });
            });
            navCenter.addEventListener('mouseleave', () => gsap.to(underline, { opacity: 0 }));
        }


        // --- ACORDEÕES: abertura suave, um aberto por vez ---
        // <details> não anima altura sozinho. Aqui o conteúdo é envolvido num
        // invólucro em tempo de execução e o GSAP anima a altura dele.
        (function acordeoes() {
            const itens = Array.from(document.querySelectorAll('details.faq-item, details.detalhe'));
            if (!itens.length) return;

            itens.forEach(item => {
                const resumo = item.querySelector('summary');
                const corpo = document.createElement('div');
                corpo.className = 'acc-corpo';
                while (resumo.nextSibling) corpo.appendChild(resumo.nextSibling);
                item.appendChild(corpo);
                if (!item.open) corpo.style.height = '0px';

                resumo.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (item.dataset.animando === '1') return;
                    item.open ? fechar(item) : abrir(item);
                });
            });

            const irmaosAbertos = (item) =>
                itens.filter(i => i !== item && i.open && i.parentElement === item.parentElement);

            function abrir(item) {
                irmaosAbertos(item).forEach(fechar);
                const corpo = item.querySelector('.acc-corpo');
                item.open = true;
                item.classList.remove('is-fechando');
                if (reduceMotion || typeof gsap === 'undefined') { corpo.style.height = 'auto'; return; }
                item.dataset.animando = '1';
                gsap.fromTo(corpo,
                    { height: 0, opacity: 0 },
                    { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out',
                      onComplete: () => { corpo.style.height = 'auto'; item.dataset.animando = '0'; } });
            }

            function fechar(item) {
                const corpo = item.querySelector('.acc-corpo');
                // troca o ícone já no início do fechamento, não no fim
                item.classList.add('is-fechando');
                if (reduceMotion || typeof gsap === 'undefined') {
                    corpo.style.height = '0px'; item.open = false; item.classList.remove('is-fechando'); return;
                }
                item.dataset.animando = '1';
                gsap.to(corpo, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut',
                    onComplete: () => {
                        item.open = false;
                        item.classList.remove('is-fechando');
                        item.dataset.animando = '0';
                    } });
            }
        })();

        // --- FORMULÁRIO ---
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');

        const dizer = (texto, tipo) => {
            status.textContent = texto;
            status.className = 'form-status' + (tipo ? ' is-' + tipo : '');
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form.website.value) return; // robô caiu na armadilha

            if (!form.checkValidity()) {
                dizer('Preencha nome, e-mail e mensagem para eu conseguir responder.', 'error');
                form.reportValidity();
                return;
            }

            const botao = form.querySelector('.btn-submit');
            const dados = {
                nome: form.nome.value.trim(),
                organizacao: form.organizacao.value.trim(),
                email: form.email.value.trim(),
                mensagem: form.mensagem.value.trim()
            };

            // Sem endpoint configurado: abre o e-mail do visitante já preenchido
            if (!FORM_ENDPOINT) {
                const assunto = `Contato pelo site — ${dados.organizacao || dados.nome}`;
                const corpo = `Nome: ${dados.nome}\nOrganização: ${dados.organizacao}\nE-mail: ${dados.email}\n\n${dados.mensagem}`;
                window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
                dizer('Abri seu programa de e-mail com a mensagem pronta. Se não abrir, escreva para ' + EMAIL + '.');
                return;
            }

            botao.disabled = true;
            dizer('Enviando…');
            try {
                // O serviço usa o campo "email" como responder-para, então a resposta
                // sai direto para o visitante quando você apertar Responder.
                const envio = {
                    ...dados,
                    subject: `Site RivaUX — ${dados.organizacao || dados.nome}`,
                    from_name: dados.nome
                };
                if (FORM_ACCESS_KEY) envio.access_key = FORM_ACCESS_KEY; // Web3Forms

                const resposta = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(envio)
                });
                if (!resposta.ok) throw new Error('Falha no envio');
                form.reset();
                dizer('Mensagem enviada. Respondo em até um dia útil.', 'ok');
            } catch (erro) {
                dizer('O envio falhou. Me chame no WhatsApp (wa.me/' + WHATSAPP + ') ou escreva para ' + EMAIL + '.', 'error');
            } finally {
                botao.disabled = false;
            }
        });
    });
