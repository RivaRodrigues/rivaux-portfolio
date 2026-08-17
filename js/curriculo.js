/* ===== RivaUX — currículo ===== */

document.getElementById('ano').textContent = new Date().getFullYear();
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => img.classList.add('img-missing'));
        });
