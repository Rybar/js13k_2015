/*global G */
//Particles
(function(){
    for(var i = 0; i < 100; i++){
            var particle = new G.Entity();
    		G.PARTICLES.push(particle);
    		particle.dead = true;
	    	//particle.xx = G.const.VIEW_X/2;
    		//particle.yy = G.const.VIEW_Y/2;
    		particle.setCoords(300,300);
    		particle.dx = Math.random()-1 * .005;
    		particle.dy = Math.random()-1 * .005;
    		particle.color = '#FFF';
    		particle.width = 3;
    		particle.height = 3;
    		particle.life = 40;
    		particle.collides = false;
    
    		particle.frictX = 1;
    		particle.frictY = 1; 
        }
	
		
	})();


G.particlesUpdate = function (){
	G.PARTICLES.forEach(function(e, i){
		e.update();
		e.life--;
		G.bulletMakeMap(e);
		//console.log(e.life);
		if(e.life < 0)G.die(e);
		
	});
};

G.drawParticles = function (ctx, xView, yView){
	G.PARTICLES.forEach(function(p){
		ctx.fillStyle = p.color;
		ctx.fillRect(p.xx - xView, p.yy-yView, p.width, p.height);
	});
};

G.die = function(e){
	e.dead = true;
	e.setCoords(-100,-100);
};

G.getParticle = function(params){
	var particle = G.PARTICLES.filter(function(e){return e.dead = true})[0];
		
		particle.dead = false;
		particle.life = params.life || 100;
		
		particle.setCoords(params.x, params.y);
		
		console.log("particle with life " + particle.life + " emitted");
		
		particle.dx = params.dx || 0;
		particle.dy = params.dy || 0;
		particle.color = params.color || '#FFF';
		particle.width = params.height || 3;
		particle.height = params.height || 3;
		
		particle.collides = params.type || 0;
	
		particle.frictX = params.frictX || 1;
		particle.frictY = params.frictY || 1; 
		particle.isBullet = params.isBullet || false;
	
	return particle;
	
};

G.bulletMakeMap = function(e) {
    
    if( e.hasCollision(e.cx, e.cy-1) && e.yr <= 0.4 ) { // if there's something above...
            if(G.Map[e.cy-1] != undefined && G.Map[e.cy-1][e.cx] != undefined){
                G.Map[e.cy-1][e.cx] = 1;
                G.player.map[e.cy-1][e.cx] = G.player.flipped ? 0 : 1;
                e.life = 1;
            }
        }
        if( e.hasCollision(e.cx, e.cy+1) && e.yr >= 0.6 ) { // ditto below
            if(G.Map[e.cy+1] != undefined && G.Map[e.cy+1][e.cx] != undefined){
                G.Map[e.cy+1][e.cx] = 1;
                G.player.map[e.cy+1][e.cx] = G.player.flipped ? 0 : 1;
                e.life = 1;
                }
            }
        if( e.hasCollision(e.cx-1, e.cy) && e.xr <= 0.4 ) { // if there's something left
            if(G.Map[e.cy] != undefined && G.Map[e.cy][e.cx-1] != undefined){
                G.Map[e.cy][e.cx-1] = 1;
                G.player.map[e.cy][e.cx-1] = G.player.flipped ? 0 : 1;
                e.life = 1;
            }
        }
        if( e.hasCollision(e.cx+1, e.cy) && e.xr >= 0.6 ) { // right
            if(G.Map[e.cy] != undefined && G.Map[e.cy][e.cx+1] != undefined){
                G.Map[e.cy][e.cx+1] = 1;
                G.player.map[e.cy][e.cx+1] = G.player.flipped ? 0 : 1;
                e.life = 1;
            }
        }
    
}