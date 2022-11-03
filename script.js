'use strict';

class Dice {
    constructor() {
        this.dice = document.querySelector('.dice');
    }

    hide() {
        this.dice.classList.add('hidden');
    }

    show(){
        this.dice.classList.remove('hidden');
    }

    animationTime(){

        let min = 1;
        let max = 2;
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    roll(){
        document.querySelector('.btn--hold').disabled = true;
        const time = this.animationTime();
        this.show();

        let value;

        const sleep = (ms) => new Promise((res) => {setTimeout(res, ms)})

        Array(time).fill(0).forEach(async (_, idx, arr) => {

            for (let i=0; i < 5; i++){
                value = Math.trunc(Math.random() * 6) + 1;
                this.dice.src = `dado-${value}.png`
                await sleep(time * 150);
            }

            if (idx === arr.length-1){

                document.querySelector('.btn--hold').disabled = false;

                if (value !== 1){
                    currentScore += value;
                    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
                } else {
                    switchPlayer()
                }
            }
        })
    }
}

class Player {

    /**
     *
     * @param {string} playerClass
     * @param {string} scoreID
     * @param {string} currentScoreId
     */
    constructor(playerClass, scoreID, currentScoreId) {
        this.player = document.querySelector(playerClass);
        this.score = document.getElementById(scoreID);
        this.currentScore = document.getElementById(currentScoreId)
    }

    won(){
        this.player.classList.add('player--winner');
        this.player.classList.remove('player--active');
    }

    removeClass(className){
        this.player.classList.remove(className);
    }

    addClass(className){
        this.player.classList.add(className);
    }

    toggleActivePlayer(){
        this.player.classList.toggle('player--active');
    }

    resetScore(){
        this.score.textContent = "0";
        this.currentScore.textContent = "0";
    }

}

const player1 = new Player('.player--0', 'score--0', 'current--0')
const player2 = new Player('.player--1', 'score--1', 'current--1')
const players = [player1, player2]
const dice = new Dice();

let scores, currentScore, activePlayer, playing;

const newGame = () => {

    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    player1.resetScore();
    player2.resetScore();

    dice.hide();

    player1.removeClass('player--winner');
    player2.removeClass('player--winner');
    player1.addClass('player--active');
    player2.removeClass('player--active');
}

newGame();

const switchPlayer = () => {
    document.getElementById(`current--${activePlayer}`).textContent = "0";
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player1.toggleActivePlayer();
    player2.toggleActivePlayer();
}

/**
 * New Game button
 */
document.querySelector('.btn--new').addEventListener('click', newGame)

document.querySelector('.btn--roll').addEventListener('click', () => {

    if (playing) {
        dice.roll();
    }
})

document.querySelector('.btn--hold').addEventListener('click', () => {
    if (playing){

        // 1. Adiciona o valor atual ao placar do jogador atual.
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        // 2. Verifica se a pontuação é >= 100
        if (scores[activePlayer] >= 30) {
            // Encerra o jogo
            playing = false;
            dice.hide();

            const player = players[activePlayer];
            player.won();
            player.removeClass('player--active')

        } else {
            switchPlayer();
        }
    }
})

