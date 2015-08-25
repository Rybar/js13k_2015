G.player = new G.Entity();
G.player.width = 16;
G.player.height = 16;
G.player.radius = 8;
G.player.gravity = G.const.P_GRAVITY;
G.player.setCoords(200, 100);
G.player.flipped = false;
G.player.map=[];

G.player.draw = function(ctx, xView, yView) {
    var p = G.player; 
    
    if(this.flipped){
        
        ctx.beginPath();
        ctx.fillStyle = this.flipped ? 'red' : 'purple';
        ctx.moveTo(this.xx-8-xView, this.yy+8-yView);
        ctx.lineTo(this.xx+8-xView, this.yy+8-yView);
        ctx.lineTo(this.xx-xView, this.yy-8-yView);
        ctx.lineTo(this.xx-8-xView, this.yy+8-yView);
        ctx.fill();
        
    }
    else {
        
        ctx.beginPath();
        ctx.fillStyle = this.flipped ? 'red' : 'purple';
        ctx.moveTo(this.xx-xView, this.yy+8-yView);
        ctx.lineTo(this.xx-8-xView, this.yy-8-yView);
        ctx.lineTo(this.xx+8-xView, this.yy-8-yView);
        ctx.lineTo(this.xx-xView, this.yy+8-yView);
        ctx.fill();
        
    }
    
    
    //ctx.arc(this.xx - xView, this.yy - yView, this.radius, 0, 2 * Math.PI, false);
    //ctx.fillStyle = this.flipped ? 'red' : 'purple';
    //ctx.stroke();
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
    
  if (G.Key.isDown(G.Key.UP) || G.Key.isDown(G.Key.SPACE) || G.Key.isDown(G.Key.z)){
       this.moveUp();
  }
  
  //if (G.Key.isDown(G.Key.DOWN)) this.moveDown();
  if (G.Key.isDown(G.Key.LEFT)) this.moveLeft();
  if (G.Key.isDown(G.Key.RIGHT)) this.moveRight();
  
//-------flip mechanic handling---------------
  if (G.Key.justReleased(G.Key.x)){
      if(this.onGround()){
        G.flipMap(G.player.map); 
        this.flipped = !this.flipped;
        this.setCoords(this.xx, this.yy+G.const.GRID); // 'teleport' down 1 space
      }
      else if(this.onCeiling()){ //if flying and touching ceiling...
        G.flipMap(G.player.map); 
        this.flipped = !this.flipped;
        this.setCoords(this.xx, this.yy-G.const.GRID); // up
      }
  } 
  
  
//vertical screen wrap  
  if(this.yy > (G.const.GRID * G.const.HEIGHT) + this.radius) this.setCoords(this.xx, -this.radius);
  
};