const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value.trim();

    if (!inpWord) {
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return;
    }

    fetch(`${url}${inpWord}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then((data) => {
            const wordData = data[0];
            const phonetics = wordData.phonetics.find(p => p.audio) || {};
            const audioSrc = phonetics.audio ? phonetics.audio : null;

            // Creating a list of all meanings and definitions
            let meaningsHTML = "";
            wordData.meanings.forEach(meaning => {
                meaningsHTML += `
                    <div class="meaning-block">
                        <p><strong>${meaning.partOfSpeech}</strong></p>
                        ${meaning.definitions.map(def => `
                            <p><em>Definition:</em> ${def.definition}</p>
                            ${def.example ? `<p><em>Example:</em> ${def.example}</p>` : ''}
                        `).join('')}
                    </div>`;
            });

            result.innerHTML = `
                <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()" ${audioSrc ? '' : 'disabled'}>
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${wordData.phonetic || ''}</p>
                </div>
                ${meaningsHTML}`;

            if (audioSrc) {
                sound.setAttribute("src", audioSrc);
            } else {
                sound.removeAttribute("src");
            }
        })
        .catch(() => {
            result.innerHTML = `<h3 class="error">Couldn't find the word</h3>`;
        });
});

function playSound() {
    if (sound.getAttribute("src")) {
        sound.play();
    }
}

// JavaScript for Dark Mode / Light Mode Toggle
const toggleButton = document.getElementById('toggle-theme');

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
    }
    localStorage.setItem('theme', theme);
});