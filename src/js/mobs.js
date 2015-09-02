G.mobs=[];
G.makeMobs = (function(){
    for(var i = 0; i <= 100; i++){
    var mob = new G.Entity();
    mob.radius = 5;
    mob.width = 8;
    mob.height = 8;
    mob.eatCount = G.const.E_HUNGER;
    mob.frictY = G.const.E_FRICTY;
    mob.frictX = G.const.E_FRICTX;
    mob.gravity = G.const.E_GRAVITY;
    mob.setCoords((Math.random()*1200)+32, Math.random()*800);
    G.mobs.push(mob);
    G.ALL.push(mob);
    }
})();

G.drawMobs = function(ctx, xView, yView){
    G.mobs.forEach(function(e){
        ctx.beginPath();
        ctx.arc(e.xx-e.radius-xView, e.yy-e.radius-yView, e.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
    });
};

G.mobRandomMove = function(e){
            if(Math.random() < .1){
            e.dx += ((Math.random() * 2) -1) * .05;
            e.dy += ((Math.random() * 2) -1) * .05;
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
            if(G.Map[e.cy-1] != undefined && G.Map[e.cy-1][e.cx] != undefined){
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

G.mobUpdate = function(){
    G.mobs.forEach(function(e, i, a){
        e.update();
        G.mobRandomMove(e);
        G.mobEatMap(e);
        
    });
};
