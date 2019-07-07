let field = {};

        for (let row = 0; row < 50; row++) {
            field[row] = {};
            for (let col = 0; col < 50; col++) {
                field[row][col] = {};
                field[row][col].x = col * 10;
                field[row][col].y = row * 10;
                if (col === 0 || col === 49 || row === 0 || row === 49) {
                    field[row][col].status = 'wall';
                } else {
                    field[row][col].status = 'empty';
                }
            }
        }

        field[5][5].status = 'easyWall';



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
                }else if (field[row][col].status === 'easyWall') {
                    let wall = document.createElement('div');
                    wall.classList.add('cell');
                    wall.classList.add('easy-wall');
                    wall.setAttribute('id', `${row}${col}`);
                    wall.style.left = `${field[row][col].x}px`;
                    wall.style.top = `${field[row][col].y}px`;
                    document.querySelector('.field').appendChild(wall)
                } else {
                    let wall = document.createElement('div');
                    wall.classList.add('cell');
                    wall.setAttribute('id', `${row}${col}`);
                    wall.style.left = `${field[row][col].x}px`;
                    wall.style.top = `${field[row][col].y}px`;
                    document.querySelector('.field').appendChild(wall)
                }
            }
        }
    };

field.showWall();

let stringForCreateMap = '';

document.body.querySelector('.field').onclick = (e) => {
    if (e.target.classList.contains('cell')) {
        console.log(parseInt(e.target.style.top));
        stringForCreateMap += `field[${parseInt(e.target.style.top)/10}][${parseInt(e.target.style.left)/10}].status = 'easyWall';
        `;
        e.target.style.backgroundColor = 'green';
    }
}