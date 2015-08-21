G.player = new G.Entity();
G.player.width = 32;
G.player.height = 32;
G.player.radius = 16;
G.player.gravity = G.const.P_GRAVITY;
G.player.setCoords(400, 100);

G.player.draw = function(ctx) {
    var p = G.player; 
    
    ctx.beginPath();
    ctx.arc(this.xx, this.yy, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
};

G.player.moveLeft = function() {
    //console.log('moving left');
    this.dx -= G.const.P_SPEED;
};

G.player.moveRight = function() {
     //console.log('moving right');
    this.dx += G.const.P_SPEED;
};

G.player.moveUp = function() {
    //if(this.onGround()){
        this.dy = -G.const.P_JUMP;
    //}
};
    
G.player.moveDown = function() {
        this.dy += G.const.P_SPEED;
    };


G.player.inputUpdate = function() {
  if (G.Key.isDown(G.Key.UP)) this.moveUp();
  if (G.Key.isDown(G.Key.SPACE)) this.moveUp();
  if (G.Key.isDown(G.Key.z)) this.moveUp();
  if (G.Key.isDown(G.Key.DOWN)) this.moveDown();
  if (G.Key.isDown(G.Key.LEFT)) this.moveLeft();
  if (G.Key.isDown(G.Key.RIGHT)) this.moveRight();
  
  if(this.yy > (G.const.GRID * G.const.HEIGHT) + this.radius) this.setCoords(this.xx, -this.radius);
  
};