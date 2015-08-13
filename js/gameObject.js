
/*
  Игровые объекты
*/
var GameObject = Backbone.Model.extend({
  defaults: {
    pos: [0,0],
    size: [0,0],
    sprPos: [0,0],
    sprSize: [0,0],
    angle: 0,
    image: spriteImage,
    offset: [0, 0],
  },

  /*
    Отрисовка игровых объектов
  */
  render: function() {
    ctx.beginPath();
    ctx.save()
    ctx.translate(this.get("pos")[0], this.get("pos")[1]);
    ctx.rotate(this.get("angle")); 
    ctx.rect(-this.get("pos")[0]/2, -this.get("pos")[1]/2, this.get("pos")[0], this.get("pos")[1]);
    
    ctx.drawImage(this.get("image"), 
      this.get("sprPos")[0], 
      this.get("sprPos")[1], 
      this.get("sprSize")[0], 
      this.get("sprSize")[1], 
      -this.get("sprSize")[0]/2 + this.get("offset")[0], 
      -this.get("sprSize")[1]/2 + this.get("offset")[1], 
      this.get("sprSize")[0], 
      this.get("sprSize")[1]);
    ctx.restore()
    ctx.closePath();
  },

  /*
    Вернет все углы обьекта
  */
  getAngles: function() {
    var carAngles = {};
      // поиск углов относительно центра машинки и её поворота
      var halfW = Number(this.get("size")[0])/2;
      var halfH = Number(this.get("size")[1])/2
      var c = Math.sqrt(halfH*halfH + halfW*halfW);
      var rotatePoint = Math.asin(halfH/c);

      var tx = Math.cos(Number(this.get("angle"))+rotatePoint) * c;
      var ty = Math.sin(Number(this.get("angle"))+rotatePoint) * c; 
      var tx2 = Math.cos(Number(this.get("angle"))-rotatePoint) * c;
      var ty2 = Math.sin(Number(this.get("angle"))-rotatePoint) * c; 

      var x = Number(this.get("pos")[0]); 
      var y = Number(this.get("pos")[1]);

      // координаты углов машинки
      var frontL = [x-tx2, y-ty2]; //фронт лево
      var frontR = [x-tx, y-ty]; //фронт право
      var backL = [x+tx, y+ty]; //зад лево
      var backR = [x+tx2, y+ty2]; //зад право

    var carAngles = {
      front: {A: frontL, B: frontR},
      back: {A: backL, B: backR},
      left: {A: frontL, B: backL},
      right: {A: frontR, B: backR},
    }

    return carAngles;
  },  

}) 

