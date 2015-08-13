/*
	Глобальные настройки
*/
// Настройки игры
var maxRound = 2; //Сколько кругов нужно проехать
var botSpeed = 0; //Скорость бота относительно игрока

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// загрузка спрайтов
var spriteImage = new Image();
spriteImage.src = "i/sprite.png";
var patternImage = new Image();
patternImage.src = "i/pattern.jpg";

// нажатия клавиш и мыши
var up = false; 
var down = false; 
var left = false; 
var right = false;
var mousePos = [-1, -1];

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);
$("#game").mousedown(mouseDown);
$(document).mouseup(mouseUp);


/*
	Нажатия
*/
function onKeyDown(evt) {
	if (evt.keyCode == 39) right = true;
	else if (evt.keyCode == 37) left = true;
	else if (evt.keyCode == 38) up = true;
	else if (evt.keyCode == 40) down = true;
	if(up || down){
		evt.preventDefault();
	}
}
function onKeyUp(evt) {
	if (evt.keyCode == 39) right = false;
	else if (evt.keyCode == 37) left = false;
	else if (evt.keyCode == 38) up = false ;
	else if (evt.keyCode == 40) down = false ;
}
function mouseDown(evt) {
	var canvasPos = $(this).offset();
	var mouseX = (evt.pageX - canvasPos.left);
	var mouseY = (evt.pageY - canvasPos.top);
	mousePos[0] = mouseX;
	mousePos[1] = mouseY;
}
function mouseUp(evt) {
	mousePos[0] = -1;
	mousePos[1] = -1;
}


/*
	Проверяет входит ли точка в квадратную область
	x1,y1 - координаты точки, 
	x2,y2 - начальные координаты проверяемой области, 
	sizeX,sizeY - размер области.
*/
function collisePoint(x1,y1, x2,y2,sizeX,sizeY) {
	if (
		x1 > x2 && 
		x1 < x2+sizeX &&
		y1 > y2 &&
		y1 < y2+sizeY) 
	{
		return true;
	} else {
		return false;
	};
}


/*
	Проверяет пересечение двух линий
*/
function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return true;
}

/*
	Возвращает углы которыми машинка каснулась препятствия
	objAngles - углы препятствия
	carAngles - углы машинки
*/
function collisionAngles(objAngles, carAngles) {
  p = objAngles;
  c = carAngles;
  collAngles = [];
  // каждый угол машинки сравнивается с каждым углом препятствия
  for (var CarL in carAngles) { 
    for (var PropL in objAngles) {
      if (lineIntersect(
          Math.floor(p[PropL].A[0]),
          Math.floor(p[PropL].A[1]),
          Math.floor(p[PropL].B[0]),
          Math.floor(p[PropL].B[1]), 

          Math.floor(c[CarL].A[0]),
          Math.floor(c[CarL].A[1]),
          Math.floor(c[CarL].B[0]),
          Math.floor(c[CarL].B[1]))) {
        collAngles.push(CarL);
      }

    }
  }
  return collAngles;
}