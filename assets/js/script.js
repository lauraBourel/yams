var playHtml = document.getElementById('play');
const desHtml = document.getElementsByClassName('des');
let nbClick = 0;
var nbClickMax = 3;
let playerInPlay = 1;
var desValue = [];

const useTest = false;
const testValue = [4, 1, 1, 3, 6];


/**
 * initialise le jeu :
 * - systeme de selection du des
 * - click sur le bouton play
 */
const init = () => {
    // ? CLIQUE SUR LES DES
    for (let i = 0; i < desHtml.length; i++) {
        desHtml[i].addEventListener('click', () => {
            desHtml[i].classList.toggle('selected');
        });
    }

    // ? CLIQUE SUR PLAY
    playHtml.addEventListener('click', generateRandomNumber);

    // ? CLIQUE SUR LE TABLEAU DE SCORE
    for (let playerId = 1; playerId < 6; playerId++) {
        const pScores = document.getElementsByClassName('P' + playerId);
        for (let i = 0; i < pScores.length; i++) {
            pScores[i].addEventListener('click', () => registerScore(playerId, i));
        }
    }
}

/** Genere un nombre aleatoire pour chaque des qui n est pas selectionner */
const generateRandomNumber = () => {
    // annule la fonction si il a epuiser ses chances
    if (nbClick >= nbClickMax) return;

    // ? GENERE DES ALEATOIRE SI DES NON SELECTIONNER
    for (let i = 0; i < 5; i++) {
        if (!desHtml[i].classList.contains('selected')) {
            let randomNumber = 0;
            if (useTest) {
                randomNumber = testValue[i]
            } else {
                randomNumber = Math.floor(Math.random() * 6) + 1;
            }
            desValue[i] = randomNumber;
            desHtml[i].innerHTML = `<img src="assets/img/de${randomNumber}.png" alt="dé ${randomNumber}">`;
        }
    }


    console.log(desValue);

    // ? GESTION DU TOUR
    nbClick++;
    if (nbClick == 3) {
        playHtml.innerHTML = 'Rejouer';
    }
}

/**
 * Enregistre le score des dés actuel en foncion de la combinaison choisie
 * @param {number} player id du joueur qui enregistre un score 
 * @param {number} row id de la case cliquer
 * @returns
 */
const registerScore = (player, row) => {
    // annule la fonction si le joueur n'a pas encore lancer les des ou si le joueur ne correspond pas
    if (nbClick === 0 || player != playerInPlay) return;
    console.log(`Le joueur : ${player} a cliquer sur la case : ${row}`);

    // ? CALCUL DU  TOTAL DE POINT
    let total = 0;
    if (row < 6) {
        total = standard(row);
    } else if (row == 6) {
        total = brelan();
    } else if (row == 7) {
        total = carre();
    } else if (row == 8) {
        total = full();
    } else if (row == 9) {
        total = petiteSuite();
    } else if (row == 10) {
        total = grandeSuite();
    } else if (row == 11) {
        total = yams();
    } else if (row == 12) {
        total = chance();
    }

    // ? AFFICHAGE
    const player1 = document.getElementsByClassName('P' + player);
    player1[row].innerHTML = total;

    registerTotal(player);


    // ? GESTION DU TOUR
    if (playerInPlay == 5) {
        playerInPlay = 1;
    } else {
        playerInPlay++
    }
    nbClick = 0;
}

/** Récupere le total pour les combinaisons standard (de 1 à 6) -> utilisé dans registerScore */
function standard(row) {
    let total = 0;
    for (let i = 0; i < desValue.length; i++) {
        if (desValue[i] == row + 1) {
            total += desValue[i];
        }
    }
    return total;
}

/** Récupere le total pour la combinaison brelan -> utilisé dans registerScore */
function brelan() {
    let total = 0
    const dice = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    // ? ON FAIT LE COMPTE DES DèS
    for (let i = 0; i < desValue.length; i++) {
        value = desValue[i];
        dice[value]++
    }

    // ? ON CHERCHE UN DES QUI APPARAIT 3 FOIS OU PLUS
    for (let i = 1; i < Object.keys(dice).length + 1; i++) {
        if (dice[i] >= 3) {
            total = i * 3;
        }
    }

    return total;
}

function carre() {
    let total = 0
    const dice = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    // ? ON FAIT LE COMPTE DES DèS
    for (let i = 0; i < desValue.length; i++) {
        value = desValue[i];
        dice[value]++
    }

    // ? ON CHERCHE UN DES QUI APPARAIT 4 FOIS OU PLUS
    for (let i = 1; i < Object.keys(dice).length + 1; i++) {
        if (dice[i] >= 4) {
            total = i * 4;
        }
    }

    return total;
}

function full() {
    let total = 25;
    const dice = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    // ? ON FAIT LE COMPTE DES DèS
    for (let i = 0; i < desValue.length; i++) {
        value = desValue[i];
        dice[value]++
    }

    // ? ON CHERCHE UN DES QUI APPARAIT 3 FOIS & UN AUTRE QUI APPARAIT 2 FOIS
    const validValue = [0, 2, 3];
    for (let i = 1; i < Object.keys(dice).length + 1; i++) {
        if (!validValue.includes(dice[i])) {
            total = 0;
        }
    }

    return total;
}

function petiteSuite() {
    let total = 30
    uniq = [...new Set(desValue)];

    if (uniq.length >= 4) {
        // 1 3 4 5 6

        uniq.sort();

        if (uniq[0] == 1 && uniq[1] !== 2) {
            uniq.shift();
        }

        for (let i = 1; i > 4; i++) {
            console.log(uniq[i]);
            console.log(uniq[0]);
            if (uniq[i] !== uniq[0] + i) {
                total = 0;
            }
        }
    } else {
        total = 0
    }
    return total;
}

function grandeSuite() {
    let total = 40
    uniq = [...new Set(desValue)];

    if (uniq.length >= 5) {

        uniq.sort();

        for (let i = 1; i > 5; i++) {
            console.log(uniq[i]);
            console.log(uniq[0]);
            if (uniq[i] !== uniq[0] + i) {
                total = 0;
            }
        }
    } else {
        total = 0
    }

    return total;
}

function yams() {
    let total = 0
    const dice = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    // ? ON FAIT LE COMPTE DES DèS
    for (let i = 0; i < desValue.length; i++) {
        value = desValue[i];
        dice[value]++
    }

    for (let i = 1; i < Object.keys(dice).length + 1; i++) {
        if (dice[i] >= 5) {
            total = 50;
        }
    }

    return total;

}

function chance() {
    let total = 0;
    for (let i = 0; i < desValue.length; i++) {
        total += desValue[i];
    }
    return total;
}



/** Enregistre le total de tous les scores -> utilisé dans registerScore */
const registerTotal = (player) => {
    const player1 = document.getElementsByClassName('P' + player);
    var totauxHtml = document.getElementsByClassName('totaux');
    var bonusHtml = document.getElementsByClassName('bonus');

    // ? CALCUL DU SCORE TOTAL
    var totaux = 0;
    for (let i = 0; i < player1.length; i++) {
        if (player1[i].innerHTML != '') {
            totaux += parseInt(player1[i].innerHTML);
        }
    }

    // ? AFFICHAGE DU SCORE TOTAL
    totauxHtml[player - 1].innerHTML = totaux;


    // ? GESTION DU SCORE BONUS
    if (totauxHtml[player - 1].innerHTML >= 63) {
        bonusHtml[player - 1].innerHTML = "+35";
        var totalBonus = document.getElementsByClassName('totalBonus');
        totalBonus[player - 1].innerHTML = totaux + 35;
    }
}

init();