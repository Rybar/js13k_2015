G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');
G.ALL = [];

G.ALL.push(G.player);
G.ALL.push(G.enemy);
// G.player = new G.Entity();
// G.player.width = 16;
// G.player.height = 16;
// G.player.setCoords(400, 300);

// // G.player.draw = function(ctx){
// //     ctx.fillStyle = 'red';
// //     ctx.fillRect(this.xx, this.yy, this.width, this.height);
// // };
// G.player.draw = function() {
//     var p = G.player; 
//     G.ctx.fillStyle = 'red';
//     G.ctx.fillRect(p.xx, p.yy, p.width, p.height);
// }



G.loop = function() {
    requestAnimationFrame(G.loop);
    G.ctx.clearRect(0, 0, 800, 600);
    G.player.inputUpdate();
    G.player.update();
    G.enemy.update();
    console.log(G.player.xx + ' ' + G.player.yy + ' ' );
    G.player.draw(G.ctx);
    G.enemy.draw(G.ctx);
};

window.addEventListener('keyup', function(event) { G.Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { G.Key.onKeydown(event); }, false);

window.onload = G.loop;
