G.makeMobs = (function(){
    for(var i = 0; i <= 300; i++){
    var mob = new G.Entity();
    mob.radius = 8;
    mob.width = 16;
    mob.height = 16;
    mob.gravity = 0.001;
    mob.setCoords(Math.random()*750, Math.random()*550);
    G.mobs.push(mob);
    G.ALL.push(mob);
}
})();

G.drawMobs = function(ctx){
    G.mobs.forEach(function(e){
        e.update();
        ctx.beginPath();
        ctx.arc(e.xx+e.radius, e.yy+e.radius, e.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
    });
}