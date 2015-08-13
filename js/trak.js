
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