/* ===== RivaUX — currículo ===== */

const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => img.classList.add('img-missing'));
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Revelação suave no scroll — mesmo padrão visual da Home.
 * - textos entram em sequência;
 * - cards surgem em cascata, da esquerda para a direita e depois para a linha seguinte;
 * - a animação acontece uma vez, preservando hover/sticky ao limpar transforms no final.
 *
 * A imagem do currículo NÃO entra nesta rotina: ela mantém sua animação 3D/fade própria.
 */
function initCurriculoReveal() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    const grupos = [];

    const hero = document.querySelector('.cv-hero');
    if (hero) {
        grupos.push({
            trigger: hero,
            itens: Array.from(hero.children),
            start: 'top 88%',
            stagger: 0.13,
            y: 26
        });
    }

    const showcase = document.querySelector('.cv-showcase');
    const showcaseText = showcase?.querySelector(':scope > div:not(.cv-mockup)');
    if (showcase && showcaseText) {
        const h2 = showcaseText.querySelector('h2');
        const p = showcaseText.querySelector('p');
        const buttons = Array.from(showcaseText.querySelectorAll('.cv-buttons .btn-view-all'));
        const itens = [h2, p, ...buttons].filter(Boolean);

        grupos.push({
            trigger: showcase,
            itens,
            start: 'top 82%',
            stagger: 0.13,
            y: 26
        });
    }

    document.querySelectorAll('.cv-section').forEach((section) => {
        const titulo = section.querySelector('h3');
        const grid = section.querySelector('.skills-grid');
        const cards = grid ? Array.from(grid.children) : [];

        if (titulo) {
            grupos.push({
                trigger: section,
                itens: [titulo],
                start: 'top 88%',
                stagger: 0,
                y: 30
            });
        }

        if (grid && cards.length) {
            grupos.push({
                trigger: grid,
                itens: cards,
                start: 'top 88%',
                stagger: 0.13,
                y: 26
            });
        }
    });

    const backBox = document.querySelector('.cv-back-box');
    if (backBox) {
        grupos.push({
            trigger: backBox,
            itens: Array.from(backBox.children),
            start: 'top 88%',
            stagger: 0.13,
            y: 26
        });
    }

    const footer = document.querySelector('footer');
    if (footer) {
        grupos.push({
            trigger: footer,
            itens: Array.from(footer.children),
            start: 'top 94%',
            stagger: 0.13,
            y: 22
        });
    }

    grupos.forEach(({ trigger, itens, start, stagger, y }) => {
        if (!trigger || !itens.length) return;

        gsap.fromTo(
            itens,
            { opacity: 0, y },
            {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: 'power3.out',
                stagger,
                clearProps: 'transform',
                scrollTrigger: {
                    trigger,
                    start,
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });
}

/*
 * Animação do mockup do currículo.
 * Desktop:
 * - inicia deslocado para a região central, totalmente invisível;
 * - primeiro começa a sair do centro ainda com opacity 0;
 * - depois surge suavemente enquanto termina o deslocamento para a esquerda;
 * - ao rolar para cima, todo o processo é revertido pelo scrub.
 */
function initCurriculoMotion() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    const mockup = document.querySelector('.cv-mockup');
    const showcase = document.querySelector('.cv-showcase');
    if (!mockup || !showcase) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1101px)', () => {
        // Estado inicial: centralizado/deslocado para a direita e 100% oculto.
        gsap.set(mockup, {
            xPercent: 82,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 0.68,
            opacity: 0,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            transformOrigin: 'center center'
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: showcase,
                start: 'top 82%',
                end: 'center 38%',
                scrub: 1.15,
                invalidateOnRefresh: true
            }
        });

        // 1) Sai da região central ainda invisível.
        tl.to(mockup, {
            xPercent: 50,
            scale: 0.76,
            opacity: 0,
            ease: 'none',
            duration: 0.32
        });

        // 2) Começa o fade somente depois de já ter iniciado o deslocamento à esquerda.
        tl.to(mockup, {
            xPercent: 18,
            rotationX: 5,
            rotationY: 18,
            rotationZ: -2,
            scale: 0.9,
            opacity: 0.48,
            ease: 'none',
            duration: 0.28
        });

        // 3) Chega ao canto esquerdo totalmente visível e com o 3D final.
        tl.to(mockup, {
            xPercent: 0,
            rotationX: 10,
            rotationY: 35,
            rotationZ: -4,
            scale: 1,
            opacity: 1,
            boxShadow: '-30px 40px 70px rgba(0,0,0,0.8), -10px 0 30px rgba(0,194,255,0.2)',
            ease: 'none',
            duration: 0.4
        });

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
            gsap.set(mockup, { clearProps: 'transform,opacity,boxShadow' });
        };
    });

    // Tablet/mobile: mantém a entrada diagonal suave da versão anterior.
    mm.add('(max-width: 1100px)', () => {
        const tween = gsap.fromTo(
            mockup,
            {
                xPercent: -20,
                rotationZ: -12,
                rotationY: -15,
                opacity: 0,
                scale: 0.8
            },
            {
                xPercent: 0,
                rotationZ: 0,
                rotationY: 0,
                opacity: 1,
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: mockup,
                    start: 'top 88%',
                    end: 'center 55%',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            }
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(mockup, { clearProps: 'transform,opacity' });
        };
    });
}

function initCurriculoPage() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    initCurriculoReveal();
    initCurriculoMotion();

    // Recalcula os pontos depois que imagens/fontes terminarem de carregar.
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurriculoPage, { once: true });
} else {
    initCurriculoPage();
}
