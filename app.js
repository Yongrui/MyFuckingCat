/**
 * Created by Yongrui on 2015/3/14.
 */

var stage = new createjs.Stage("gameView");

createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", stage);

var gameView = new createjs.Container();
stage.addChild(gameView);

//var s = new createjs.Shape();
//s.graphics.beginFill("#ff0000");
//s.graphics.drawCircle(50, 50, 25);
//s.graphics.endFill();
//gameView.addChild(s);

var ROW = 9, COL = 9, OFFSET = 55;
var currentCat;
var circleArray = [];
var totalStep = 0;
var MOVE_LEFT = 1,
    MOVE_RIGHT = 2,
    MOVE_UP = 3,
    MOVE_DOWN = 4,
    MOVE_LEFT_UP = 5,
    MOVE_LEFT_DOWN = 6,
    MOVE_RIGHT_UP = 7,
    MOVE_RIGHT_DOWN = 8,
    MOVE_NONE = 0;


for (var iY = 0; iY < ROW; iY++) {
    circleArray[iY] = [];
    for (var iX = 0; iX < COL; iX++) {
        var circle = new Circle();
        circle.x = iY % 2 == 0 ? OFFSET * (iX + 1) + OFFSET/2 : OFFSET * (iX + 1);
        circle.y = OFFSET * (iY + 1);
        circle.indexX = iX;
        circle.indexY = iY;
        gameView.addChild(circle);

        if (iX == Math.floor(ROW/2) && iY == Math.floor(COL/2)) {
            circle.setCircleType(Circle.TYPE_CAT);
            currentCat = circle;
        } else if (Math.random() < 0.2) {
            circle.setCircleType(Circle.TYPE_SELECTED);
        }

        circleArray[iY][iX] = circle;
        circle.addEventListener("click", handleClickCircle);
    }
}

function handleClickCircle(event) {
    var circle = event.target;
    if (circle.getCircleType() == Circle.TYPE_UNSELECTED) {
        totalStep++;
        circle.setCircleType(Circle.TYPE_SELECTED)
    } else {
        return;
    }

    if (currentCat.indexX == 0 || currentCat.indexX == COL - 1 || currentCat.indexY == 0 || currentCat.indexY == ROW - 1) {
        alert("神经猫跑掉了");
        return;
    }

    var dir = genCatMoveDir(currentCat);
    var nextCat;
    switch (dir) {
        case MOVE_LEFT:
            nextCat = circleArray[currentCat.indexY][currentCat.indexX - 1];
            nextCat.setCircleType(Circle.TYPE_CAT);
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = nextCat;
            break;
        case MOVE_RIGHT:
            nextCat = circleArray[currentCat.indexY][currentCat.indexX + 1];
            nextCat.setCircleType(Circle.TYPE_CAT);
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = nextCat;
            break;
        case MOVE_LEFT_UP:
            nextCat = circleArray[currentCat.indexY - 1][currentCat.indexY % 2 == 0 ? currentCat.indexX : currentCat.indexX - 1];
            nextCat.setCircleType(Circle.TYPE_CAT);
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = nextCat;
            break;
        case MOVE_LEFT_DOWN:
            nextCat = circleArray[currentCat.indexY + 1][currentCat.indexY % 2 == 0 ? currentCat.indexX : currentCat.indexX - 1];
            nextCat.setCircleType(Circle.TYPE_CAT);
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = nextCat;
            break;
        case MOVE_RIGHT_UP:
            nextCat = circleArray[currentCat.indexY - 1][currentCat.indexY % 2 == 0 ? currentCat.indexX + 1 : currentCat.indexX];
            nextCat.setCircleType(Circle.TYPE_CAT);
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = nextCat;
            break;
        case MOVE_RIGHT_DOWN:
            nextCat = circleArray[currentCat.indexY + 1][currentCat.indexY % 2 == 0 ? currentCat.indexX + 1 : currentCat.indexX];
            nextCat.setCircleType(Circle.TYPE_CAT);
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = nextCat;
            break;
        default :
            alert("你用" + totalStep + "步围住了神经猫");
            totalStep = 0;
            break;
    }
}

function genCatMoveDir(cat) {
    var distMap = [];

    // left
    var x, y;
    for (x = cat.indexX; x >= 0 && circleArray[cat.indexY][x].getCircleType() != Circle.TYPE_SELECTED; x--);
    if (x < 0) {
        distMap.push({dir: MOVE_LEFT, dist: cat.indexX + 1, pass: true});
    } else {
        distMap.push({dir: MOVE_LEFT, dist: cat.indexX - x, pass: false});
    }

    // right
    for (x = cat.indexX; x < COL && circleArray[cat.indexY][x].getCircleType() != Circle.TYPE_SELECTED; x++);
    if (x >= COL) {
        distMap.push({dir: MOVE_RIGHT, dist: COL - cat.indexX, pass: true});
    } else {
        distMap.push({dir: MOVE_RIGHT, dist: x - cat.indexX, pass: false});
    }

    // left up
    x = cat.indexX, y = cat.indexY;
    while (x >= 0 && y >= 0 && circleArray[y][x].getCircleType() != Circle.TYPE_SELECTED) {
        x = y % 2 == 0 ? x : x - 1;
        y--;
    }
    if (x < 0) {
        distMap.push({dir: MOVE_LEFT_UP, dist: cat.indexY - y + 1, pass: true});
    } else if (y < 0) {
        distMap.push({dir: MOVE_LEFT_UP, dist: cat.indexY + 1, pass: true});
    } else {
        distMap.push({dir: MOVE_LEFT_UP, dist: cat.indexY - y, pass: false});
    }

    // left down
    x = cat.indexX, y = cat.indexY;
    while (x >= 0 && y < ROW && circleArray[y][x].getCircleType() != Circle.TYPE_SELECTED) {
        x = y % 2 == 0 ? x : x - 1;
        y++;
    }
    if (x < 0) {
        distMap.push({dir: MOVE_LEFT_DOWN, dist: y - cat.indexY + 1, pass: true});
    } else if (y >= ROW) {
        distMap.push({dir: MOVE_LEFT_DOWN, dist: ROW - cat.indexY, pass: true});
    } else {
        distMap.push({dir: MOVE_LEFT_DOWN, dist: y - cat.indexY, pass: false});
    }

    // right up
    x = cat.indexX, y = cat.indexY;
    while (x < COL && y >= 0 && circleArray[y][x].getCircleType() != Circle.TYPE_SELECTED) {
        x = y % 2 == 0 ? x + 1 : x;
        y--;
    }
    if (x >= COL) {
        distMap.push({dir: MOVE_RIGHT_UP, dist: cat.indexY - y + 1, pass: true});
    } else if (y < 0) {
        distMap.push({dir: MOVE_RIGHT_UP, dist: cat.indexY - y, pass: true});
    } else {
        distMap.push({dir: MOVE_RIGHT_UP, dist: cat.indexY - y, pass: false});
    }

    // right down
    x = cat.indexX, y = cat.indexY;
    while (x < COL && y < ROW && circleArray[y][x].getCircleType() != Circle.TYPE_SELECTED) {
        x = y % 2 == 0 ? x + 1 : x;
        y++;
    }
    if (x >= COL) {
        distMap.push({dir: MOVE_RIGHT_DOWN, dist: y - cat.indexY + 1, pass: true});
    } else if (y >= ROW) {
        distMap.push({dir: MOVE_RIGHT_DOWN, dist: ROW - cat.indexY, pass: true});
    } else {
        distMap.push({dir: MOVE_RIGHT_DOWN, dist: y - cat.indexY, pass: false});
    }

    var minDist = 10, minDir,
        maxDist = -1, maxDir;
    for (var i = 0; i < distMap.length; i++) {
        if (distMap[i].pass) {
            // 最短距离可以逃跑的方向
            if (minDist > distMap[i].dist) {
                minDist = distMap[i].dist;
                minDir = distMap[i].dir;
            }
        } else {
            // 最长距离不可以逃跑的方向
            if (maxDist < distMap[i].dist) {
                maxDist = distMap[i].dist;
                maxDir = distMap[i].dir;
            }
        }
    }

    if (minDist < 10) {
        return minDir;
    } else if (maxDist > 1) {
        return maxDir;
    } else {
        return MOVE_NONE;
    }
}
