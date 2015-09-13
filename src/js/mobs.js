/*global G */
G.mobs=[];
G.mobMouth = true;

G.makeMobs = function(amount){
    for(var i = 0; i <= amount; i++){
    var mob = new G.Entity();
    mob.radius = G.const.E_SIZE /2;
    mob.width = 8;
    mob.height = 8;
    mob.angle = 0;
    mob.eatCount = G.const.E_HUNGER;
    mob.frictY = G.const.E_FRICTY;
    mob.frictX = G.const.E_FRICTX;
    mob.gravity = G.const.E_GRAVITY;
    mob.setCoords((Math.random()*G.const.GRID*(G.const.WIDTH-1)), Math.random()*G.const.GRID*(G.const.HEIGHT-1));
    while(G.Map[mob.cy][mob.cx]){
        mob.setCoords((Math.random()*G.const.GRID*(G.const.WIDTH-1)), Math.random()*G.const.GRID*(G.const.HEIGHT-1));
    }
    G.mobs.push(mob);
    G.ALL.push(mob);
    }
};

G.drawMobs = function(ctx, xView, yView){
    G.mobs.forEach(function(e){
        if(!this.dead){
            e.angle = Math.atan2(e.ddy,e.ddx) + Math.PI;
            if(e.angle < 0)e.angle += 2*Math.PI;
            var start = e.angle + (0.2 + Math.PI);
            var end = start - (G.mobMouth ? 1.2 : .1);
            ctx.beginPath();
            ctx.moveTo(e.xx-xView, e.yy-yView);
            ctx.arc(e.xx-xView, e.yy-yView, e.radius, start, end, false);
            ctx.closePath();
            ctx.fillStyle = 'yellow';
            ctx.fill();
        }
        
    });
};

G.drawAsplode = function(ctx, x, y, xView, yView){
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.arc(x-xView,y-yView,40,0,2*Math.PI,false);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
}

G.mobRandomMove = function(e){
            if(Math.random() < .1){
            e.dx += ((Math.random() * 2) -1) * .01;
            e.dy += ((Math.random() * 2) -1) * .01;
        }
};

G.mobEatMap = function(e) {
    
    if( e.hasCollision(e.cx, e.cy-1) && e.yr <= 0.4 ) { // if there's something above...
            if(G.Map[e.cy-1] != undefined && G.Map[e.cy-1][e.cx] != undefined){
                e.eatCount -= 1;
                if(e.eatCount <= 0){
                    G.Map[e.cy-1][e.cx] = 0;
                    G.player.map[e.cy-1][e.cx] = G.player.flipped ? 1 : 0;
                    e.eatCount =  G.const.E_HUNGER;
                }
            }
        }
        if( e.hasCollision(e.cx, e.cy+1) && e.yr >= 0.6 ) { // ditto below
            if(G.Map[e.cy+1] != undefined && G.Map[e.cy+1][e.cx] != undefined){
                e.eatCount -= 1;
                if(e.eatCount <= 0){
                    G.Map[e.cy+1][e.cx] = 0;
                    G.player.map[e.cy+1][e.cx] = G.player.flipped ? 1 : 0;
                    e.eatCount =  G.const.E_HUNGER;
                }
                
            }
        }
        if( e.hasCollision(e.cx-1, e.cy) && e.xr <= 0.4 ) { // if there's something left
           
            if(G.Map[e.cy] != undefined && G.Map[e.cy][e.cx-1] != undefined){
                
                e.eatCount -= 1;
                if(e.eatCount <= 0){
                    
                    G.Map[e.cy][e.cx-1] = 0;
                    
                    G.player.map[e.cy][e.cx-1] = G.player.flipped ? 1 : 0;
                    e.eatCount =  G.const.E_HUNGER;
                }
            }
        }
        if( e.hasCollision(e.cx+1, e.cy) && e.xr >= 0.6 ) { // right
            if(G.Map[e.cy] != undefined && G.Map[e.cy][e.cx+1] != undefined){
                e.eatCount -= 1;
                if(e.eatCount <= 0){
                    G.Map[e.cy][e.cx+1] = 0;
                    G.player.map[e.cy][e.cx+1] = G.player.flipped ? 1 : 0;
                    e.eatCount = G.const.E_HUNGER;
                }
            }
        }
    
}

G.mobMoveToPlayer = function(e) {
    e.angle = Math.atan2(e.yy - G.player.yy, e.xx - G.player.xx) + Math.PI;
    if(e.angle < 0)e.angle += 2*Math.PI;
    e.dx += Math.cos(e.angle)/2000;
    e.dy += Math.sin(e.angle)/2000;
};
G.mobMoveAwayFromPlayer = function(e) {
    e.angle = Math.atan2(e.yy - G.player.yy, e.xx - G.player.xx);
    if(e.angle < 0)e.angle += 2*Math.PI;
    e.dx += Math.cos(e.angle)/3000;
    e.dy += Math.sin(e.angle)/3000;
}

G.mobUpdate = function(){
    G.mobs.forEach(function(e, i, a){
        e.update();
        if(G.player.flipped){
            G.mobMoveToPlayer(e);
            G.mobRandomMove(e);
        }
        else {
            //G.mobMoveAwayFromPlayer(e);
            G.mobMoveToPlayer(e);
            G.mobRandomMove(e);
        }
        
        G.mobEatMap(e);
        
        if(G.mobs.filter(function(e){return !e.dead}).length < 5){
            G.makeMobs(10);
        }
        if(G.Map[e.cy] != undefined && G.Map[e.cy][e.cx]){
            G.Entity.prototype.die(e);
        }
        
    });
};
