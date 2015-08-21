G.Entity = function(){
    this.cx = 0;
    this.cy = 0;
    this.xr = 0;
    this.yr = 0;
    
    this.xx = 0;
    this.yy = 0;
    
    this.dx = 0;
    this.dy = 0;
    
    this.radius = 0;
    this.gravity = 0;
};

G.Entity.prototype.setCoords = function(x,y) {
        this.xx = x;
        this.yy = y;
        this.cx = Math.floor(this.xx/G.const.GRID);
        this.cy = Math.floor(this.yy/G.const.GRID);
        this.xr = (this.xx - this.cx*G.const.GRID) / G.const.GRID;
        this.xy = (this.yy - this.cy*G.const.GRID) / G.const.GRID;
    };

G.Entity.prototype.hasCollision = function(cx,cy) {
        if(this.cx<0 || cx>=G.const.WIDTH)
            return true;
        else if( (G.map[cy]) == undefined) {
            return false;
        }
        else return (G.map[cy][cx]);
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
    
G.Entity.prototype.update = function() {
    var frictX = 0.92;
    var frictY = 0.94;
    var gravity = this.gravity;
     
    
    //X component
    this.xr += this.dx;
    this.dx *= frictX;
    if( this.hasCollision(this.cx-1, this.cy) && this.xr <= 0.3 ) { // if there's something to the left AND we're near the left edge of the current cell
        this.dx = 0;
        this.xr = 0.9;

        
    }
    if( this.hasCollision(this.cx+1, this.cy) && this.xr >= 0.7 ) { // ditto right
        this.dx = 0;
        this.xr = 0.3;
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
    this.dy *= frictY;
    if( this.hasCollision(this.cx, this.cy-1) && this.yr <= 0.4 ) { // if there's something above...
        this.dy = 0;
        this.yr = 0.4;
    }
    if( this.hasCollision(this.cx, this.cy+1) && this.yr >= 0.6 ) { // ditto below
        this.dy = 0;
        this.yr = 0.6;
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
    
    //console.log('all contains ' + G.ALL.length)
    
    for(var i = 0; i < G.ALL.length; i++) {
        //console.log('in collision check loop');
        var e = G.ALL[i];
        if(e != this && Math.abs(this.cx-e.cx) <= 1 && Math.abs(this.cy-e.cy) <= 1 ){
           // console.log('initial cell check...');
            var dist = Math.sqrt( (e.xx-this.xx) * (e.xx-this.xx) + (e.yy-this.yy)*(e.yy-this.yy) );
            if(dist <= this.radius + e.radius) {
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
       // else //console.log('no collision detected');
    }
    //----------------------------------------------
    
    //vertical screen wrap:
   
  
    
    this.xx = Math.floor((this.cx + this.xr)*G.const.GRID);
    this.yy = Math.floor((this.cy + this.yr)*G.const.GRID);
    
    if(this.yy > (G.const.GRID * G.const.HEIGHT) + this.radius) this.setCoords(this.xx, -this.radius);
    
};
    
    