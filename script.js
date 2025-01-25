const epsilon = 0.5;
const ads = [
    { id: 'ad1', clicks: 0, ignored: 0, views: 0 },
    { id: 'ad2', clicks: 0, ignored: 0, views: 0 },
    { id: 'ad3', clicks: 0, ignored: 0, views: 0 },
    { id: 'ad4', clicks: 0, ignored: 0, views: 0 }
];

const adContainers = document.querySelectorAll('.ad-container');
const ignoreButtons = document.querySelectorAll('.ignore');

function selectAd() {
    if (Math.random() < epsilon) {
        // Eksploracja - losowy wybór
        return ads[Math.floor(Math.random() * ads.length)];
    } else {
        // Eksploatacja - wybór najlepszego wariantu
        let bestAd = ads[0];
        for (let i = 1; i < ads.length; i++) {
            const currentAd = ads[i];
            const currentCTR = currentAd.clicks / currentAd.views;
            const bestCTR = bestAd.clicks / bestAd.views;
            if (currentCTR > bestCTR) {
                bestAd = currentAd;
            }
        }
        return bestAd;
    }
}

function updateStatistics() {
    ads.forEach(ad => {
        const clicksElement = document.getElementById(`${ad.id}-clicks`);
        const ignoredElement = document.getElementById(`${ad.id}-ignored`);
        clicksElement.textContent = ad.clicks;
        ignoredElement.textContent = ad.ignored;
    });
}

adContainers.forEach(container => {
    container.addEventListener('click', () => {
        const selectedAd = ads.find(ad => ad.id === container.id.replace('-container', ''));
        selectedAd.clicks++;
        selectedAd.views++;
        updateStatistics();
    });
});

ignoreButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const adContainer = adContainers[index];
        const selectedAd = ads[index];
        selectedAd.ignored++;
        adContainer.style.opacity = 0; // Zniknięcie reklamy
        setTimeout(() => {
            adContainer.style.opacity = 1; // Przywrócenie reklamy po 3 sekundach
        }, 3000);
        updateStatistics();
    });
});

// Początkowe ustawienie
setInterval(() => {
    const selectedAd = selectAd();
    selectedAd.views++;
    updateStatistics();
}, 2000);
