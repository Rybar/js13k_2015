



G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');
G.ctx.webkitImageSmoothingEnabled = false;
G.ctx.mozImageSmoothingEnabled = false;
G.ctx.imageSmoothingEnabled = false;

G.init = function(){
    
    G.ALL.push(G.player);  //push player to ALL for collisions
    //G.ALL.push(G.enemy);
    G.bufferCanvas = document.createElement('canvas');
    G.bufferCanvas.width = 400;
    G.bufferCanvas.height = 300;
    G.buffer = G.bufferCanvas.getContext('2d');
    G.buffer.webkitImageSmoothingEnabled = false;
    G.buffer.mozImageSmoothingEnabled = false;
    G.buffer.imageSmoothingEnabled = false;
    
    G.scrollFactor = 0.99;
    
    G.camera = new G.Camera(0, 0, G.bufferCanvas.width, G.bufferCanvas.height, G.const.WIDTH * G.const.GRID, G.const.HEIGHT * G.const.GRID);
    G.camera.follow(G.player, 100, 100);
    
   
    
//----------------------------------------------
//  Map Init
//----------------------------------------------

    G.Map = G.initMap(G.const.WIDTH, G.const.HEIGHT);
    G.seedMap(G.Map, 0.4);
    
    G.Map = G.iterateMap(G.Map, 4, 3);
    G.Map = G.iterateMap(G.Map, 4, 3);
    G.Map = G.iterateMap(G.Map, 4, 3);
    G.Map = G.iterateMap(G.Map, 4, 3);
    G.Map = G.iterateMap(G.Map, 4, 3);

    G.initPlayerSpace(G.Map, G.player.cx, G.player.cy); //carve a hole for the player
    
    G.player.map = G.Map.map(function(arr) { //copy of map for player for flip interaction, since rendering depends on G.Map
        return arr.slice();
    });

    G.initAudio();
    
    G.loadingScreen();
};

//---------END init;
G.initAudio = function(){
    //----------------------------------------------
    //  Audio init
    //----------------------------------------------
    G.sounds = {};
    G.sounds.loaded = 0;
    G.sounds.total = 3;
    G.audioCtx = new AudioContext;

    G.soundGen = new G.sonantx.SoundGenerator(G.audio.JUMP);
    G.soundGen.createAudioBuffer(147+24, function(buffer) {
        G.sounds.loaded++;
        G.sounds.jump = buffer;
       
    });
    
    G.soundGen = new G.sonantx.SoundGenerator(G.audio.FLIP);
    G.soundGen.createAudioBuffer(147+36, function(buffer) {
        G.sounds.loaded++;
        G.sounds.flip = buffer;
       
    });
    
    G.soundGen = new G.sonantx.SoundGenerator(G.audio.JET);
    G.soundGen.createAudioBuffer(130, function(buffer) {
        G.sounds.loaded++;
        G.sounds.jet = buffer;
       
    });


}
G.playSound = function(buffer, loop){
     var source = G.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(G.audioCtx.destination);
        source.loop = loop;
        source.start();
};

G.drawBG = function(ctx, xView, yView) {
    for (var i = 0; i < G.const.HEIGHT; i++) {
        for (var j = 0; j < G.const.WIDTH; j++) {
            if (j % 2 == 0) {
                if (i % 2 == 1) {
                    ctx.fillStyle = '#080808';
                    ctx.fillRect((j * G.const.GRID) - xView, (i * G.const.GRID) - yView, G.const.GRID, G.const.GRID);

                }
            }
            else if (i % 2 == 0) {
                ctx.fillStyle = '#080808';
                ctx.fillRect((j * G.const.GRID) - xView, (i * G.const.GRID) - yView, G.const.GRID, G.const.GRID);
            }

        }
    }
};

G.render = function(canvas) {
    G.ctx.fillStyle = 'black';
    G.ctx.fillRect(0, 0, 1200, 864);
    G.ctx.drawImage(canvas, 0, 0, 400, 300, 0, 0, 800, 600);
    //console.log(G.camera.xView + ", " + G.camera.yView);

}

G.loadingScreen = function(){
     if(G.sounds.loaded != G.sounds.total && G.sounds.gameSong == null){
        requestAnimationFrame(G.loadingScreen);
        G.ctx.fillStyle = 'black'; //screen blank
        G.ctx.fillRect(0, 0, 800, 600);
        G.ctx.fillStyle = 'white';
        G.ctx.font = "48px serif";
        G.ctx.fillText("Loading... "+G.sounds.loaded, 10, 50);
    }
    else{
         //G.playSound(G.sounds.gameSong, true);
         G.loop();
    }
    
};

G.loop = function() {

    requestAnimationFrame(G.loop);

    //----------------UPDATE-------------------
    G.player.inputUpdate();
    G.Map = G.Map;
    G.player.map = G.player.map;
    G.player.update();
    G.camera.update();
    G.Key.update();
    // G.enemy.update();
    //console.log(G.player.xx + ' ' + G.player.yy + ' ' );
    //--------------END UPDATE-----------------

    //--------------RENDER---------------------
    
    G.buffer.fillStyle = 'black'; //screen blank
    G.buffer.fillRect(0, 0, 800, 600);
    G.drawBG(G.buffer, G.camera.xView, G.camera.yView);
    G.drawMap(G.buffer, G.camera.xView, G.camera.yView);
    G.drawMobs(G.buffer, G.camera.xView, G.camera.yView);
    G.player.draw(G.buffer, G.camera.xView, G.camera.yView);
    G.enemy.draw(G.buffer, G.camera.xView, G.camera.yView);

    G.render(G.bufferCanvas); //draw buffer to full-size with scaling

};

window.addEventListener('keyup', function(event) {
    G.Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
    G.Key.onKeydown(event);
}, false);

window.onload = G.init;
