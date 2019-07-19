let fieldSize = 10;
let bombNumber = Math.floor(fieldSize * fieldSize / 6);
let flagNumber = 0;
let gameOver = false;
let firstStep = true;

const restart = document.createElement('button');
restart.className = 'restart-btn';
restart.innerHTML = "Начать игру заново";
restart.style.visibility = 'hidden';
document.body.appendChild(restart);

const field = document.createElement('div');
field.className = 'field';
document.body.appendChild(field);

const gameOverTitle = document.createElement('p');
gameOverTitle.className = 'game-over-title';
gameOverTitle.innerHTML = 'GAME OVER';

const deactivatedBomb = document.createElement('p');
deactivatedBomb.className = 'default-text';

const selectSizeTitle = document.createElement('p');
selectSizeTitle.className = 'default-text';
selectSizeTitle.innerHTML = `Введите ширину поля (от 3 до 20)`;
document.body.appendChild(selectSizeTitle);
const selectSizeInput = document.createElement('input');
selectSizeInput.className = 'select-size-input';
selectSizeInput.value = `${fieldSize}`;
document.body.appendChild(selectSizeInput);
const startBtn = document.createElement('button');
startBtn.className = 'restart-btn';
startBtn.innerHTML = 'Старт';
document.body.appendChild(startBtn);

const setCells = () => {
    for (let i = 0; i < fieldSize * fieldSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = `${i}`;
        cell.dataset.flag = 'false';
        cell.dataset.open = 'false';
        field.appendChild(cell);
    }
};

const setBomb = () => {
    for (let i = 0; i < bombNumber; i++) {
        const random = Math.floor(Math.random() * fieldSize * fieldSize);
        if (field.children[random].dataset.bomb === undefined) {
            field.children[random].dataset.bomb = 'true';
        } else {
            i--;
        }
    }
    document.body.insertBefore(deactivatedBomb, field);
};

const showBombs = () => {
    for (let i = 0; i < fieldSize * fieldSize; i++) {
       if (field.children[i].dataset.bomb === 'true') {
           if (field.children[i].dataset.flag === 'true') {
               field.children[i].style.color = 'green';
           } else {
               field.children[i].innerHTML = '<i class="fas fa-bomb icon"></i>';
           }
       } else if (field.children[i].dataset.flag === 'true') {
           field.children[i].style.color = 'red';
       }
    }
};

const getCellsAround = (cell) => {
    const arr = [];
    const index = Number(cell.dataset.index);
    if (index >= fieldSize && index % fieldSize !== 0) {
        arr.push(index - fieldSize - 1)
    }
    if (index >= fieldSize) {
        arr.push(index - fieldSize)
    }
    if (index >= fieldSize && index % fieldSize !== fieldSize-1) {
        arr.push(index - fieldSize + 1)
    }
    if (index < fieldSize * (fieldSize - 1) && index % fieldSize !== 0) {
        arr.push(index + fieldSize - 1)
    }
    if (index < fieldSize * (fieldSize - 1)) {
        arr.push(index + fieldSize)
    }
    if (index < fieldSize * (fieldSize - 1) && index % fieldSize !== fieldSize-1) {
        arr.push(index + fieldSize + 1)
    }
    if (index % fieldSize !== fieldSize-1) {
    arr.push(index + 1)
    }
    if (index % fieldSize !== 0) {
        arr.push(index - 1)
    }
    return arr
};

const calcBombNum = (cell)=> {
    let bombNum = 0;
    getCellsAround(cell).forEach((value) => {
        if (field.children[value].dataset.bomb === 'true') {
            bombNum++
        }
    });
    return bombNum
};

const calcFlagNum = (cell)=> {
    let flagNum = 0;
    getCellsAround(cell).forEach((value) => {
        if (field.children[value].dataset.flag === 'true') {
            flagNum++
        }
    });
    return flagNum
};

const createBonmNumTitle = (bombNum) => {
    const bombNumTitle = document.createElement('p');
    bombNumTitle.className = 'bomb-num';
    bombNumTitle.innerHTML = bombNum;
    bombNumTitle.style.userSelect = "none";
    return bombNumTitle
};

const openCell = (cell) => {
    const bombNum = calcBombNum(cell);
    if (cell.dataset.open === 'false') {
        cell.style.backgroundColor = "#fff";
        cell.dataset.open = 'true';
        cell.appendChild(createBonmNumTitle(bombNum));
        if (bombNum === 0) {
            getCellsAround(cell).forEach((value) => {
                const cell = field.children[value];
                openCell(cell);
            });
        }
    }
};

const letGameOver = () => {
    showBombs();
    gameOver = true;
    document.body.appendChild(gameOverTitle);
};

field.onclick = (event) => {
    let cell = '';
    if (event.target.className === 'cell') {
        cell = event.target;
    }
    if (gameOver === false && cell.dataset.flag === "false") {
        if (cell.dataset.bomb === 'true') {
            letGameOver();
        } else {
            openCell(cell);
        }
    }
    if (firstStep === true) {
        restart.style.visibility = 'visible';
        firstStep = false;
    }
};

field.oncontextmenu = (event) => {
    let cell = '';
    if (event.target.className === 'cell') {
        cell = event.target;
    } else if (event.target.className === "fas fa-flag icon") {
        cell = event.target.parentNode;
    }
    if (cell !== '') {
        if (gameOver === false && cell.style.backgroundColor === '') {
            if (cell.dataset.flag === "false") {
                cell.dataset.flag = "true";
                cell.innerHTML = '<i class="fas fa-flag icon"></i>';
                deactivatedBomb.innerHTML = `Обезврежено мин: ${++flagNumber} из ${bombNumber}`;
                if (flagNumber === bombNumber) {
                    letGameOver();
                }
            } else {
                cell.dataset.flag = "false";
                cell.innerHTML = '';
                deactivatedBomb.innerHTML = `Обезврежено мин: ${--flagNumber} из ${bombNumber}`;
            }
        }
    }
    return false
};

restart.onclick = () => {
    gameOver = false;
    flagNumber = 0;
    deactivatedBomb.innerHTML = `Обезврежено мин: ${flagNumber} из ${bombNumber}`;
    restart.style.visibility = 'hidden';
    deactivatedBomb.remove();
    gameOverTitle.remove();
    field.innerHTML = '';
    firstStep = true;
    document.body.appendChild(selectSizeTitle);
    document.body.appendChild(selectSizeInput);
    document.body.appendChild(startBtn);
};

field.ondblclick = (event) => {
    let cell = '';
    if (event.target.className === 'cell') {
        cell = event.target;
    } else {
        cell = event.target.parentNode;
    }
    if (cell !== '' && gameOver === false && cell.dataset.open === 'true') {
        if (+cell.children[0].innerText === calcFlagNum(cell)) {
            getCellsAround(cell).forEach((value) => {
                if (field.children[value].dataset.bomb === 'true') {
                    if (field.children[value].dataset.flag === 'false') {
                        letGameOver();
                    }
                } else openCell(field.children[value]);
            })
        }
    }
};

startBtn.onclick = () => {
    fieldSize = Number(selectSizeInput.value);
    if (fieldSize >= 3 && fieldSize <= 20) {
        selectSizeTitle.remove();
        selectSizeInput.remove();
        startBtn.remove();
        field.style.gridTemplateColumns = `repeat(${fieldSize}, 50px)`;
        bombNumber = Math.floor(fieldSize * fieldSize / 6);
        deactivatedBomb.innerHTML = `Обезврежено мин: ${flagNumber} из ${bombNumber}`;
        setCells();
        setBomb();
    }
};

