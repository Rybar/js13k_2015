G.enemy = new G.Entity();
G.enemy.setCoords(300,500);
G.enemy.width = 16;
G.enemy.height = 16;
G.enemy.radius = 8;
G.enemy.draw = function(ctx){
    ctx.fillStyle = 'green';
    ctx.fillRect(this.xx, this.yy, this.width, this.height);
}