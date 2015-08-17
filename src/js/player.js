G.player = new G.Entity();
G.player.width = 16;
G.player.height = 16;
G.player.setCoords(400, 300);

//G.player.prototype = G.Entity();

G.player.draw = function(ctx) {
    var p = G.player; 
    ctx.fillStyle = 'red';
    ctx.fillRect(this.xx, this.yy, this.width, this.height);
};

G.player.moveLeft = function() {
    console.log('moving left');
    this.dx -= G.const.P_SPEED;
};

G.player.moveRight = function() {
     console.log('moving right');
    this.dx += G.const.P_SPEED;
};

G.player.jump = function() {
    if(this.onGround() ){
        console.log('jumping');
        this.dy += -.05;
    }
};

G.player.inputUpdate = function() {
  if (G.Key.isDown(G.Key.UP)) G.player.jump();
  if (G.Key.isDown(G.Key.LEFT)) this.moveLeft();
  if (G.Key.isDown(G.Key.RIGHT)) this.moveRight();
};