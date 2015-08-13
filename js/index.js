$( document ).ready(function() {

// Группы контрольных точек по которым ездит автопилот
var cpointGroup = [
	[
		[355, 67],
		[370, 123],
	],
	[
		[150, 38],
		[81, 77],
		[151, 86],
	],
	[
		[99, 256]
	],
	[
		[85, 498],
		[119, 464],
		[42.5, 459],
	],
	[
		[235.5, 325],
	],
	[
		[351.5, 421],
		[379.5, 328],
	],
	[
		[366.5, 498],
	],
	[
		[545, 489],
		[548, 518],
	],
	[
		[679, 494],
		[683, 541],
	],
	[
		[504, 334],
		[589.5, 332],
	],
	[
		[682, 177],
		[702.5, 214],
	],
	[
		[511, 63]
	]
];

// Ворота в которые должен проехать игрок
var playerGates = [
	{A: [470,12], B:[470,124]},
	{A: [300,12], B:[300,124]},
	{A: [44,51], B:[135,129]},
	{A: [17,282], B:[132,282]},
	{A: [148,463], B:[148,578]},
	{A: [289,199], B:[289,312]},
	{A: [415,469], B:[362,573]},
	{A: [679,471], B:[794,476]},
	{A: [438,295], B:[586,295]},
	{A: [674,139], B:[787,139]},
];

/*
	Препятствия
*/
var ObstaclesObject = GameObject.extend({
	// свойства спрайта препятствия
	defaults: $.extend(GameObject.prototype.defaults, {
		size: [24,24],
		sprPos: [0,37],
		sprSize: [26, 26],
		offset:[-1,-1],
	}),
})


var Obstacles = Backbone.Collection.extend({
	model: ObstaclesObject,
	renderAll: function() {
		_.each(this.models, function(model){
			model.render();
		});
	}
});
var obstacles = new Obstacles([
	{pos: [356,31]},
	{pos: [129,161]},
	{pos: [45,260]},
	{pos: [180,377]},
	{pos: [550,560]},
	{pos: [510,290]},
]);


/*
	Трек
*/
var Track = Backbone.Model.extend({
	/*
		Отрисовка трека
		Принимает массив координат машин
		Вернет массив с указанием: входит ли координаты в пределы трека
	*/
	render: function(arrPos) {
		var outsideCheck = []; //Вхождение координат во внешний контур
		var insideCheck = []; //Вхождение координат во внутренний контур
		var resArr = [];

		// внешний контур трассы
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "#4F5252";
		ctx.moveTo(195,17);
		ctx.bezierCurveTo(79.182,17,23.847,38.163,23.848,145.438);
		ctx.bezierCurveTo(23.849,273.281,23.583,395.222,23.848,430.825);
		ctx.bezierCurveTo(23.974,447.848,46.813,571.669,147.04,571.67);
		ctx.bezierCurveTo(232.652,571.670,271.796,489.177,271.859,430.824);
		ctx.bezierCurveTo(271.89,402.005,271.878,340.048,271.859,330.472);
		ctx.bezierCurveTo(271.796,298.549,303.847,294.988,303.9,330.472);
		ctx.bezierCurveTo(304,397.567,304.221,421.575,303.9,456.031);
		ctx.bezierCurveTo(303.381,511.625,345.926,578.382,407.673,578.366);
		ctx.bezierCurveTo(483.999,578.345,620.098,578.362,646.388,578.366);
		ctx.bezierCurveTo(707.423,578.376,788.291,550.271,788.553,482.149);
		ctx.bezierCurveTo(788.789,420.566,753.361,385.29,719.168,363.626);
		ctx.bezierCurveTo(692.926,346.998,605.118,312.251,589.45,304.902);
		ctx.bezierCurveTo(574.058,297.683,571.598,290.623,599.037,283);
		ctx.bezierCurveTo(613.892,278.873,664.831,272.737,707.952,252.698);
		ctx.bezierCurveTo(741.578,237.072,779.588,193.728,779.47,146.729);
		ctx.bezierCurveTo(779.206,42.327,703.774,18.05,628.288,18);
		ctx.bezierCurveTo(556.565,17.952,259.993,17,195,17);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		// Проверка вхождения координат во внешний контур
		for (var i = 0; i < arrPos.length; i++) {
			outsideCheck[i] = ctx.isPointInPath(arrPos[i][0], arrPos[i][1]);
		};

		// Внутренний контур трека
		ctx.save();
		ctx.beginPath();
		var pattern = ctx.createPattern(patternImage, 'repeat');
		ctx.fillStyle = pattern;
		ctx.moveTo(125.213,139.303);
		ctx.bezierCurveTo(125.213,124.169,134.362,118.023,152.923,117.801);
		ctx.bezierCurveTo(179.407,117.483,640.75,117.825,648.75,117.801);
		ctx.bezierCurveTo(684.84,117.693,698.02,155.75,647.71,168.37);
		ctx.bezierCurveTo(621.027,175.062,538.928,195.537,524.899,199.981);
		ctx.bezierCurveTo(483.738,213.021,450.571,243.965,447,279);
		ctx.bezierCurveTo(443.573,312.619,453.33,337.497,486.314,362.012);
		ctx.bezierCurveTo(530.159,394.598,644.944,437.718,653.889,442.698);
		ctx.bezierCurveTo(678.845,456.591,709.568,480.123,658.976,480.12);
		ctx.bezierCurveTo(604.463,480.123,437.707,480.11,430.794,480.12);
		ctx.bezierCurveTo(411.519,480.155,402.332,473.693,402.452,453.236);
		ctx.bezierCurveTo(402.64,420.851,402.815,331.514,402.452,311.168);
		ctx.bezierCurveTo(402.089,290.821,373.386,206.888,291.633,204.70);
		ctx.bezierCurveTo(209.879,202.528,172.09,273.38,171.364,326.429);
		ctx.bezierCurveTo(170.638,379.478,171.347,410.557,171.363,424.001);
		ctx.bezierCurveTo(171.434,485.094,125.211,486.997,125.211,424.001);
		ctx.bezierCurveTo(125.213,338.503,125.213,139.303,125.213,139.303);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		// Проверка вхождения координат во внутренний контур
		for (var i = 0; i < arrPos.length; i++) {
			insideCheck[i] = ctx.isPointInPath(arrPos[i][0], arrPos[i][1]);
		};
		for (var i = 0; i < arrPos.length; i++) {
			if (outsideCheck[i] == true && insideCheck[i] == false) {
				resArr[i] = true;
			} else {
				resArr[i] = false;
			}
		};

		// линия старта
		ctx.beginPath()
		ctx.fillStyle = "#898989";
		ctx.rect(467, 18, 7, 100);
		ctx.fill()

		return resArr;
	}
})

var track = new Track();


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

	// func: function() {
	// 	GameObject.prototype.func.apply(this, arguments);
	// },


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

var carObject = new CarObject()


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

var carsArray = [
	{ 
		autopilot: true,
		pos: [610,45],
		size: [78,33],
		sprPos: [0,0],
		sprSize: [82,37],
		offset: [-2, -2],
		carActive: 2,
		round: -1,
		winner: false,
	},
	{
		autopilot: true,
		pos: [520,90],
		size: [78,33],
		sprPos: [0,0],
		sprSize: [82,37],
		offset: [-2, -2],
		carActive: 2,
		round: -1,
		winner: false,
	},
	{ 
		pos: [520,45],
		size: [78,33],
		sprPos: [0,0],
		sprSize: [82,37],
		offset: [-2, -2],
		carActive: 1,
		angle: 0,
		round: -1,
		winner: false,
	},
];

var carCollection = new CarCollection(carsArray);

// Машинка для стартового экрана
var startCar = new CarObject({
	sprPos: [0,0],
	sprSize: [82,37],
})


/*
	Основная модель
*/
var MainModel = Backbone.Model.extend({
	defaults: {
		time: 0,
		start: true,
		selectCar: 1, // Выбранная машинка
		startTimer: true, //таймер до начала гонки
		startTime: 0,

		// Скорости и углы поворота машинки игрока
		carSpeed: 0.17,
		carRotate: 0.002,
		minCarSpeed: 0.1,
		minCarRotate: 0.001,

		// Победитель
		winner: false,
		carWin: -1,
	},

	update: function(dt) {
 		ctx.clearRect(0,0,canvas.width,canvas.height);

 		// Если начало игры, вывести стартовый экран
 		if (this.get("start")) {
 			//Если нажата кнопка старт
 			if (collisePoint(mousePos[0],mousePos[1],300, 500, 200, 60)) {
 				// Включить таймер, убрать стартовый экран
 				this.set({
 					start: false,
 					startTimer: true,
 					startTime: new Date().getTime(),
 				});
 				// Изменить машинку игрока на выбранную
 				var playerModels = carCollection.where({autopilot: false});
 				if (playerModels.length > 0) {
 					var carActive = Number(this.get("selectCar"));
 					playerModels[0].set({carActive: carActive});
 				}
 			}

 			// Определить какая машинка выбрана 
	 		if (collisePoint(mousePos[0], mousePos[1], 400 - 30/2 - 100, 200, 100, 100)) {
	 			this.set({selectCar: 1});
	 		} else if (collisePoint(mousePos[0], mousePos[1], 400 + 30/2, 200, 100, 100)) {
	 			this.set({selectCar: 3});
	 		}
 			this.startRender()

 		// Началась игра
 		} else if (!this.get("start")) {
 			// Если работает таймер или есть победитель, не двигать машинки
 			if (this.get("startTimer") || this.get("winner")) {
 				this.renderBack();
 				track.render([]);
 				obstacles.renderAll();
 				carCollection.renderAllCars();
 				this.renderGate();

 				if (this.get("startTimer"))
 					this.renderCountdown(); //Отсчёт времени до старта

 				if (this.get("winner")) {
 					this.renderWinner();
 					if (collisePoint(mousePos[0],mousePos[1],300, 450, 200, 60)) {
			 			this.restart(); //рестарт
		 			}
 				}
 			} else {
	 			this.renderBack();
	 			var carsCoor = carCollection.carsCoor() // координаты центра всех машинок
	 			var carsOnTrack = track.render(carsCoor); // находится ли машинки на треке
	 			
	 			// Снизить скорость машинкам которые заехали за трассу на 50%
	 			for (var i = 0; i < carsOnTrack.length; i++) {
	 				if (carsOnTrack[i]) {
			 			var speed = Number(this.get("carSpeed"));
			 			var rotate = Number(this.get("carRotate"));
	 					carCollection.models[i].set({speed: speed, rotate: rotate});
	 				} else {
			 			var speed = Number(this.get("minCarSpeed"));
			 			var rotate = Number(this.get("minCarRotate"));
	 					carCollection.models[i].set({speed: speed, rotate: rotate});
	 				}
	 			};

	 			carCollection.reConsider(dt);
	 			obstacles.renderAll();
	 			carCollection.renderAllCars();
	 			this.renderGate();

	 			// проверка на то что машинка проехала ворота
	 			carCollection.checkGateAll();

	 			// Есть ли победитель
	 			carCollection.allRound();

	 			var self = this;
	 			var i = 0;
	 			carCollection.each(function(model) {
	 				if (model.get("winner")) {
						self.set({
 							winner: true,
 							carWin: i
 						})
	 				}
	 				i++;
	 			})
 			}
 		}

	},

	/*
		Перезапускает игру
	*/
	restart: function() {
		// обновить машинки
		carCollection.reset(carsArray);
		console.log(carsArray);
		// обновить настройки
		this.set({
			start: true,
			selectCar: 1,
			startTimer: true, 
			startTime: 0,
			winner: false,
			carWin: -1,
		})
	},

	/*
		Выводит начальный экран
	*/
	startRender: function() {
		// фон
		ctx.beginPath();
		ctx.fillStyle = "#434A54";
		ctx.rect(0,0, canvas.width, canvas.height);
		ctx.fill();

		// текст
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '30px calibri';
		ctx.fillText("Select car:", 340, 170);

		// клетки для выбора машинки
		ctx.beginPath();
		ctx.fillStyle = "#AAB2BD";
		ctx.rect(400 - 30/2 - 100, 200, 100, 100);
		ctx.fill();
		if (this.get("selectCar") == 1) {
			ctx.strokeStyle = "#4ED069";
			ctx.lineWidth = 5;
			ctx.stroke();
		}

		ctx.beginPath();
		ctx.rect(400 + 30/2, 200, 100, 100);
		ctx.fill();
		if (this.get("selectCar") == 3) {
			ctx.strokeStyle = "#4ED069";
			ctx.lineWidth = 5;
			ctx.stroke();
		}

		// крутящиеся машинки
 		newAngle = startCar.get("angle") + 0.005;

 		startCar.set({angle: newAngle});
 		startCar.set({carActive: 1, pos: [335,250]});
 		startCar.render()
 		startCar.set({carActive: 3, pos: [465,250]});
 		startCar.render()

		// кнопка старт
		ctx.beginPath();
		ctx.fillStyle = "#42C05C";
		ctx.rect(300, 500, 200, 60);
		ctx.fill()
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '35px calibri';
		ctx.fillText("Start!", 360, 540);
	},

	/*
		Рисует фон
	*/
	renderBack: function() {
		ctx.beginPath();
		var pattern = ctx.createPattern(patternImage, 'repeat');
		ctx.fillStyle = pattern;
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
    	ctx.closePath();
	},

	/*
		Рисует все ворота через которые игрок должен проехать
	*/
	renderGate: function() {
		var carPlayer = carCollection.where({autopilot: false});
		for (var i = 0; i < playerGates.length; i++) {
			ctx.beginPath();
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			if (carPlayer.length > 0) {
				if (i == carPlayer[0].get("activeGate")) {
					ctx.fillStyle = "#4972FF";
				}
			}
			ctx.arc(playerGates[i].A[0], playerGates[i].A[1], 5, 0, Math.PI*2, false); 
			ctx.arc(playerGates[i].B[0], playerGates[i].B[1], 5, 0, Math.PI*2, false); 
			ctx.fill();
		};
	},

	/*
		Отсчёт времени до старта
	*/
	renderCountdown: function() {
		var newTime = new Date().getTime();
		var startTime = Number(this.get("startTime"));
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.lineWidth = 1;
		ctx.font = 'bold 400px calibri';
		
		// Прошло меньше одной секунды, рисуем: 3
		if (newTime-startTime < 1000) {
			ctx.fillText("3", 300, 400);
			ctx.strokeText("3", 300, 400);
		}
		// Рисуем 2
		if (newTime-startTime > 1000 && newTime-startTime < 2000) {
			ctx.fillText("2", 300, 400);
			ctx.strokeText("2", 300, 400);
		}
		// Рисуем 3
		if (newTime-startTime > 2000 && newTime-startTime < 3000) {
			ctx.fillText("1", 300, 400);
			ctx.strokeText("1", 300, 400);
		}		
		// выключаем таймер
		if (newTime-startTime > 3000) {
			this.set({startTimer: false});
		}

		ctx.closePath();
	},

	/*
		Выводит победителя
	*/
	renderWinner: function() {
		var carWin = Number(this.get("carWin"));
		ctx.beginPath();
		ctx.fillStyle = "rgba(64, 66, 66, 0.85)";
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = "#D1D9D9";
		ctx.font = 'bold 100px calibri';
		if (carCollection.models[carWin] && carCollection.models[carWin].get("autopilot") == false) {
			ctx.fillText("Победил Игрок", 75, 300);
		} else {
			ctx.font = 'bold 90px calibri';
			ctx.fillText("Победила дружба", 45, 300);
		}
		ctx.fill();

		// кнопка рестарта
		ctx.beginPath();
		ctx.fillStyle = "#42C05C";
		ctx.rect(300, 450, 200, 60);
		ctx.fill()
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '35px calibri';
		ctx.fillText("Restart", 350, 490);
	}
})

var mainModel = new MainModel(); 


// Отключение цикла игры при уходе со страницы
$(window).blur(function() {
	stop = true
});

$(window).focus(function() {
	stop = false
	gameLoop();
});

/*
	Игровой цикл
*/
var stop = false;
function gameLoop() {
	var now = new Date().getTime(),
	dt = now - (mainModel.get("time") || now);
	mainModel.set({time: now});

	if (stop !== true) {
		mainModel.update(dt); //обновление всей игры
		requestAnimationFrame(gameLoop);
	}
}

gameLoop();

});