G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');
G.ctx.webkitImageSmoothingEnabled = false;
G.ctx.mozImageSmoothingEnabled = false; 

G.ALL.push(G.player);
//G.ALL.push(G.enemy);
G.bufferCanvas = document.createElement('canvas');
G.bufferCanvas.width = 400;
G.bufferCanvas.height = 288;
G.buffer = G.bufferCanvas.getContext('2d');
G.buffer.webkitImageSmoothingEnabled = false;
G.buffer.mozImageSmoothingEnabled = false; 

G.drawMap = function(ctx){
    for(var i = 0; i < G.map.length; i++){
        for(var j = 0; j < G.map[i].length; j++){
            if(G.map[i][j]){
                ctx.fillStyle = 'gray';
                ctx.fillRect(j*G.const.GRID, i*G.const.GRID, G.const.GRID, G.const.GRID);
            }
            
        }
    }
}

G.drawBG = function(ctx){
    for(var i = 0; i < G.const.HEIGHT; i++){
        for(var j = 0; j < G.const.WIDTH; j++){
            if(j%2==0){
                if(i%2==1){
                ctx.fillStyle = '#080808';
                ctx.fillRect(j*G.const.GRID, i*G.const.GRID, G.const.GRID, G.const.GRID);
                }
            }
            else if(i%2==0){
                 ctx.fillStyle = '#080808';
                ctx.fillRect(j*G.const.GRID, i*G.const.GRID, G.const.GRID, G.const.GRID);
            }
            
        }
    }
};

G.render = function(canvas){
    G.ctx.drawImage(canvas, 0,0, 400, 288, 0,0, 1200, 864);
    
}

G.loop = function() {
    requestAnimationFrame(G.loop);

    G.player.inputUpdate();
    G.player.update();
   // G.enemy.update();
    //console.log(G.player.xx + ' ' + G.player.yy + ' ' );
    
    G.buffer.fillStyle = 'black';
    G.buffer.fillRect(0, 0, 400, 288);
    G.drawBG(G.buffer);
    G.drawMap(G.buffer);
    G.drawMobs(G.buffer);
    G.player.draw(G.buffer);
    G.enemy.draw(G.buffer);
    
    G.render(G.bufferCanvas);
    
};

window.addEventListener('keyup', function(event) { G.Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { G.Key.onKeydown(event); }, false);

window.onload = G.loop;
