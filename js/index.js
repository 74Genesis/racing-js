

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

// Препятствия
var obstacles = new Obstacles([
	{pos: [356,31]},
	{pos: [129,161]},
	{pos: [45,260]},
	{pos: [180,377]},
	{pos: [550,560]},
	{pos: [510,290]},
]);

// Создание трека
var track = new Track();

// Создание машинки
var carObject = new CarObject()

// Коллекция машинок
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
		startTimer: true, //Таймер до начала гонки
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
 					if (collisePoint(mousePos[0], mousePos[1], 300, 400, 200, 60)) {
			 			this.restart(); //Рестарт
		 			}
 				}
 			} else {
	 			this.renderBack();
	 			var carsCoor = carCollection.carsCoor() // Координаты центра всех машинок
	 			var carsOnTrack = track.render(carsCoor); // Находится ли машинки на треке
	 			
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

	 			// Проверка на то что машинка проехала ворота
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
		// Обновить машинки
		carCollection.reset(carsArray);
		// Обновить настройки
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
		// Фон
		ctx.beginPath();
		ctx.fillStyle = "#434A54";
		ctx.rect(0,0, canvas.width, canvas.height);
		ctx.fill();

		// Текст
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '30px calibri';
		ctx.fillText("Select car:", 340, 170);

		// Клетки для выбора машинки
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

		// Крутящиеся машинки
 		newAngle = startCar.get("angle") + 0.005;

 		startCar.set({angle: newAngle});
 		startCar.set({carActive: 1, pos: [335,250]});
 		startCar.render()
 		startCar.set({carActive: 3, pos: [465,250]});
 		startCar.render()

		// Кнопка старт
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
		// Выключаем таймер
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

		// Кнопка рестарта
		ctx.beginPath();
		ctx.fillStyle = "#42C05C";
		ctx.rect(300, 400, 200, 60);
		ctx.fill()
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '35px calibri';
		ctx.fillText("Restart", 350, 440);
	}
})

var mainModel = new MainModel(); 

$( document ).ready(function() {

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
		mainModel.update(dt); //Обновление всей игры
		requestAnimationFrame(gameLoop);
	}
}

gameLoop();

});