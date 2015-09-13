/*global G */
G.player = new G.Entity();
G.player.width = G.const.P_SIZE;
G.player.height = G.const.P_SIZE;
G.player.radius = 8;
G.player.gravity = G.const.P_GRAVITY;
// G.player.setCoords(G.const.WIDTH/2*G.const.GRID, G.const.HEIGHT/2*G.const.GRID);
G.player.setCoords( Math.floor(G.const.WIDTH/2)*G.const.GRID , Math.floor(G.const.HEIGHT/2)*G.const.GRID );
G.player.flipped = false;
G.player.facingLeft = false;
G.player.map=[];
G.player.coolDown = 8;
G.player.fireTimer = 0;
G.player.health = 500;

G.player.draw = function(ctx, xView, yView) {
    
    // if(this.flipped){
        
    //     ctx.beginPath();
        
    //     ctx.fillStyle = this.flipped ? 'red' : 'purple';
    //     ctx.moveTo(this.xx-8-xView, this.yy+8-yView);
    //     ctx.lineTo(this.xx+8-xView, this.yy+8-yView);
    //     ctx.lineTo(this.xx-xView, this.yy-8-yView);
    //     ctx.lineTo(this.xx-8-xView, this.yy+8-yView);
        
    //     ctx.fill();
        
    // }
    // else {
        
        ctx.beginPath();
        ctx.fillStyle = this.flipped ? 'red' : 'purple';
        // ctx.moveTo(this.xx-xView, this.yy+8-yView);
        // ctx.lineTo(this.xx-8-xView, this.yy-8-yView);
        // ctx.lineTo(this.xx+8-xView, this.yy-8-yView);
        // ctx.lineTo(this.xx-xView, this.yy+8-yView);
        ctx.fillRect(this.xx-this.width/2-xView, this.yy-this.height/2-yView, this.width, this.height);
        ctx.fill();
        
   //}

};

G.player.moveLeft = function() {
    //console.log('moving left');
     if(this.flipped){
        this.dx -= G.const.P_SPEED;
        this.facingLeft = true;
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
        this.facingLeft = false;
    }
    else{
        this.dx += G.const.P_THRUST;
        G.jetloop.volume.gain.value = 1;
        
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
    if(G.player.onGround() && G.Map[this.cy+1] != undefined){ // flip down
            G.flipMap(G.player.map); 
            this.flipped = !this.flipped;
            this.setCoords(this.xx, this.yy+G.const.GRID); // 'teleport' down 1 space
            G.playSound(G.sounds.flip);
          }
    else if(G.player.onCeiling() && G.Map[this.cy-1] != undefined){ //flip up
            G.flipMap(G.player.map); 
            this.flipped = !this.flipped;
            this.setCoords(this.xx, this.yy-G.const.GRID); // 'teleport' up 1 space
            G.playSound(G.sounds.flip);
          }
    else if(G.player.onWallLeft() && G.Map[this.cy][this.cx-1] != undefined){ //flip left
            G.flipMap(G.player.map); 
            this.flipped = !this.flipped;
            this.setCoords(this.xx-G.const.GRID, this.yy); // 'teleport' left
            G.playSound(G.sounds.flip);
          }
    else if(G.player.onWallRight() && G.Map[this.cy][this.cx+1] != undefined){ //flip right
            G.flipMap(G.player.map); 
            this.flipped = !this.flipped;
            this.setCoords(this.xx+G.const.GRID, this.yy); // 'teleport' right
            G.playSound(G.sounds.flip);
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
  if(this.flipped && this.onGround() && (G.Key.isDown(G.Key.SPACE) || G.Key.isDown(G.Key.w) ) ){
        this.jump(); 
    }
   
    if (G.Key.isDown(G.Key.DOWN) || G.Key.isDown(G.Key.s) && !this.flipped) this.moveDown();
    if (G.Key.isDown(G.Key.LEFT) || G.Key.isDown(G.Key.a)) this.moveLeft();
    if (G.Key.isDown(G.Key.RIGHT) || G.Key.isDown(G.Key.d)) this.moveRight();
  
    if (G.Key.isDown(G.Key.x) && this.flipped){
        if(this.fireTimer < 0){
            this.fireTimer = this.coolDown;
            var bullet = {
              x: -100,
              y: -100,
              dx: 0,
              dy: 0,
              width: 10,
              height: 10,
              life: 1000,
              isBullet: true
             }
            if (G.Key.isDown(G.Key.DOWN) || G.Key.isDown(G.Key.s)){
                bullet.dy = 0.5;
                bullet.x = G.player.xx-4;
                bullet.y = G.player.yy+16;
            }
            
            else if (G.Key.isDown(G.Key.UP) || G.Key.isDown(G.Key.w)){
                bullet.dy = -0.5;
                bullet.dx = 0;
                bullet.x = G.player.xx-4;
                bullet.y = G.player.yy-16;
            }
            
            if (G.Key.isDown(G.Key.LEFT) || G.Key.isDown(G.Key.a)){
                bullet.dx = -0.5;
                bullet.x = G.player.xx-16;
                bullet.y = G.player.yy-4;
            }
            
            else if (G.Key.isDown(G.Key.RIGHT) || G.Key.isDown(G.Key.d)){
                bullet.dx = 0.5;
                bullet.x = G.player.xx+16;
                bullet.y = G.player.yy-4;
            }
            else {
                bullet.dx = this.facingLeft ? -0.5 : 0.5;
                bullet.x = this.facingLeft ? G.player.xx-16 : G.player.xx+16;
                bullet.y = G.player.yy-4; 
            }
            
            G.makeParticle(bullet);
                
        }
        
    }

    this.fireTimer--;
    
//------------------------------------------------------
//            flip mechanic handling     
//------------------------------------------------------
  if (G.Key.justReleased(G.Key.z)){
      this.flip();
  }
  if(!G.Map[this.cy][this.cx] && G.player.flipped){ //mobs ate square player is on, flip without keypress
        G.flipMap(G.player.map); 
        this.flipped = !this.flipped;
        G.playSound(G.sounds.flip);
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