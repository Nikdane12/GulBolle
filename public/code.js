const roomId = window.location.pathname.split('/play/')[1]; 
if (roomId) {
    fetch(`/play/${roomId}`)
        .then(response => {
            if (!response.ok) throw new Error('Game room not found');
            return response.json();
        })
        .then(gameData => {
            teams = gameData.teams || [];
            wordBank = gameData.wordBank || [];
            usedWords = gameData.usedWords || [];
            currentTeamIndex = gameData.currentTeamIndex || 0;

            startGame();
        })
        .catch(error => {
            console.error('Error fetching game room:', error);
            alert('Error fetching game room: ' + error.message);
        });
}

const startGame = () => {
    console.log("Started!")
    createTeamPage();
};

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

const createButton = (text) => {
    const buttonElement = document.createElement("button");
    const buttonSpan = document.createElement("span");
    buttonSpan.classList.add("button_top");
    buttonElement.append(buttonSpan);
    buttonSpan.append(text);

    return buttonElement;
}

const getWrappedIndex = (arr, index) => {
    return ((index % arr.length) + arr.length) % arr.length;
}

const colors = ["65, 105, 225", "220, 20, 60", "255, 215, 0", "34, 139, 34", "128, 0, 128"]

const startButton = createButton(document.createTextNode("Start"));
startPage.append(startButton);
startButton.addEventListener("click", (e) => {
    createTeamPage();
});

class team {
    name = "default_team";
    color = "255, 0, 0";
    score = 0;
    correctWords;
    passWords;

    constructor(name, color, score, correctWords, passWords) {
        this.name = name;
        this.color = color;
        this.score = score;
        this.correctWords = correctWords;
        this.passWords = passWords;
    }
}

// FIX: remove default teams and words

const randomWords = [
    'apple','orange','banana','dog','cat','sun','moon','tree','book','happy','friend','green','water','run','jump','song','flower','smile','sleep','coffee'
];

const randomTeams = [
    "Dog team", "Cat team", "Fish team", "Bear team"
]

const gamemodes = [
    {name: "CHARADES", id: "char", 
        howto:`<div>How to play Charades...</div>
        <div class="title"> How to Act Out the Word </div>
        <span>‧ A player from the active team picks a word or phrase (without showing it).</span>
        <span>‧ They act it out silently using gestures and body movements. No talking, sounds, or spelling allowed.
        </span>
        <div class="title">Guessing</div>
        <span>‧ The acting player's teammates try to guess the word or phrase based on the actions.</span>
        <span>‧ They have 1 to 2 minutes to guess correctly before time runs out.</span>
        <div class="title">Scoring</div>
        <span>‧ If the team guesses correctly within the time limit, they earn 1 point.</span>
        <span>‧ If they don't guess in time, no points are awarded.</span>
        <span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    }, 
    {name: "ALIAS", id: "alias", 
        howto: `<div>How to play Alias...</div>
        <div class="title">How to Describe the Word</div>
        <span>‧ A player from the active team picks a word (without showing it).</span>
        <span>‧ They describe the word using synonyms, explanations, or clues, but cannot say the word itself or use direct translations.</span>
        <div class="title">Guessing</div>
        <span>‧ The acting player's teammates try to guess the word based on the description.</span>
        <span>‧ They have 1 to 2 minutes to guess as many words as possible before time runs out.</span>
        <div class="title">Scoring</div>
        <span>‧ The team earns 1 point for each correct guess within the time limit.</span>
        <span>‧ No points are awarded for incorrect guesses or skipped words.</span>
        <span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
        
    }, 
    {name: "Other", id: "other", 
        howto: `<div class="title">It's up to you to decide what to play this round.</div>`}
]

let currentMode = 0;
randomWords.forEach(element => {
    wordBank.push(element)
});

randomTeams.forEach((e, i) => {
    const newteam = new team(e, colors[getWrappedIndex(colors, i)], 0, [], []);
    teams.push(newteam);
})

const createTeamPage = () => {
    removeAllAndHide(startPage);

    const teamscont = document.createElement("div");
    teamscont.classList.add("teamscont");
    const inputcont = document.createElement("div");
    inputcont.classList.add("inputcont");
    const nameinput = document.createElement("input");
    nameinput.type = "text";
    nameinput.value = "default_team";
    const addbutton = createButton(document.createTextNode("Add Team"));
    const finishbutton = createButton(document.createTextNode("Finish"));
    inputcont.append(nameinput)
    inputcont.append(addbutton)
    inputcont.append(finishbutton)
    teamPageDiv.append(inputcont)
    teamPageDiv.append(teamscont)
    document.body.append(teamPageDiv)
    teamPageDiv.classList.add("teamPageDiv")

    const updateteamlist = () =>{
        removeAll(teamscont)
        teams.forEach((e, i) => {
            const teamdiv = document.createElement("div")
            teamdiv.classList.add("teamdiv")

            teamdiv.style.backgroundColor = `rgba(${e.color}, var(--backA))`
            teamdiv.style.borderColor = `rgba(${e.color}, var(--borderA))`

            const indexdiv = document.createElement("div")
            indexdiv.classList.add("indexdiv")
            indexdiv.append(document.createTextNode(`${i+1}.`))
            const teamname = document.createElement("div");
            teamname.classList.add("teamname")
            teamname.append(document.createTextNode(e.name))
            teamscont.append(teamdiv)
            teamdiv.append(indexdiv)
            teamdiv.append(teamname)
        });
    }
    updateteamlist();

    const createteam = () => {
        if(nameinput.value){
            const newteam = new team(nameinput.value, colors[getWrappedIndex(colors, teams.length)], 0, [], []);
            teams.push(newteam);
            nameinput.value = "";
        }
        else{
            openModal("Silly goose!", 
                "There isn't anything to input.", 
                null, () => {})
        }
        updateteamlist();
    }

    nameinput.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            createteam()
        }
    });

    addbutton.addEventListener("click", (e) => {
        createteam()
    });

    finishbutton.addEventListener("click", (e) => {
        if(teams.length == 0){
            openModal("Silly goose!", 
                "There aren't any teams.", 
                null, () => {})
        }
        else{
            createWordInputPage();
        }
        console.log("teams:", teams);
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
    const addbutton = createButton(document.createTextNode("Add Word"));
    const nextbutton = createButton(document.createTextNode("Next"));
    const finishbutton = createButton(document.createTextNode("Finish"));

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
                openModal("Warning!", 
                `The word you are attempting to add is already included in the word-bank. Are you sure you want to add a duplicate word?: ${wordinput.value}`, 
                () => {addWord()}, () => {failedWord()})
            }
            else{addWord()}
        }
        else{
            openModal("Silly goose!", 
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
            openModal("Silly goose!", 
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

        const startButton = createButton(document.createTextNode("Start"));

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
            const readyButton = createButton(document.createTextNode("Ready?"));
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

                nextgamemodeButton = createButton(document.createTextNode("Next Gamemode"))
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

            const correctButton = createButton(document.createTextNode("Correct"));
            buttonBox.append(correctButton);

            correctButton.addEventListener("click", (e) => {
                correctORpass("correct")
            });

            const passButton = createButton(document.createTextNode("Pass"))
            buttonBox.append(passButton);

            passButton.addEventListener("click", (e) => {
                correctORpass("pass")
            });

            const TESTtimeUpButton = createButton(document.createTextNode("Time's Up"))
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


const openModal = (header, text, confirmAct, cancelAct) => {
    const modalBACK = document.createElement("div");
    modalBACK.classList.add("modalBACK")

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const headerElement = document.createElement("div");
    headerElement.append(header);
    headerElement.classList.add("title");
    modal.append(headerElement)

    const textElement = document.createElement("div");
    textElement.append(text);
    modal.append(textElement)

    const buttonCont = document.createElement("div");
    buttonCont.classList.add("buttonCont");
    modal.append(buttonCont)
    
    modalBACK.append(modal)
    document.body.append(modalBACK)

    if(confirmAct){
        const confirmBut = createButton(document.createTextNode("Confirm"))
        buttonCont.append(confirmBut)

        confirmBut.addEventListener("click", (e) => {
            removeSelf([modalBACK])
            confirmAct()
        });
    }
    if(cancelAct){
        const cancelBut = createButton(document.createTextNode("Cancel"))
        buttonCont.append(cancelBut)

        cancelBut.addEventListener("click", (e) => {
            removeSelf([modalBACK])
            cancelAct()
        });
    }
}

const removeSelf = divs => {
    divs.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

const removeAll = div => {
    while(div.firstChild){div.removeChild(div.firstChild)};
}

const removeAllAndHide = div => {
    while(div.firstChild){div.removeChild(div.firstChild)};
    div.style.display = 'none';
}


// let x = setinterval(func, milsec)
// stopinterval(x)

