let allRadicals = [];

const formulaInput = document.getElementById("formula");
const chargeInput = document.getElementById("charge");
const question = document.getElementById("question");
const container = document.getElementById("container");
const button = document.getElementById("button");
let currentAnswer;
let currentIndex = 0;
let checked = false;

async function run() {
    let radicals = await loadJSON("radicals.json");

    let electropositive = [];
    let electronegative = [];

    for (let c of Object.keys(radicals)) {
        for (let v of Object.keys(radicals[c])) {
            for (let e of radicals[c][v]) {
                let radical = {
                    name: e.name,
                    formula: e.formula,
                    charge: c === "electropositive" ? "+" : "-",
                    valency: v === "monovalent" ? 1 : v === "divalent" ? 2 : v === "trivalent" ? 3 : 4,
                };
                allRadicals.push(radical);
                electropositive.push(e);
            }
        }
    }

    allRadicals = shuffle(allRadicals);
    console.log(allRadicals);

    newQuestion();
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

async function loadJSON(file) {
    let res = await fetch(file);
    let data = await res.json();
    return data;
}

function newQuestion() {
    let e = allRadicals[currentIndex];
    // let e = allRadicals[Math.floor(Math.random() * allRadicals.length)];
    question.innerHTML = e.name;
    formulaInput.value = "";
    chargeInput.value = "";
    formulaInput.focus();
    currentAnswer = e;

    console.log(currentIndex);
    currentIndex++;
}

chargeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        submit();
    }
});

function submit() {
    if (checked) {
        newQuestion();
        checked = false;
        container.classList = [];
        button.innerHTML = "Check";
    } else if (formulaInput.value === currentAnswer.formula && chargeInput.value === currentAnswer.valency + currentAnswer.charge) {
        console.log("CORRECT");
        console.log(currentAnswer.formula + " " + currentAnswer.valency + currentAnswer.charge);
        checked = true;
        container.classList = [];
        container.classList.add("correct");
        button.innerHTML = "Next";
    } else {
        console.log(currentAnswer.formula + " " + currentAnswer.valency + currentAnswer.charge);
        console.log("INCORRECT");
        container.classList = [];
        container.classList.add("incorrect");
    }
}

run();
