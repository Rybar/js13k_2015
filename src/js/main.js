G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');
G.ALL = []; //to store all collidable entities in the game
G.mobs = [];
G.map = [];

G.mapImage = new Image();
G.mapImage.src = "maptest.png";




G.ALL.push(G.player);
G.ALL.push(G.enemy);


G.loop = function() {
    requestAnimationFrame(G.loop);
    G.ctx.fillStyle = 'rgba(0,0,0,0.4)'
    G.ctx.fillRect(0, 0, 800, 600);
    G.player.inputUpdate();
    G.player.update();
    G.enemy.update();
    //console.log(G.player.xx + ' ' + G.player.yy + ' ' );
    G.drawMobs(G.ctx);
    G.player.draw(G.ctx);
    G.enemy.draw(G.ctx);
    
};

window.addEventListener('keyup', function(event) { G.Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { G.Key.onKeydown(event); }, false);

window.onload = G.loop;
