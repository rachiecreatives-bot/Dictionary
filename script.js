const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");

const btn  = document.getElementById("search-btn");

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
            const audioSrc = phonetics.audio ? `https:${phonetics.audio}` : null;

            result.innerHTML = `
                <div class="word">
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()" ${audioSrc ? '' : 'disabled'}>
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                </div>
                <div class="details">
                    <p>${wordData.meanings[0].partOfSpeech}</p>
                    <p>${wordData.phonetic || ''}</p>
                </div>
                <p class="word-meaning">
                    ${wordData.meanings[0].definitions[0].definition}
                </p>            
                <p class="word-example">
                    ${wordData.meanings[0].definitions[0].example || ""}
                </p>`;

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
