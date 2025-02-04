const startPage = document.getElementById("startPage");
const teamPageDiv = document.createElement("div");
const wordInputPage = document.createElement("div");
const gamePage = document.createElement("div");
const scoreBox = document.createElement("div")
const buttonBox = document.createElement("div");
buttonBox.classList.add("buttonBox");


let teams = []
let wordBank = []
let usedWords = []
let currentTeam;
let currentTeamIndex = 0;    

const createTeamInput = () => {
    removeAllAndHide(startPage);

    const inputcont = document.createElement("div");
    inputcont.classList.add("inputcont");
    const nameinput = document.createElement("input");
    nameinput.type = "text";
    nameinput.value = "default_team";
    const createbutton = createButton(document.createTextNode("Create Team"));
    inputcont.append(nameinput)
    inputcont.append(createbutton)
    teamPageDiv.append(inputcont)
    document.body.append(teamPageDiv)
    teamPageDiv.classList.add("teamPageDiv")

    const createteam = () => {
        if(nameinput.value){
            // TELL THE SERVER THAT HOST SHOULD DO THIS:
            // host.createTeam()
            nameinput.value = "";
        }
        else{
            utils.openModal("Silly goose!", 
                "There isn't anything to input.", 
                null, () => {})
        }
    }

    nameinput.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            createteam()
        }
    });

    createbutton.addEventListener("click", (e) => {
        createteam()
    });
}

const createWordInputPage = () => {
    removeAllAndHide(teamPageDiv);
    const inputcont = document.createElement("div");
    inputcont.classList.add("inputcont");
    const wordscont = document.createElement("div");
    wordscont.classList.add("wordscont")
    const wordinput = document.createElement("input");
    wordinput.type = "text";
    wordinput.value = "default_word"; 
    const addbutton = utils.createButton(document.createTextNode("Add Word"));
    const nextbutton = utils.createButton(document.createTextNode("Next"));
    const finishbutton = utils.createButton(document.createTextNode("Finish"));

    inputcont.append(wordinput)
    inputcont.append(addbutton)
    inputcont.append(nextbutton)
    inputcont.append(finishbutton)
    wordInputPage.append(inputcont)
    wordInputPage.append(wordscont)
    document.body.append(wordInputPage)

    

    const addtoWordList = word =>{
        const worddiv = document.createElement("div")
        worddiv.classList.add("worddiv");
        worddiv.append(document.createTextNode(word))
        wordscont.append(worddiv)

        // SENT WORDS TO HOST
    }

    const checkWord = () => {
        if(wordinput.value){
            let word = wordinput.value.toLowerCase()
            const addWord = () =>{
                wordBank.push(word)
                addtoWordList(word)
                console.log("word added", word);

                wordinput.value = "";
            }
            const failedWord = () => {
                console.log("word failed", word);
                wordinput.value = "";
            }
            if (wordBank.includes(wordinput.value.toLowerCase())){
                utils.openModal("Warning!", 
                `The word you are attempting to add is already included in the word-bank. Are you sure you want to add a duplicate word?: ${wordinput.value}`, 
                () => {addWord()}, () => {failedWord()})
            }
            else{addWord()}
        }
        else{
            utils.openModal("Silly goose!", 
                "There isn't anything to input.", 
                null, () => {})
        }
    }

    wordinput.addEventListener('keyup', event => {
        if (event.key === "Enter") {
            checkWord()
        }
    });

    addbutton.addEventListener("click", (e) => {
        checkWord()
    });

    nextbutton.addEventListener("click", (e) => {
        removeAll(wordscont)
    });

    finishbutton.addEventListener("click", (e) => {
        if(wordBank.length == 0){
            utils.openModal("Silly goose!", 
                "There aren't any words in the word-bank.", 
                null, () => {})
        }
        else{
            removeAll
            startGameMode(gamemodes[currentMode]);
        }
        console.log("wordbank:", wordBank);
    });
}

const startGameMode = (mode) => {
    if (mode) {
        removeAllAndHide(wordInputPage);

        currentTeam = teams[currentTeamIndex];
        removeAll(gamePage);
        const titlePage = document.createElement("div");
        titlePage.classList.add("titlepage");

        const startButton = utils.createButton(document.createTextNode("Start"));

        const titleElement = document.createElement("div");
        titleElement.classList.add("pageTitle");
        titleElement.append(mode.name);

        const howtoElement = document.createElement("div");
        howtoElement.classList.add("howtoElement")
        howtoElement.innerHTML = mode.howto;


        // FIX: INCLUDE HOW TO PLAY CHERADES INFO

        titlePage.append(titleElement);
        titlePage.append(howtoElement);
        titlePage.append(startButton);
        gamePage.append(titlePage);
        document.body.append(gamePage);
        

        startButton.addEventListener("click", (e) => {
            start();
        });

        const start = () => {
            removeSelf([startButton, howtoElement])
            removeAll(buttonBox)

            setTeam()
            const readyButton = utils.createButton(document.createTextNode("Ready?"));
            buttonBox.append(readyButton)
            gamePage.append(buttonBox);

            readyButton.addEventListener("click", (e) => {
                removeSelf([readyButton])
                // FIX: starttimer()
                displayWord();
                addbuttons();
                scoreBox.style.right = "25px";
                scoreBox.style.position = "absolute";
                teamDisplay.append(scoreBox)
                updateScore();
            });
        }

        let teamDisplay
        const setTeam = () => {
            if (teamDisplay) {removeSelf([teamDisplay]);}
            
            // FIX: SET TEAM COLOR/TEXT
            teamDisplay = document.createElement("div");

            const teamText = document.createElement("div");
            teamText.append(document.createTextNode(currentTeam.name));
            teamText.classList.add("teamText");
            teamDisplay.append(teamText);

            teamDisplay.classList.add("teamDisplay");
            gamePage.append(teamDisplay);
            // FIX: set theme color instead of individual elements
            teamDisplay.style.backgroundColor = `rgba(${currentTeam.color}, var(--backA))`;
            teamDisplay.style.borderColor = `rgba(${currentTeam.color}, var(--borderA))`
        }
        
        let currentWord
        const wordDisplay = document.createElement("div");
        wordDisplay.classList.add("wordDisplay");
        

        const displayWord = () => {
            gamePage.append(wordDisplay);
            removeAll(wordDisplay)
            let word = getRandomUnusedWord()

            const wordText = document.createElement("div");
            wordText.classList.add("tilt_anim");
            // FIX: wordText shouldnt have tilt class
            
            wordDisplay.append(wordText);

            if(word !== null){
                wordText.append(document.createTextNode(word))
                currentWord = word
            }
            else{
                wordText.append(document.createTextNode("OUT OF WORDS"))
                console.log("OUT OF WORDS");
                usedWords = [];
                removeAll(buttonBox);          

                nextgamemodeButton = utils.createButton(document.createTextNode("Next Gamemode"))
                nextgamemodeButton.addEventListener("click", (e) => {
                    currentMode++
                    startGameMode(gamemodes[currentMode]);
                });
                buttonBox.append(nextgamemodeButton);
            }
            return word
        }

        const addbuttons = () => {
            removeAll(buttonBox);

            const correctButton = utils.createButton(document.createTextNode("Correct"));
            buttonBox.append(correctButton);

            correctButton.addEventListener("click", (e) => {
                correctORpass("correct")
            });

            const passButton = utils.createButton(document.createTextNode("Pass"))
            buttonBox.append(passButton);

            passButton.addEventListener("click", (e) => {
                correctORpass("pass")
            });

            const TESTtimeUpButton = utils.createButton(document.createTextNode("Time's Up"))
            TESTtimeUpButton.style.marginLeft = "auto";
            buttonBox.append(TESTtimeUpButton);

            TESTtimeUpButton.addEventListener("click", (e) => {
                nextTeam()
            });

            gamePage.append(buttonBox);
        }

        const updateScore = () => {
            removeAll(scoreBox);
            scoreBox.append(currentTeam.score);
        }

        const nextTeam = () => {

            /*
            FIX: REQUIRES A READY PAGE!!!!!!!!!!!
            FIX: choose new word but dont add current to used
            */

            currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            currentTeam = teams[currentTeamIndex];
            setTeam();
            updateScore();
        }

        const correctORpass = (x) => {
            switch (x) {
                case "correct":
                    currentTeam.score ++
                    currentTeam.correctWords.push(currentWord)
                    break;
                case "pass":
                    currentTeam.score --
                    currentTeam.passWords.push(currentWord)
                    break;
                default:
                    console.log("Error in correct/pass buttons");
                    break;
            }
            updateScore()
            displayWord()
        }
    }
    else{
        endGame();
    }
    
}

const endGame = () => {

}

const getRandomUnusedWord = () => {
    if (usedWords.length !== wordBank.length) {
        let randomWord;
        do {
            randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
        } while (usedWords.includes(randomWord));

        usedWords.push(randomWord);
        return randomWord;
    }
    else {return null;}
};

