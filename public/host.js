const roomId = window.location.pathname.split('/host/')[1]; 
if (roomId) {
    fetch(`/host/${roomId}`)
        .then(response => {
            if (!response.ok) throw new Error('Game room not found');
            return response.json();
        })
        .then(gameData => {
            teams = gameData.teams || [];
            wordBank = gameData.wordBank || [];
            usedWords = gameData.usedWords || [];
            currentTeamIndex = gameData.currentTeamIndex || 0;
        })
        .catch(error => {
            console.error('Error fetching game room:', error);
            alert('Error fetching game room: ' + error.message);
        });
}

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

const getWrappedIndex = (arr, index) => {
    return ((index % arr.length) + arr.length) % arr.length;
}

const colors = ["65, 105, 225", "220, 20, 60", "255, 215, 0", "34, 139, 34", "128, 0, 128"]

const startButton = utils.createButton(document.createTextNode("Start"));
startPage.append(startButton);
startButton.addEventListener("click", (e) => {
    // TELL THE SERVER THAT ALL CODE.JS's SHOULD DO THIS:
    // CreateTeamInput()
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
    
    const finishbutton = utils.createButton(document.createTextNode("Finish"));
    teamPageDiv.append(teamscont)
    document.body.append(teamPageDiv)
    teamPageDiv.classList.add("teamPageDiv")

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

const createTeam = (input) => {
    const newteam = new team(input, colors[getWrappedIndex(colors, teams.length)], 0, [], []);
    teams.push(newteam);
    
    updateteamlist();
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
