/*global G */
G.Entity = function(){
    this.cx = 0;
    this.cy = 0;
    this.xr = 0;
    this.yr = 0;
    
    this.xx = 0;
    this.yy = 0;
    
    this.dx = 0;
    this.dy = 0;
    
    this.ddx = 0; //difference between last frame and this frame
    this.ddy = 0;
    
    this.ox = 0; //previous frame x
    this.oy = 0; //previous frame y
    
    this.radius = 0;
    this.gravity = 0;
    
    this.frictX = 0.92;
    this.frictY = 0.94;
    this.dead = false;
    this.collides = 1;
    this.isBullet = false;
    
    this.id = Math.random();
    
};

G.Entity.prototype.die = function(e) {
    e.dead = true;
    G.drawAsplode(G.buffer, e.xx, e.yy, G.camera.xView, G.camera.yView);
    e.xx = -100;
    e.yy = -100;
    G.ALL.splice(G.ALL.indexOf(e), 1);
    //G.mobs.splice(G.mobs.indexOf(e), 1);
}

G.Entity.prototype.setCoords = function(x,y) {
        this.xx = x;
        this.yy = y;
        this.cx = Math.floor(this.xx/G.const.GRID);
        this.cy = Math.floor(this.yy/G.const.GRID);
        this.xr = (this.xx - this.cx*G.const.GRID) / G.const.GRID;
        this.xy = (this.yy - this.cy*G.const.GRID) / G.const.GRID;
    };

G.Entity.prototype.hasCollision = function(cx,cy) {
    if(this.dead)return false;
    if(this == G.player){
        if( (this.cx<1 && this.xr < .5) || this.cx>=G.const.WIDTH)
            return true;
        else if(this.cy<1 && this.yr < .5 || this.cy>=G.const.HEIGHT ){
            return true;
        }
        else if( G.player.map[cy] == undefined || G.player.map[cy][cx] == undefined ) {
            return true;
        }
        else return (G.player.map[cy][cx]);
        
    }
    else if(this.isBullet) {
         if( (this.cx<1 && this.xr < .5) || this.cx>=G.const.WIDTH)
            return true;
        else if(this.cy<1 && this.yr < .5 || this.cy>=G.const.HEIGHT ){
            return true;
        }
        else if( G.player.map[cy] == undefined || G.player.map[cy][cx] == undefined ) {
            return true;
        }
        else return (G.player.flipped ? G.player.map[cy][cx] : G.Map[cy][cx]) ;
    }
    else {
        if( (this.cx<1 && this.xr < .5) || this.cx>=G.const.WIDTH)
            return true;
        else if(this.cy<1 && this.yr < .5 || this.cy>=G.const.HEIGHT ){
            return true;
        }
        else if( (G.Map[cy]) == undefined  || G.Map[cy][cx] == undefined ) {
            return true;
        }
        else return (G.Map[cy][cx]);
    }
};

G.Entity.prototype.overlaps = function(e) { //e is another entity
    var maxDist = this.radius + e.radius;
    var distSqr = (e.xx - this.xx)*(e.xx-this.xx) + (e.yy - this.yy)*(e.yy-this.yy);
    if(distSqr <= maxDist*maxDist )
        return true;
    else
        return false;
};
    
G.Entity.prototype.onGround = function() {
    return this.hasCollision(this.cx, this.cy+1) && this.yr>=0.5;
};

G.Entity.prototype.onCeiling = function() {
    return this.hasCollision(this.cx, this.cy-1) && this.yr<=0.5;
};

G.Entity.prototype.onWallLeft = function() {
    return this.hasCollision(this.cx-1, this.cy) && this.xr<=0.5;
}
G.Entity.prototype.onWallRight = function() {
    return this.hasCollision(this.cx+1, this.cy) && this.xr>=0.5;
}
    
G.Entity.prototype.update = function() {
    
    if(!this.dead){
        
        
        var gravity = this.gravity;
         
        
        //X component
        this.xr += this.dx;
        this.dx *= this.frictX;
        if( this.hasCollision(this.cx-1, this.cy) && this.xr <= 0.3 ) { // if there's something to the left AND we're near the left edge of the current cell
            this.dx = 0;
            this.xr = 0.3;
        }
        if( this.hasCollision(this.cx+1, this.cy) && this.xr >= 0.7 ) { // ditto right
            this.dx = 0;
            this.xr = 0.7;
        }
        while(this.xr < 0) { //update the cell and fractional movement
            this.cx--;
            this.xr++;
        }
        while(this.xr > 1) { //update the cell and fractional movement
            this.cx++;
            this.xr--;
        }
        
        //Y component
        this.dy += gravity;
        this.yr += this.dy;
        this.dy *= this.frictY;
        if( this.hasCollision(this.cx, this.cy-1) && this.yr <= 0.4 ) { // if there's something above...
            this.dy = 0;
            this.yr = 0.4;
        }
        if( this.hasCollision(this.cx, this.cy+1) && this.yr >= 0.7 ) { // ditto below
            this.dy = 0;
            this.yr = 0.7;
        }
        while(this.yr < 0) { //update the cell and fractional movement up
            this.cy--;
            this.yr++;
        }
        while(this.yr > 1) { //update the cell and fractional movement down
            this.cy++;
            this.yr--;
        }
        
        //object collision handling--------------------
        
        //sa('all contains ' + G.ALL.length)
        
        for(var i = 0; i < G.ALL.length; i++) {
            //console.log('in collision check loop');
            var e = G.ALL[i];
            if(!e.dead){
                if(e.collides){
                if(e != this && Math.abs(this.cx-e.cx) <= 1 && Math.abs(this.cy-e.cy) <= 1 ){
               // console.log('initial cell check...');
                var dist = Math.sqrt( (e.xx-this.xx) * (e.xx-this.xx) + (e.yy-this.yy)*(e.yy-this.yy) );
                if(dist <= this.radius + e.radius) {
                    
                    if(this == G.player){ //enemies die when touch player
                        G.Entity.prototype.die(e);
                    }
                    //console.log('touching');
                    var ang = Math.atan2(e.yy-this.yy, e.xx-this.xx);
                    var force = 0.03;
                    var repelPower = (this.radius + e.radius - dist) / (this.radius + e.radius);
                    this.dx -= Math.cos(ang) * repelPower * force;
                    this.dy -= Math.sin(ang) * repelPower * force;
                    e.dx += Math.cos(ang) * repelPower * force;
                    e.dy += Math.sin(ang) * repelPower * force;
                }
            }
            
            }
                
            }
            
           // else //console.log('no collision detected');
        }
        //----------------------------------------------
        
       
       
      
        //update actual pixel coordinates:
        
       
        this.xx = Math.floor((this.cx + this.xr)*G.const.GRID);
        this.yy = Math.floor((this.cy + this.yr)*G.const.GRID);
        this.ddx = (this.cx + this.xr)*G.const.GRID - this.ox;
        this.ddy = (this.cy + this.yr)*G.const.GRID - this.oy;
        this.ox = (this.cx + this.xr)*G.const.GRID;
        this.oy = (this.cy + this.yr)*G.const.GRID;
        
        //vertical screen wrap: 
        
        //if(this.yy > (G.const.GRID * G.const.HEIGHT) + this.radius) this.setCoords(this.xx, -this.radius);
        
            
    }
    
    
};
    
    