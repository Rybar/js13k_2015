G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');
G.ctx.webkitImageSmoothingEnabled = false;
G.ctx.mozImageSmoothingEnabled = false;
G.ctx.imageSmoothingEnabled = false;

G.ALL.push(G.player);
//G.ALL.push(G.enemy);
G.bufferCanvas = document.createElement('canvas');
G.bufferCanvas.width = 400;
G.bufferCanvas.height = 288;
G.buffer = G.bufferCanvas.getContext('2d');
G.buffer.webkitImageSmoothingEnabled = false;
G.buffer.mozImageSmoothingEnabled = false; 
G.buffer.imageSmoothingEnabled = false;

var camera = new G.Camera(0,0, G.bufferCanvas.width, G.bufferCanvas.height, G.const.WIDTH * G.const.GRID, G.const.HEIGHT * G.const.GRID);
camera.follow(G.player, 100, 100);


G.drawMap = function(ctx, xView, yView){
    for(var i = 0; i < G.Map.length; i++){
        for(var j = 0; j < G.Map[i].length; j++){
            if(G.Map[i][j]){
                ctx.fillStyle = 'gray';
                ctx.fillRect((j*G.const.GRID) - xView, (i*G.const.GRID) - yView, G.const.GRID, G.const.GRID);
            }
            
        }
    }
}
G.drawBG = function(ctx, xView, yView){
    for(var i = 0; i < G.const.HEIGHT; i++){
        for(var j = 0; j < G.const.WIDTH; j++){
            if(j%2==0){
                if(i%2==1){
                ctx.fillStyle = '#080808';
                ctx.fillRect((j*G.const.GRID) - xView, (i*G.const.GRID) - yView, G.const.GRID, G.const.GRID);
                }
            }
            else if(i%2==0){
                 ctx.fillStyle = '#080808';
                ctx.fillRect((j*G.const.GRID) - xView, (i*G.const.GRID) - yView, G.const.GRID, G.const.GRID);
            }
            
        }
    }
};
G.render = function(canvas){
    G.ctx.fillStyle = 'black';
    G.ctx.fillRect(0, 0, 1200, 864);
    G.ctx.drawImage(canvas, 0, 0, 400, 288, 0,0, 1200, 864);
    console.log(camera.xView + ", " + camera.yView);
    
}

G.Map = G.initMap(G.const.WIDTH, G.const.HEIGHT);
G.seedMap(G.Map, 0.4);
G.Map = G.iterateMap(G.Map, 4, 3);
G.Map = G.iterateMap(G.Map, 4, 3);
G.Map = G.iterateMap(G.Map, 4, 3);
G.Map = G.iterateMap(G.Map, 4, 3);
G.Map = G.iterateMap(G.Map, 4, 3);

G.player.map = G.Map.map(function(arr) {
    return arr.slice();
});

//G.player.map = dupemap;


G.loop = function() {
    
    requestAnimationFrame(G.loop);

//----------------UPDATE-------------------
    G.player.inputUpdate();
    G.player.update();
    camera.update();
    G.Key.update();
   // G.enemy.update();
    //console.log(G.player.xx + ' ' + G.player.yy + ' ' );
//--------------END UPDATE-----------------

//--------------RENDER---------------------    
    G.buffer.fillStyle = 'black'; //screen blank
    G.buffer.fillRect(0, 0, 1200, 864);
    G.drawBG(G.buffer, camera.xView, camera.yView);
    G.drawMap(G.buffer, camera.xView, camera.yView);
    G.drawMobs(G.buffer, camera.xView, camera.yView);
    G.player.draw(G.buffer, camera.xView, camera.yView);
    G.enemy.draw(G.buffer, camera.xView, camera.yView);
    
    G.render(G.bufferCanvas); //draw buffer to full-size with scaling
    
};

window.addEventListener('keyup', function(event) { G.Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { G.Key.onKeydown(event); }, false);

window.onload = G.loop;
