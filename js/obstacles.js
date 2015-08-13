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