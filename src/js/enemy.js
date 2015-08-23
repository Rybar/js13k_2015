 
G.enemy = new G.Entity();
G.enemy.setCoords(300,500);
G.enemy.width = 8;
G.enemy.height = 8;
G.enemy.radius = 4;

G.enemy.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.xx, this.yy, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
};

G.enemy.eUpdate = function(){
    
};

