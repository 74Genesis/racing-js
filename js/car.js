/*
	Игровой объект - машинка
*/
var CarObject = GameObject.extend({
	// Свойства родетеля + новые
	defaults: $.extend(GameObject.prototype.defaults, {
		autopilot: false,
		offset: [0, 0], // Смещение картинки относительно прямоугольника машинки
		carActive: 1, // Картинка машинки (берется из спрайта)
		rotate: 0.0025, // Угол на который она поворачивается
		speed: 0.2, //Скорость машинки 
		activeGate: 0, //Ворота к которым должен ехать игрок
		round: -1, // Кол-во проеханных кругов
		cGroup: 0, // Группа с точками для автопилота
		cPoint: 0, // Точка из группы к которой поедет автопилот
		winner: false, // Если машинка проехала все круги - true
	}),

	/*
		Отрисовка машинки
	*/
	render: function() {
		var sprX = (this.get("sprSize")[0] * (this.get("carActive")-1)) + this.get("sprPos")[0];
		var sprY = this.get("sprPos")[1];
		ctx.beginPath();
		ctx.save()
		ctx.translate(this.get("pos")[0], this.get("pos")[1]);
		ctx.rotate(this.get("angle")); 
		ctx.rect(-this.get("pos")[0]/2, -this.get("pos")[1]/2, this.get("pos")[0], this.get("pos")[1]);
		
		ctx.drawImage(this.get("image"), 
			sprX, sprY, 
			this.get("sprSize")[0], this.get("sprSize")[1], 
			-this.get("sprSize")[0]/2 + this.get("offset")[0], -this.get("sprSize")[1]/2 + this.get("offset")[1], 
			this.get("sprSize")[0], this.get("sprSize")[1]);
		ctx.restore()
		ctx.closePath();

		this.getCenterLine()
	},

	initialize: function() {
		this.on("change:angle", function() {
			this.overAngle();
		});
		this.on("change:pos", function(model, pos) {
			this.set({oldPos: this.previous("pos")});
		});
	},

	/*
		Следит за тем чтобы угол поворота не уходил за предел возможного
	*/
	overAngle: function() {
		if (this.get("angle") < 0) {
			this.set({angle: Math.PI*2 - Math.abs(this.get("angle"))})
		}
		if (this.get("angle") > Math.PI*2) {
			this.set({angle: 0 + (this.get("angle") - Math.PI*2)})
		}
	},

	/*
		Вернет координаты линии которые проходят по центру машинки
	*/
	getCenterLine: function() {
	    var tx = Math.cos(Number(this.get("angle"))) * Number(this.get("size")[0])/2;
	    var ty = Math.sin(Number(this.get("angle"))) * Number(this.get("size")[0])/2; 

	    var x = Number(this.get("pos")[0]); 
	    var y = Number(this.get("pos")[1]);

		return {A:[x+tx, y+ty], B:[x-tx, y-ty]};
	},

	/*
		Слежение за воротами которые проехала машинка
	*/
	checkGate: function() {
		var carLine = this.getCenterLine(); //линия машинки
		var activeGate = Number(this.get("activeGate")); //активные ворота
		var round = Number(this.get("round")); //Кол-во кругов
		var gateLine = playerGates[activeGate]; // линия ворот
		var collis = lineIntersect(
			Math.floor(gateLine.A[0]),
			Math.floor(gateLine.A[1]),
			Math.floor(gateLine.B[0]),
			Math.floor(gateLine.B[1]),
			Math.floor(carLine.A[0]),
			Math.floor(carLine.A[1]),
			Math.floor(carLine.B[0]),
			Math.floor(carLine.B[1])
		);

		// Если линии машинки и ворот пересеклись
		if (collis) {
			// Если это последняя точка, добавить круг и ехать к первой
			if (activeGate == playerGates.length-1) {
				this.set({activeGate: 0});
			} else {
				this.set({activeGate: activeGate+1});
				if (activeGate == 0) {
					this.set({round: round+1})
				}
			}

		}
	},

	/*
		Обновление точки к которой едет автопилот если машинка уже доехала
	*/
	updCPoint: function() {
		// группа и точка к которой движется машинка
		var cGroup = Number(this.get("cGroup"));
		var cPoint = Number(this.get("cPoint"));
		var newCGroup, newCPoint;

		// координаты машинки
		var x = Number(this.get("pos")[0]);
		var y = Number(this.get("pos")[1]);

		// если машинка находится в текущей выбранной точке, переключиться на новую
		// учитывается радиус 3 пикселя вокруг точки
		var carInPoint = collisePoint(
			x, y, 
			cpointGroup[cGroup][cPoint][0]-3, 
			cpointGroup[cGroup][cPoint][1]-3, 
			6, 6
		);
		if (carInPoint) {
			// обновление группы
			if (cGroup == cpointGroup.length-1) {
				newCGroup = 0;
				this.set({cGroup: newCGroup});
			} else {
				newCGroup = cGroup+1;
				this.set({cGroup: newCGroup});
			}

			// Обновление точки
			var newCPoint = Math.round((Math.random() * (cpointGroup[newCGroup].length-1 - 0) + 0));
			this.set({cPoint: newCPoint});
		}
	},

	/*
		Возвращает угол на котором находится контрольная точка относительно машинки
	*/
	findCPointAngle: function() {
		// группа и точка к которой движется машинка
		var cGroup = Number(this.get("cGroup"));
		var cPoint = Number(this.get("cPoint"));

		var resAngle = 0; 
		var p = cpointGroup[cGroup][cPoint];

		// координаты машинки
		var x = Number(this.get("pos")[0]);
		var y = Number(this.get("pos")[1]);

		if (p[0]<x && p[1]<y) { //лево-верх
			var a = Math.abs(p[1]-y);
			var b = Math.abs(p[0]-x);
			var c = Math.sqrt(a*a + b*b); 
			var cAngle = Math.asin(a/c); //угол от искомой плоскости
			resAngle = 0 + cAngle; //угол от нуля
		}
		if (p[0]>x && p[1]<y) { //право-верх
			var a = Math.abs(p[0]-x);
			var b = Math.abs(p[1]-y);
			var c = Math.sqrt(a*a + b*b); 
			var cAngle = Math.asin(a/c); //угол от искомой плоскости
			resAngle = Math.PI/2 + cAngle; //угол от нуля
		}
		if (p[0]>x && p[1]>y) { //право-низ
			var a = Math.abs(p[1]-y);
			var b = Math.abs(p[0]-x);
			var c = Math.sqrt(a*a + b*b); 
			var cAngle = Math.asin(a/c); //угол от искомой плоскости
			resAngle = Math.PI + cAngle; //угол от нуля
		}
		if (p[0]<x && p[1]>y) { //лево-низ
			var a = Math.abs(p[0]-x);
			var b = Math.abs(p[1]-y);
			var c = Math.sqrt(a*a + b*b); 
			var cAngle = Math.asin(a/c); //угол от искомой плоскости
			resAngle = Math.PI + Math.PI/2 + cAngle; //угол от нуля
		}

		// Если углы на одной линии с машинкой
		if (p[0]==x && p[1]<y) { resAngle = Math.PI/2; } //верх
		if (p[0]==x && p[1]>y) { resAngle = Math.PI + Math.PI/2; } //низ
		if (p[0]<x && p[1]==y) { resAngle = 0; } //лево
		if (p[0]>x && p[1]==y) { resAngle = Math.PI; } //право

		return resAngle;
	},

	/*
		Определяет в какую сторону поворачивать машинку
		Вернет "+" или "-" для увеличения или уменьшения угла машинки и угол между машинкой и точкой
		cPointAngle - угол на котором находится контрольная точка относительно машинки
	*/
	sideRotate: function(cPointAngle) {
		var carAngle = Number(this.get("angle")); // угол машинки
		var diffAngle = 0; //угол между точкой и машинкой
		if (carAngle < cPointAngle) {
			diffAngle = cPointAngle - carAngle;
			if (diffAngle >= Math.PI) {
				return ["-", diffAngle];
			} else {
				return ["+", diffAngle];
			}
		} else if (carAngle > cPointAngle) {
			diffAngle = carAngle - cPointAngle;
			if (diffAngle >= Math.PI) {
				return ["+", diffAngle];
			} else {
				return ["-", diffAngle];
			}
		} else {
			return ["+", diffAngle];
		}
	},

})


/*
	Коллекция машинок
*/
var CarCollection = Backbone.Collection.extend({
	model: CarObject,

	/*
		Возвращает координаты центра всех машинок
	*/
	carsCoor: function() {
		var carsCoorRes = [];
		var i = 0;
		_.each(this.models, function(model){
			carsCoorRes[i] = model.get("pos");
			i++;
		});
		return carsCoorRes;
	},

	/*
		Рисует все машинки
	*/
	renderAllCars: function() {
		_.each(this.models, function(model){
			model.render();
		});
	},

	/*
		Пересчёт позиций всех машинок
	*/
	reConsider: function(dt) {
		var self = this;
		_.each(this.models, function(model){
			var newX = Number(model.get("pos")[0]);
			var newY = Number(model.get("pos")[1]);
			var newAngle = Number(model.get("angle"));
			
			var oldX = newX;
			var oldY = newY;
			if (!model.get("autopilot")) { //Игрок
				var clsCheck = self.objCollision();
				// расчет новой позиции
				if (up) {
					if (clsCheck.indexOf("front") == -1) {
						newX -= Math.cos(Number(model.get("angle"))) * Number(model.get("speed")) * dt;
						newY -= Math.sin(Number(model.get("angle"))) * Number(model.get("speed")) * dt; 
					} 
				}
				if (down) {
					if (clsCheck.indexOf("back") == -1) {
						newX += Math.cos(Number(model.get("angle"))) * Number(model.get("speed")) * dt;
						newY += Math.sin(Number(model.get("angle"))) * Number(model.get("speed")) * dt;
					} 
				}

				// расчет угла
				if (left && (up || down)) {
					if (clsCheck.indexOf("left") == -1 && (oldY-newY != 0 || oldX-newX != 0)) { //блокировка поворота при столкновении бортом
						if (left && up) {
							newAngle -= Number(model.get("rotate")) * dt;	
						}
						if (left && down) {
							newAngle += Number(model.get("rotate")) * dt;
						}
					}
				}
				if (right && (up || down)) {
					if (clsCheck.indexOf("right") == -1 && (oldY-newY != 0 || oldX-newX != 0)) { //блокировка поворота при столкновении бортом
						if (right && up) {
							newAngle += Number(model.get("rotate")) * dt;
						}
						if (right && down) {
							newAngle -= Number(model.get("rotate")) * dt;
						}
					}
				}

			} else { // Автопилот
				// Группа и точка к которой движется машинка
				var cGroup = Number(model.get("cGroup"));
				var cPoint = Number(model.get("cPoint"));

				// Обновить контрольную точку если машинка доехала до неё
				model.updCPoint();
				// Узнать угол к контрольной точке относительно машинки
				var cPointAngle = model.findCPointAngle(); 
				// Определить в какую сторону поворачивать
				var sideRotate = model.sideRotate(cPointAngle);


				// Движение вперед и поворот
				newX -= Math.cos(newAngle) * (Number(model.get("speed")) + botSpeed) * dt;
				newY -= Math.sin(newAngle) * (Number(model.get("speed")) + botSpeed) * dt; 
				var botRotate = 0.04;
				if (sideRotate[1] < 0.1) {
					botRotate = 0.01;
				}
				if (sideRotate[0] == "+") {
					newAngle += botRotate;
				} else {
					newAngle -= botRotate;
				}
			}

			// Обновление данных
			model.set({pos: [newX,newY], angle: newAngle});

		});
	},

	/*
		Проверяет машинку игрока на столкновение с препятствием
		Вернет массив сторон машинки которые коснулись препятствия
	*/
	objCollision: function() {
		var players = this.where({autopilot: false});
		var cls = []; //массивы со сторонами машинки которые задели препятствие 
		if (players.length > 0) {
			for (var i = 0; i < players.length; i++) {
				var carPos = players[i].get("pos");

				// Проходим по всем препятствиям
				var j = 0;
				obstacles.each(function(model) { 
					// Определение радиуса на котором начинать слежение за столкновением
					var radius = model.get("size")[0] + players[i].get("size")[0]/2 + players[i].get("size")[1]/2 ;
					var beginPoint = [
						(model.get("pos")[0] + model.get("size")[0]/2) - radius, 
						(model.get("pos")[1] + model.get("size")[1]/2) - radius
					];
					var size = [radius*2, radius*2];

					if (collisePoint(carPos[0],carPos[1], beginPoint[0],beginPoint[1], size[0],size[1])) {
						cls[j] = collisionAngles(model.getAngles(), players[i].getAngles());
					}
					j++;
				});
				// объеденить все массивы из cls
				var newCls = [];
				for (var i = 0; i < cls.length; i++) {
					if (cls[i] && cls[i].length > 0) {
						for (var j = 0; j < cls[i].length; j++) {
							newCls.push(cls[i][j]);
						};
					}
				};
				cls = newCls;
			}
		}
		if (cls.length > 0) {
			return cls;
		} else {
			return [];
		}
	},

	/*
		Вызывает проверку проезда ворот для всех машинок
	*/
	checkGateAll: function() {
		_.each(this.models, function(model){
 			model.checkGate();
 		})
	},

	/*
		Вернет победителя, либо false
	*/
	allRound: function() {
		_.each(this.models, function(model) {
 			if (Number(model.get("round")) >= maxRound) {
 				model.set({winner: true});
 			} 
 		});
	}

});