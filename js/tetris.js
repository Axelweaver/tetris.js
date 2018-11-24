document.body.onload = function () {
    game();
};

function game() {
    // поле
    var field = findElm(".game-field");
    // количество колонок
    var columnsCount = 10;
    // количество строк
    var rowsCount = 18;
    // первоначальная задержка движения вниз
    var initDelay = 900;
    // задержка движения вниз
    var delay = 900;
    // текущий уровень
    var level = 1;
    // очки игрока
    var score = 0;
    // число ПИ
    var pi = Math.PI;
    // конвертировать индекс в радианы
    function convertToRads(ind) {
        return Math.PI / 2 * ind;
    }
    // рассчитать синус
    function sin(rads, k) {
        k = k || 1;
        return Math.round(Math.sin(rads) * k);
    }
    // рассчитать косинус
    function cos(rads, k) {
        k = k || 1;
        return Math.round(Math.cos(rads) * k);
    }
    // массив с объектами фигур с формулами их позиции (вращения)
    var figures = [
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads - pi / 2) + y, cos(rads - pi / 2) + x];
                var cell3 = [sin(rads + pi / 4) + y, cos(rads + pi / 4) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        },
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads + pi) + y, cos(rads + pi) + x];
                var cell3 = [sin(rads + pi / 2) + y, cos(rads + pi / 2) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        },
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads + pi) + y, cos(rads + pi) + x];
                var cell3 = [sin(rads + pi, 2) + y, cos(rads + pi, 2) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        },
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads + pi) + y, cos(rads + pi) + x];
                var cell3 = [sin(rads + pi / 4) + y, cos(rads + pi / 4) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        },
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads + pi) + y, cos(rads + pi) + x];
                var cell3 = [sin(rads - pi / 4) + y, cos(rads - pi / 4) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        },
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads + pi / 2) + y, cos(rads + pi / 2) + x];
                var cell3 = [sin(rads + pi / 4) + y, cos(rads + pi / 4) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        },
        {
            createCells: function (y, x, ind) {
                var rads = convertToRads(ind);
                // центр
                var cell0 = [y, x];
                var cell1 = [sin(rads) + y, cos(rads) + x];
                var cell2 = [sin(rads + pi / 2) + y, cos(rads + pi / 2) + x];
                var cell3 = [sin(rads - pi / 4) + y, cos(rads - pi / 4) + x];
                var currCellsArr = [cell0, cell1, cell2, cell3];
                return currCellsArr;
            }
        }

    ];
    // сравнение двух массивов координат
    function equalCoordArr(crd1, crd2) {
        return crd1[0] === crd2[0] && crd1[1] === crd2[1];
    }
    // фильтрация массива координат на совпадающие клетки arr1 - фильтруемый по arr2
    function filterCoordArr(arr1, arr2) {
        var filterArr = [];
        for (var i = 0; i < arr1.length; i++) {
            var equal = false;
            for (var j = 0; j < arr2.length; j++) {
                if (equalCoordArr(arr1[i], arr2[j])) {
                    equal = true;
                    break;
                }
            }
            if (!equal) {
                filterArr.push(arr1[i]);
            }
        }
        return filterArr;
    }
    // проверяем массив координат на существование клеток и выход за границы
    function lookCoordArr(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][0] >= rowsCount
                || arr[i][1] < 0
                || arr[i][1] >= columnsCount
                || lookByCoord(arr[i][0], arr[i][1])) {
                return true;
            }
        }
        return false;
    }

    // получить случайное число
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // получить случайный индекс фигуры
    function getRandomIndex() {
        return getRandomInt(0, figures.length - 1);
    }
    // найти элемент
    function findElm(query) {
        return document.querySelector(query);
    }
    // найти несколько элементов
    function findElms(query) {
        return document.querySelectorAll(query);
    }
    // изменить класс клетки (для передвижения)
    function changeClass(elm, oldClass, newClass) {
        elm.classList.remove(oldClass);
        elm.classList.add(newClass);
    }
    // создать элемент
    function crtElm(tag, clases) {
        var elm = document.createElement(tag);
        if (clases) {
            elm.classList.add(clases);
        }
        return elm;
    }
    // получить ячейку по координатам
    function getByCoord(y, x) {
        return findElm(".col-" + x + ".row-" + y);
    }
    // проверить наличие ячейки по координатам
    function lookByCoord(y, x) {
        return getByCoord(y, x) !== null;
    }
    // обновить счёт
    function updateScore() {
        var spanScore = findElm("span.score");
        spanScore.innerText = score;
    }
    // обновить уровень
    function updateLevel() {
        var spanScore = findElm("span.level");
        spanScore.innerText = level;
    }
    // проверить заполнения ячейками всю строку по её номеру
    function lookColumns(y) {
        for (var xi = 0; xi < columnsCount; xi++) {
            if (!lookByCoord(y, xi)) {
                return false;
            }
        }
        return true;
    }
    // сдвинуть ячейку вниз
    function recalcRowClass(elm) {
        for (var i = 0; i < elm.classList.length; i++) {
            if (elm.classList.item(i).substr(0, 4) === "row-") {
                var rowIndex = parseInt(elm.classList.item(i).substr(4)) + 1;
                elm.classList.remove(elm.classList.item(i));
                elm.classList.add("row-" + rowIndex);
            }
        }
    }
    // удалить строку и сдвинуть все клетки выше этой строки на одну ниже
    function recalcRows(y) {
        // анимация удаления ячеек
        for (var xi = 0; xi < columnsCount; xi++) {
            getByCoord(y, xi).classList.add("blink-out");
        }
        setTimeout(function () {
            // удаление строки ячеек
            for (var xi2 = 0; xi2 < columnsCount; xi2++) {
                getByCoord(y, xi2).remove();
            }
            // увеличим счёт
            score += level;
            updateScore();

            // опустить все ячейки выше удалённой строки на одну строку вниз
            for (var l = y - 1; l >= 0; l--) {
                var allElms = findElms(".game-field > .cell.row-" + l);
                for (var k = 0; k < allElms.length; k++) {
                    recalcRowClass(allElms[k]);
                }
            }
        }, 200);
    }
    // проверить все строки на заполненность клетками по всей ширине
    function lookRows() {
        for (var yj = 0; yj < rowsCount; yj++) {
            if (lookColumns(yj)) {
                recalcRows(yj);
            }
        }
    }
    // создание составной фигуры
    function createObject(figureObj) {

        // индекс поворота фигуры
        var randomizeIndex = getRandomInt(0, 3);

        // позиция фигуры
        var posY = 1;
        var posX = 5;

        // получаем массив координат клеток фигуры из объетка по формулам
        var coordsArr = figureObj.createCells(posY, posX, randomizeIndex);

        // массив объектов всех клеток, входящих в состав фигуры
        var objectCells = [];

        // создать ячейки, из которых состоят фигруры по массивам их координат
        for (var ci = 0; ci < coordsArr.length; ci++) {
            var objCell = createCellFactory(coordsArr[ci][0], coordsArr[ci][1])();
            objCell.checkSelf = checkSelfCell;
            objectCells.push(objCell);
        }

        // обновить массив текущих координат
        function updateCoordArray() {
            coordsArr = [];
            action(function (objCell) {
                coordsArr.push(objCell.coords());
            });
        }
        // проверка координат, если ли такая ячейка в этой фигуре
        function checkSelfCell(y, x) {
            for (var sci = 0; sci < objectCells.length; sci++) {
                if (objectCells[sci].y === y && objectCells[sci].x === x) {
                    return true;
                }
            }
            return false;
        }
        // поворот фигуры
        function rotate() {
            // временный новый индекс вращения фигуры
            var tmpRandomizeIndex = randomizeIndex >= 0 && randomizeIndex < 3 ? randomizeIndex + 1 : 0;
            // получим временные новые координаты клеток по формулам фигуры
            var tempCoordsArr = figureObj.createCells(posY, posX, tmpRandomizeIndex);
            updateCoordArray();
            // отфильтруем координаты
            var filterCoords = filterCoordArr(tempCoordsArr, coordsArr);
            // проверим координаты на пересечение крайних точек и соседних фигур
            if (!lookCoordArr(filterCoords)) {
                randomizeIndex = tmpRandomizeIndex;
                // Изменим координаты клеток текущей фигуры
                for (var i = 0; i < tempCoordsArr.length; i++) {
                    objectCells[i].coords(tempCoordsArr[i]);
                }
            }
        }
        // функции перебора всех клеток, входящих в фигуру
        function action(fn) {
            for (var a = 0; a < objectCells.length; a++) {
                fn(objectCells[a]);
            }
        }
        // функция переобора всех клеток, входящих в фигуру с возвратом значения
        function actionR(fn) {
            for (var b = 0; b < objectCells.length; b++) {
                if (fn(objectCells[b])) {
                    return true;
                }
            }
            return false;
        }
        // проверить снизу
        function lookDown() {
            return actionR(function (c) { return c.lookDown(); });
        }
        // проверить справа
        function lookRight() {
            return actionR(function (c) { return c.lookRight(); });
        }
        // проверить слева
        function lookLeft() {
            return actionR(function (c) { return c.lookLeft(); });
        }

        return {
            // переместить всю фигуру влево
            left: function () {
                if (lookLeft()) {
                    return;
                }
                action(function (c) { c.left(); });
                posX--;
            },
            // переместить всю фигуру вправо
            right: function () {
                if (lookRight()) {
                    return;
                }
                action(function (c) { c.right(); });
                posX++;
            },
            // переместить всю фигуру вниз
            down: function () {
                action(function (c) { c.down(); });
                posY++;
            },
            // проверить снизу для всей фигуры
            lookDown: lookDown,
            // вращать фигуру
            rotate: rotate
        };
    }
    // фабричная функция создания клетки
    function createCellFactory(y, x) {
        return function () {
            return createCell(y, x);
        }
    }
    // создать клетку, входящую в состав фигуры
    function createCell(y, x) {
        var elm = crtElm("div", "cell");
        var cellPosY = y;
        var cellPosX = x;
        // предыщие классы положения
        var elmLastClassX, elmLastClassY;
        field.appendChild(elm);
        // разместить клетку в первоначальных координатах
        moveX();
        moveY();
        // движение по горизонали
        function moveX() {
            var newClass = "col-" + cellPosX;
            changeClass(elm, elmLastClassX, newClass);
            elmLastClassX = newClass;
        }
        // движение по вертикали
        function moveY() {
            var newClass = "row-" + cellPosY;
            changeClass(elm, elmLastClassY, newClass);
            elmLastClassY = newClass;
        }
        return {
            x: cellPosX,
            y: cellPosY,
            // получить координаты
            coords: function (newCoords) {
                if (newCoords) {
                    cellPosY = newCoords[0];
                    cellPosX = newCoords[1];
                    this.y = cellPosY;
                    this.x = cellPosX;
                    moveX();
                    moveY();
                } else {
                    return [cellPosY, cellPosX];
                }
            },
            // переместить клетку влево
            left: function () {
                cellPosX--;
                this.x = cellPosX;
                moveX();
            },
            // переместить клетку вправо
            right: function () {
                cellPosX++;
                this.x = cellPosX;
                moveX();
            },
            // переместить клетку вниз
            down: function () {
                cellPosY++;
                this.y = cellPosY;
                moveY();
            },
            // проверить слева на столкновение
            lookLeft: function () {
                return cellPosX === 0
                    || (!this.checkSelf(cellPosY, cellPosX - 1)
                        && lookByCoord(cellPosY, cellPosX - 1));
            },
            // проверить справа на столкновение
            lookRight: function () {
                return (cellPosX + 1) === columnsCount
                    || (!this.checkSelf(cellPosY, cellPosX + 1)
                        && lookByCoord(cellPosY, cellPosX + 1));
            },
            // проверить снизу на столкновение
            lookDown: function () {
                return (cellPosY + 1) === rowsCount
                    || (!this.checkSelf(cellPosY + 1, cellPosX)
                        && lookByCoord(cellPosY + 1, cellPosX));
            },
        };
    }
    // фабричная функция создания составного объека фигуры
    function createObjectFactory(index) {
        return function () {
            return createObject(figures[index]);
        }
    }
    // цикл создания нового объекта и движения объекта вниз
    function cycleDown() {
        // создадим объект фигуры
        var curObj = createObjectFactory(getRandomIndex())();
        document.body.onkeyup = undefined;
        // обработка нажатия кнопок
        document.body.onkeyup = function (e) {
            if (e.keyCode === 38) {
                curObj.rotate();
            }
            if (e.keyCode === 40) {
                delay = initDelay;
                return false;
            }
        };
        // обработка кнопки "вниз"
        document.body.onkeydown = undefined;
        document.body.onkeydown = function (e) {
            if (e.keyCode === 37) {
                curObj.left();
            }
            if (e.keyCode === 39) {
                curObj.right();
            }
            if (e.keyCode === 40) {

                if (curObj.lookDown()) {
                    return false;
                }
                curObj.down();
                delay = 50;
                return false;
            }
        };

        var i = 0;
        // цикл движения вниз
        function down() {
            // если цикл не закончился и нет препятствий снизу
            var existsDown = curObj.lookDown();
            if (i < rowsCount - 1 && !existsDown) {
                curObj.down();
                i++;
                setTimeout(down, delay);
            } else {

                curObj = undefined;
                //console.log("stopped");
                //return;
                if (i === 0) {
                    console.log("game over");
                    return;
                }
                // проверить строки на заполнение
                lookRows();
                // запустить новый цикл с новым объектом
                setTimeout(cycleDown, delay + 300);
            }
        }
        setTimeout(down, delay);
    }

    updateLevel();
    updateScore();
    setTimeout(cycleDown, delay);
}
