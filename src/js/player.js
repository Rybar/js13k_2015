/*global G */
G.player = new G.Entity();
G.player.width = G.const.P_SIZE;
G.player.height = G.const.P_SIZE;
G.player.radius = 8;
G.player.gravity = G.const.P_GRAVITY;
// G.player.setCoords(G.const.WIDTH/2*G.const.GRID, G.const.HEIGHT/2*G.const.GRID);
G.player.setCoords(100,100);
G.player.flipped = false;
G.player.map=[];

G.player.draw = function(ctx, xView, yView) {
    
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
        // ctx.moveTo(this.xx-xView, this.yy+8-yView);
        // ctx.lineTo(this.xx-8-xView, this.yy-8-yView);
        // ctx.lineTo(this.xx+8-xView, this.yy-8-yView);
        // ctx.lineTo(this.xx-xView, this.yy+8-yView);
        ctx.fillRect(this.xx-this.width/2-xView, this.yy-this.height/2-yView, this.width, this.height);
        ctx.fill();
        
    }

};

G.player.moveLeft = function() {
    //console.log('moving left');
     if(this.flipped){
        this.dx -= G.const.P_SPEED;
    }
    else{
        this.dx -= G.const.P_THRUST;
        G.jetloop.volume.gain.value = 1;
    } 
};

G.player.moveRight = function() {
     //console.log('moving right');
    if(this.flipped){
        this.dx += G.const.P_SPEED;
    }
    else{
        this.dx += G.const.P_THRUST;
        G.jetloop.volume.gain.value = 1;
    //     var bullet = G.getParticle({
    //       x: G.player.xx+8,
    //       y: G.player.yy,
    //       dx: -0.3 + (Math.random()-1) * 2 * .01,
    //       dy: (Math.random()-1) * 2 * .01,
    //       width: 10,
    //       height: 10,
    //       life: 20,
    //       color: "orange",
    //       isBullet: false
          
    //   })
    } 
};

G.player.moveUp = function() {
    //if(this.onGround()){
        this.dy -= G.const.P_THRUST;
        G.jetloop.volume.gain.value = 1;
    //}
};

G.player.jump = function() {
    //if(this.onGround()){
        G.playSound(G.sounds.jump);
        this.dy = -G.const.P_JUMP;
    //}
};
    
G.player.moveDown = function() {
        this.dy += G.const.P_THRUST;
        G.jetloop.volume.gain.value = 1;
    };
G.player.flip = function () {
    if(this.onGround()){
          if(!this.flipped){ //point down can't flip through floor.
              //play buzzer?
          }
          else{
            G.flipMap(G.player.map); //red touching floor can flip.
            this.flipped = !this.flipped;
            this.setCoords(this.xx, this.yy+G.const.GRID); // 'teleport' down 1 space
            G.playSound(G.sounds.flip);
          }
      }
      else if(this.onCeiling()){ //if flying and touching ceiling...
      
        if(this.flipped){ //pointed up can't flip through ceiling.
           //play buzzer sound? 
        }
        else{ //we're purple and pointed down, flip it
            G.flipMap(G.player.map); 
            this.flipped = !this.flipped;
            this.setCoords(this.xx, this.yy-G.const.GRID); // up
            G.playSound(G.sounds.flip);
            }
      }
};


G.player.inputUpdate = function() {

    this.gravity = this.flipped ? G.const.P_GRAVITY : 0;
    this.frictY = this.flipped ? G.const.P_FRICTY : G.const.P_SPACEFRICT;
    this.frictX = this.flipped ? G.const.P_FRICTX : G.const.P_SPACEFRICT;
    
  if (G.Key.isDown(G.Key.UP) || G.Key.isDown(G.Key.w)){
    if(!this.flipped){
        this.moveUp();
    }
  }
  if(this.flipped && this.onGround() && (G.Key.isDown(G.Key.UP) || G.Key.isDown(G.Key.w) ) ){
        this.jump();
    }
  
  if (G.Key.isDown(G.Key.DOWN) || G.Key.isDown(G.Key.s) && !this.flipped) this.moveDown();
  if (G.Key.isDown(G.Key.LEFT) || G.Key.isDown(G.Key.a)) this.moveLeft();
  if (G.Key.isDown(G.Key.RIGHT) || G.Key.isDown(G.Key.d)) this.moveRight();
  if (G.Key.isDown(G.Key.x)){
      G.getParticle({
          x: G.player.xx+8,
          y: G.player.yy-7,
          dx: 0.5,
          dy: 0,
          width: 10,
          height: 10,
          life: 1000,
          isBullet: true
          
      })
          
  }
  
//------------------------------------------------------
//            flip mechanic handling     
//------------------------------------------------------
  if (G.Key.justReleased(G.Key.SPACE)){
      this.flip();
  } 
//------------------------------------------------------

// if (G.Key.justReleased(G.Key.s)){
//     G.cellFlip(this.cx, this.cy);
// }



  
//vertidcal screen wrap  
//if(this.yy > (G.const.GRID * G.const.HEIGHT) + this.radius) this.setCoords(this.xx, -this.radius);
//if(this.yy < 0 + this.radius) this.setCoords(this.xx, G.const.GRID * G.const.HEIGHT);

 if (G.Key.justReleased(G.Key.a) || G.Key.justReleased(G.Key.LEFT)
 || G.Key.justReleased(G.Key.w) || G.Key.justReleased(G.Key.UP)
|| G.Key.justReleased(G.Key.d) || G.Key.justReleased(G.Key.RIGHT)
|| G.Key.justReleased(G.Key.s) || G.Key.justReleased(G.Key.DOWN))
 G.jetloop.volume.gain.value = 0.0;

 //turn jet noise off if no keypresses
  
};