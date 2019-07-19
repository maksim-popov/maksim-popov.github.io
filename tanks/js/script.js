let levelForm = document.querySelector('.level-form');
let startBtn = document.getElementById('startBtn');
let restartBtn = document.getElementById('restartBtn');
let tankQuantityTitle = document.querySelector('.tanks-quantity-title');
let fieldHtmlElem = document.querySelector('.field');

tankQuantityTitle.remove();
fieldHtmlElem.remove();
restartBtn.remove();

let level = 'easy';
let fightFrequency = 150;
let newBotFrequency = 4000;
let botsNumber = 10;
let botsLeft = botsNumber;
let tanks = {};
let newBotTimerId = 0;

field.showWall = () => {
    for (let row = 0; row < 50; row++) {
        for (let col = 0; col < 50; col++) {
            if (field[row][col].status === 'wall') {
                let wall = document.createElement('div');
                wall.classList.add('cell');
                wall.classList.add('wall');
                wall.style.left = `${field[row][col].x}px`;
                wall.style.top = `${field[row][col].y}px`;
                document.querySelector('.field').appendChild(wall)
            }
            if (field[row][col].status === 'easyWall') {
                let wall = document.createElement('div');
                wall.classList.add('cell');
                wall.classList.add('easy-wall');
                wall.setAttribute('id', `${row}${col}`);
                wall.style.left = `${field[row][col].x}px`;
                wall.style.top = `${field[row][col].y}px`;
                document.querySelector('.field').appendChild(wall)
            }
        }
    }
};

class Tank {
    constructor(name, row, col) {
        this.name = name;
        this.row = row;
        this.col = col;
        this.x = col * 10;
        this.y = row * 10;
        this.direction = 'up';
        this.timerId = {};
        this.type = 'player';
        let tank = document.createElement('div');
        tank.classList.add('tank');
        tank.setAttribute('id',`${this.name}`);
        tank.style.left = `${this.x}px`;
        tank.style.top = `${this.y}px`;
        document.querySelector('.field').appendChild(tank)
    }
    refreshPosition() {
        let row = this.row;
        let col = this.col;
        if (field[row+2][col+1].status === `${this.name}`) field[row+2][col+1].status = 'empty';
        if (field[row+2][col].status === `${this.name}`) field[row+2][col].status = 'empty';
        if (field[row+2][col-1].status === `${this.name}`) field[row+2][col-1].status = 'empty';
        if (field[row-2][col+1].status === `${this.name}`) field[row-2][col+1].status = 'empty';
        if (field[row-2][col].status === `${this.name}`) field[row-2][col].status = 'empty';
        if (field[row-2][col-1].status === `${this.name}`) field[row-2][col-1].status = 'empty';
        if (field[row-2][col-1].status === `${this.name}`) field[row-2][col-1].status = 'empty';
        if (field[row+1][col-2].status === `${this.name}`) field[row+1][col-2].status = 'empty';
        if (field[row][col-2].status === `${this.name}`) field[row][col-2].status = 'empty';
        if (field[row-1][col-2].status === `${this.name}`) field[row-1][col-2].status = 'empty';
        if (field[row+1][col+2].status === `${this.name}`) field[row+1][col+2].status = 'empty';
        if (field[row][col+2].status === `${this.name}`) field[row][col+2].status = 'empty';
        if (field[row-1][col+2].status === `${this.name}`) field[row-1][col+2].status = 'empty';
        field[row+1][col+1].status = `${this.name}`;
        field[row+1][col].status = `${this.name}`;
        field[row+1][col-1].status = `${this.name}`;
        field[row][col+1].status = `${this.name}`;
        field[row][col].status = `${this.name}`;
        field[row][col-1].status = `${this.name}`;
        field[row-1][col+1].status = `${this.name}`;
        field[row-1][col].status = `${this.name}`;
        field[row-1][col-1].status = `${this.name}`;
        this.x = col * 10;
        this.y = row * 10;
        document.getElementById(this.name).style.left = `${this.x}px`;
        document.getElementById(this.name).style.top = `${this.y}px`;
    }
    moveUp() {
        if (field[this.row - 2][this.col - 1].status === 'empty' &&
            field[this.row - 2][this.col].status === 'empty' &&
            field[this.row - 2][this.col + 1].status === 'empty') {
                this.row += -1;
                this.refreshPosition();
            }
        this.direction = 'up';
        document.getElementById(this.name).style.transform = 'translate(-50%, -50%) rotate(0deg)'
    }
    moveDown() {
        if (field[this.row + 2][this.col - 1].status === 'empty' &&
            field[this.row + 2][this.col].status === 'empty' &&
            field[this.row + 2][this.col + 1].status === 'empty') {
            this.row += 1;
            this.refreshPosition();
        }
        this.direction = 'down';
        document.getElementById(this.name).style.transform = 'translate(-50%, -50%) rotate(180deg)'
    }
    moveLeft() {
        if (field[this.row - 1][this.col - 2].status === 'empty' &&
            field[this.row ][this.col - 2].status === 'empty' &&
            field[this.row + 1][this.col - 2].status === 'empty') {
            this.col += -1;
            this.refreshPosition();
        }
        this.direction = 'left';
        document.getElementById(this.name).style.transform = 'translate(-50%, -50%) rotate(270deg)'
    }
    moveRight() {
        if (field[this.row - 1][this.col + 2].status === 'empty' &&
            field[this.row ][this.col + 2].status === 'empty' &&
            field[this.row + 1][this.col + 2].status === 'empty') {
            this.col += 1;
            this.refreshPosition();
        }
        this.direction = 'right';
        document.getElementById(this.name).style.transform = 'translate(-50%, -50%) rotate(90deg)'
    }
    fight() {
        let direction = this.direction;
        let row = this.row;
        let col = this.col;
             if (direction === 'up') row += -1;
        else if (direction === 'down') row += 1;
        else if (direction === 'left') col += -1;
        else if (direction === 'right') col += 1;
        let bomb = document.createElement('div');
        bomb.classList.add('bomb');
        bomb.style.left = `${col * 10}px`;
        bomb.style.top = `${row * 10}px`;
        document.querySelector('.field').appendChild(bomb);
        let timerId = 0;
        let timerBody = () => {
                field[row][col].status = 'empty';
                if (direction === 'up') row += -1;
                else if (direction === 'down') row += 1;
                else if (direction === 'left') col += -1;
                else if (direction === 'right') col += 1;
                if (field[row][col].status === 'empty') {
                    bomb.style.left = `${col * 10}px`;
                    bomb.style.top = `${row * 10}px`;
                    field[row][col].status = 'bomb';
                    bomb.setAttribute('id', `bomb${row}${col}`);
                } else if (field[row][col].status === 'wall') {
                    clearInterval(timerId);
                    bomb.remove();
                } else if (field[row][col].status === 'easyWall') {
                    clearInterval(timerId);
                    bomb.remove();
                    field[row][col].status = 'empty';
                    document.getElementById(`${row}${col}`).remove();
                } else if (field[row][col].status === 'eagle') {
                    gameOver("You Lost!");
                } else if (field[row][col].status === 'bomb') {
                    clearInterval(timerId);
                    clearInterval(Number(document.getElementById(`bomb${row}${col}`).dataset.timer));
                    bomb.remove();
                    document.getElementById(`bomb${row}${col}`).remove();
                    field[row][col].status = 'empty';
                } else {
                    clearInterval(timerId);
                    bomb.remove();
                    let deadTank = field[row][col].status;
                    if (tanks[deadTank].type !== this.type) {
                        removeTank(deadTank);
                    }
                }
            };
        timerBody();
        if (field[row][col].status !== 'wall') {
            timerId = setInterval(timerBody, 50);
            bomb.dataset.timer = `${timerId}`;
        }
    }
}

class TankBot extends Tank {
    constructor(name, row, col) {
        super(name, row, col);
        document.getElementById(name).classList.add('tank-bot');
        this.type = 'bot';
    }
    giveLife() {
        let random = Math.random();
        let timer = 0;
        this.liveTimerId = 0;
        this.liveTimerId = setInterval(() => {
            if (random < 0.15) this.moveUp();
            else if (random >= 0.15 && random < 0.5) this.moveDown();
            else if (random >= 0.5 && random < 0.75) this.moveLeft();
            else this.moveRight();
            timer++;
            if (timer > 5) {
                timer = 0;
                this.fight();
                random = Math.random();
            }
        }, fightFrequency)
    }
}

startBtn.onclick = () => {
    level = document.getElementById('level').value;
    switch (level) {
        case 'normal':
            fightFrequency = 125;
            newBotFrequency = 3500;
            botsNumber = 15;
            break;
        case 'hard':
            fightFrequency = 100;
            newBotFrequency = 3000;
            botsNumber = 25;
            break;
    }
    levelForm.remove();
    document.body.appendChild(tankQuantityTitle);
    document.body.appendChild(fieldHtmlElem);
    botsLeft = botsNumber;
    document.querySelector('.tanks-quantity').innerHTML = botsLeft;
    field.showWall();
    start();
    document.body.appendChild(restartBtn)
};

restartBtn.onclick = () => {
    window.location.reload();
};

function start() {
    tanks.player = new Tank('player', 46, 32);
    newBotTimerId = setInterval(() => {
        let name = `bot${botsNumber}`;
        let col = Math.round(Math.random() * 40 + 5);
        tanks[name] = new TankBot(name, 5, col);
        tanks[name].giveLife();
        botsNumber--;
        if (botsNumber === 0) clearInterval(newBotTimerId);
    }, newBotFrequency);
    document.body.onkeydown = (event) => {
        if (event.key === 'ArrowUp' && !event.repeat) {
            clearAllInterval();
            tanks.player.moveUp();
            tanks.player.timerId.up = setInterval(() => {
                tanks.player.moveUp()
            }, 100);
        } else if (event.key === 'ArrowDown' && !event.repeat) {
            clearAllInterval();
            tanks.player.moveDown();
            tanks.player.timerId.down = setInterval(() => {
                tanks.player.moveDown()
            }, 100);
        } else if (event.key === 'ArrowLeft' && !event.repeat) {
            clearAllInterval();
            tanks.player.moveLeft();
            tanks.player.timerId.left = setInterval(() => {
                tanks.player.moveLeft()
            }, 100);
        } else if (event.key === 'ArrowRight' && !event.repeat) {
            clearAllInterval();
            tanks.player.moveRight();
            tanks.player.timerId.right = setInterval(() => {
                tanks.player.moveRight()
            }, 100);
        }
        if (event.key === ' ' && !event.repeat) {
            tanks.player.fight();
        }
    };
    document.body.onkeyup = (event) => {
        if (event.key === 'ArrowUp') clearInterval(tanks.player.timerId.up);
        else if (event.key === 'ArrowDown') clearInterval(tanks.player.timerId.down);
        else if (event.key === 'ArrowLeft') clearInterval(tanks.player.timerId.left);
        else if (event.key === 'ArrowRight') clearInterval(tanks.player.timerId.right);
    };
}

function clearAllInterval() {
    clearInterval(tanks.player.timerId.up);
    clearInterval(tanks.player.timerId.down);
    clearInterval(tanks.player.timerId.left);
    clearInterval(tanks.player.timerId.right);
}

function removeTank(deadTank) {
    document.getElementById(deadTank).remove();
    clearInterval(tanks[deadTank].liveTimerId);
    let row = tanks[deadTank].row;
    let col = tanks[deadTank].col;
    field[row+1][col+1].status = 'empty';
    field[row+1][col].status = 'empty';
    field[row+1][col-1].status = 'empty';
    field[row][col+1].status = 'empty';
    field[row][col].status = 'empty';
    field[row][col-1].status = 'empty';
    field[row-1][col+1].status = 'empty';
    field[row-1][col].status = 'empty';
    field[row-1][col-1].status = 'empty';
    if (tanks[deadTank].type === 'bot') {
        botsLeft--;
        document.querySelector('.tanks-quantity').innerHTML = botsLeft;
    }
    if (botsLeft === 0) gameOver("You Win!");
    if (deadTank === 'player') gameOver("You Lost!");
}

function gameOver(message) {
    document.body.onkeydown = null;
    document.querySelector('.message').innerHTML = message;
}
