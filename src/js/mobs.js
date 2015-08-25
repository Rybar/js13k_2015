G.mobs=[];
// G.makeMobs = (function(){
//     for(var i = 0; i <= 200; i++){
//     var mob = new G.Entity();
//     mob.radius = 4;
//     mob.width = 8;
//     mob.height = 8;
//     mob.gravity = 0.00;
//     mob.setCoords((Math.random()*1200)+32, Math.random()*800);
//     G.mobs.push(mob);
//     G.ALL.push(mob);
//     }
// })();

G.drawMobs = function(ctx, xView, yView){
    G.mobs.forEach(function(e){
        e.update();
        ctx.beginPath();
        ctx.arc(e.xx+e.radius-xView, e.yy+e.radius-yView, e.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
    });
};
