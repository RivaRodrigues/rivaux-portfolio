/* ===== RivaUX — comportamento das páginas de case ===== */

window.addEventListener('DOMContentLoaded', () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById('ano').textContent = new Date().getFullYear();
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => img.classList.add('img-missing'));
        });

        if (typeof Lenis !== 'undefined' && !reduceMotion) {
            const lenis = new Lenis({ duration: 1.2 });
            const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }

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
            if (!ham.classList.contains('ham-active')) {
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

        // --- CASCATA DE ENTRADA (IntersectionObserver: esta pagina nao carrega o ScrollTrigger) ---
        const grupos = document.querySelectorAll('.reveal-cascade');
        if (grupos.length) {
            if (reduceMotion) {
                grupos.forEach(g => Array.from(g.children).forEach(f => f.style.opacity = 1));
            } else {
                grupos.forEach(g => Array.from(g.children).forEach(f => {
                    f.style.opacity = '0';
                    f.style.transform = 'translateY(26px)';
                    f.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                }));
                const obs = new IntersectionObserver((entradas, o) => {
                    entradas.forEach(e => {
                        if (!e.isIntersecting) return;
                        Array.from(e.target.children).forEach((filho, i) => {
                            setTimeout(() => {
                                filho.style.opacity = '1';
                                filho.style.transform = 'none';
                            }, i * 130);
                        });
                        o.unobserve(e.target);
                    });
                }, { threshold: 0.15 });
                grupos.forEach(g => obs.observe(g));
            }
        }

        // --- CONTADOR DOS CARDS DE RESULTADO ---
        const contadores = document.querySelectorAll('[data-contador]');
        if (contadores.length) {
            const anima = (el) => {
                const alvo = parseInt(el.dataset.contador, 10);
                const prefixo = el.dataset.prefixo || '';
                const sufixo = el.dataset.sufixo ? ` <span class="unidade">${el.dataset.sufixo}</span>` : '';
                if (reduceMotion) { el.innerHTML = prefixo + alvo + sufixo; return; }

                const duracao = 1400, inicio = performance.now();
                const passo = (agora) => {
                    const t = Math.min((agora - inicio) / duracao, 1);
                    const suave = 1 - Math.pow(1 - t, 3); // desacelera no fim
                    el.innerHTML = prefixo + Math.round(alvo * suave) + sufixo;
                    if (t < 1) requestAnimationFrame(passo);
                };
                el.innerHTML = prefixo + '0' + sufixo;
                requestAnimationFrame(passo);
            };
            const obsNum = new IntersectionObserver((entradas, o) => {
                entradas.forEach(e => {
                    if (!e.isIntersecting) return;
                    anima(e.target);
                    o.unobserve(e.target);
                });
            }, { threshold: 0.6 });
            contadores.forEach(c => obsNum.observe(c));
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
    });
