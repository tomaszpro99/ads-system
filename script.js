const epsilon = 0.5; // Ustalona wartość ε (eksploracja 50% przypadków)
const ads = [
    { id: 'ad1', clicks: 0, ignored: 0, views: 0 },
    { id: 'ad2', clicks: 0, ignored: 0, views: 0 },
    { id: 'ad3', clicks: 0, ignored: 0, views: 0 },
    { id: 'ad4', clicks: 0, ignored: 0, views: 0 }
];

const adContainers = document.querySelectorAll('.ad-container');
const ignoreButtons = document.querySelectorAll('.ignore');
const removeOnClickCheckbox = document.getElementById('removeOnClick');

// Funkcja wybierająca reklamę na podstawie ε-Greedy
function selectAd() {
    if (Math.random() < epsilon) {
        // Eksploracja - wybór losowej reklamy
        return ads[Math.floor(Math.random() * ads.length)];
    } else {
        // Eksploatacja - wybór najlepszej reklamy na podstawie CTR (Click Through Rate)
        return ads.reduce((bestAd, currentAd) => {
            const bestCTR = bestAd.views > 0 ? bestAd.clicks / bestAd.views : 0;
            const currentCTR = currentAd.views > 0 ? currentAd.clicks / currentAd.views : 0;
            return currentCTR > bestCTR ? currentAd : bestAd;
        });
    }
}

// Aktualizacja statystyk na stronie
function updateStatistics() {
    ads.forEach(ad => {
        const clicksElement = document.getElementById(`${ad.id}-clicks`);
        const ignoredElement = document.getElementById(`${ad.id}-ignored`);
        clicksElement.textContent = ad.clicks;
        ignoredElement.textContent = ad.ignored;
    });
}

// Funkcja pokazująca wszystkie reklamy na początku
function showAllAds() {
    adContainers.forEach(container => {
        container.style.opacity = 1; // Wszystkie reklamy są widoczne
        container.style.pointerEvents = "auto"; // Możliwość klikania
        container.classList.remove('highlight'); // Usuwamy obramowanie z poprzedniej wyróżnionej reklamy
    });
}

// Funkcja wyświetlająca jedną reklamę zgodnie z ε-Greedy i dodająca obramowanie do wyróżnionej
function displayAd() {
    // Ukryj wszystkie reklamy
    adContainers.forEach(container => {
        container.style.opacity = 0;
        container.style.pointerEvents = "none"; // Wyłącz możliwość klikania w ukryte reklamy
        container.classList.remove('highlight'); // Usuwamy obramowanie z poprzedniej wyróżnionej reklamy
    });

    // Wybór jednej reklamy na podstawie ε-Greedy
    const selectedAd = selectAd();
    const adContainer = document.getElementById(`${selectedAd.id}-container`);
    adContainer.style.opacity = 1;
    adContainer.style.pointerEvents = "auto"; // Przywrócenie interakcji
    adContainer.classList.add('highlight'); // Dodajemy obramowanie do wyróżnionej reklamy
    selectedAd.views++; // Zwiększamy licznik wyświetleń dla tej reklamy
    updateStatistics();
}

// Obsługa kliknięcia reklamy
adContainers.forEach((container, index) => {
    container.addEventListener('click', () => {
        const selectedAd = ads[index];
        selectedAd.clicks++;
        selectedAd.views++;
        updateStatistics();

        // Sprawdzenie, czy reklama ma zniknąć po kliknięciu
        if (removeOnClickCheckbox.checked) {
            container.style.opacity = 0; // Zniknięcie reklamy
            setTimeout(() => {
                container.style.opacity = 1; // Przywrócenie reklamy po 3 sekundach
            }, 3000);
        }
    });
});

// Obsługa kliknięcia przycisku "Ignoruj"
ignoreButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Zapobiega dziedziczeniu kliknięcia przez kontener reklamy
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

// Uruchamianie wyświetlania reklamy co 5 sekund
setInterval(displayAd, 5000);

// Inicjalizacja - pokazanie wszystkich reklam na starcie
showAllAds();
