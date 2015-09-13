/*global G */
/*global Stats */
/*global requestAnimationFrame */

G.stats = new Stats();
G.stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// align top-left
G.stats.domElement.style.position = 'absolute';
G.stats.domElement.style.left = '0px';
G.stats.domElement.style.top = '0px';

    document.body.appendChild( G.stats.domElement );

G.canvas = document.querySelector('#game');
G.ctx = G.canvas.getContext('2d');

G.init = function(){
    
    G.ALL=[];
    G.mobs=[];
    G.camera = {};
    G.Map = [];
    G.player.map = [];
    
    G.player.setCoords( Math.floor(G.const.WIDTH/2)*G.const.GRID , Math.floor(G.const.HEIGHT/2)*G.const.GRID );
    
    G.ALL.push(G.player);  //push player to ALL for collisions
    G.paused = false;
    G.gameOver = false;
    //G.ALL.push(G.enemy);
    G.bufferCanvas = document.createElement('canvas');
    G.bufferCanvas.width = G.const.VIEW_X;
    G.bufferCanvas.height = G.const.VIEW_Y;
    G.buffer = G.bufferCanvas.getContext('2d');
    G.buffer.webkitImageSmoothingEnabled = false;
    G.buffer.mozImageSmoothingEnabled = false;
    G.buffer.imageSmoothingEnabled = false;
    
    G.scrollFactor = 0.94;
    
    G.camera = new G.Camera(0, 0, G.bufferCanvas.width, G.bufferCanvas.height, G.const.WIDTH * G.const.GRID, G.const.HEIGHT * G.const.GRID);
    G.camera.follow(G.player, 300, 300);
    
    
    
   
    
//----------------------------------------------
//  Map Init
//----------------------------------------------

    G.Map = G.initMap(G.const.WIDTH, G.const.HEIGHT);
    G.seedMap(G.Map, 0.4);
    
    G.Map = G.iterateMap(G.Map, 4, 3);
    G.Map = G.iterateMap(G.Map, 4, 3);
    G.Map = G.iterateMap(G.Map, 4, 3);
    // G.Map = G.iterateMap(G.Map, 4, 3);
    // G.Map = G.iterateMap(G.Map, 4, 3);

    G.initPlayerSpace(G.Map, G.player.cx, G.player.cy); //carve a hole for the player
    
    G.player.map = G.Map.map(function(arr) { //copy of map for player for flip interaction, since rendering depends on G.Map
        return arr.slice();
    });
    
//make the mobs. must be After Map.

G.makeMobs(100);

if(!G.sounds)G.initAudio();

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
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
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
    
    // G.soundGen = new G.sonantx.MusicGenerator(G.audio.GAMESONG);
    // G.soundGen.createAudioBuffer(function(buffer){
    //     G.sounds.loaded++;
    //     G.sounds.gameSong = buffer;
    // });

};
G.playSound = function(buffer, loop){
     var source = G.audioCtx.createBufferSource();
     var gainNode = G.audioCtx.createGain();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(G.audioCtx.destination)
        source.loop = loop;
        source.start();
        return { volume: gainNode, sound: source};
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
    G.ctx.drawImage(canvas, 0, 0, G.const.VIEW_X, G.const.VIEW_Y, 0, 0, G.const.VIEW_X, G.const.VIEW_Y);

    //console.log(G.camera.xView + ", " + G.camera.yView);

}

G.resizeGame = function() {
    //var gameArea = document.querySelector('#gamecontainer');
    //var widthToHeight = 16 / 9;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    // var newWidthToHeight = newWidth / newHeight;
    
    // if (newWidthToHeight > widthToHeight) {
    //     newWidth = newHeight * widthToHeight;
    //     gameArea.style.height = newHeight + 'px';
    //     gameArea.style.width = newWidth + 'px';
    // } else {
    //     newHeight = newWidth / widthToHeight;
    //     gameArea.style.width = newWidth + 'px';
    //     gameArea.style.height = newHeight + 'px';
    // }
    
    //gameArea.style.marginTop = (-newHeight / 2) + 'px';
    //gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    var gameCanvas = document.querySelector('#game');
    G.const.VIEW_X = newWidth-60;
    G.const.VIEW_Y = newHeight-60;
    gameCanvas.width = newWidth-60;
    gameCanvas.height = newHeight-60;
}

G.loadingScreen = function(){
     if(G.sounds.loaded != G.sounds.total && G.sounds.gameSong == null){
        requestAnimationFrame(G.loadingScreen);
        G.ctx.fillStyle = 'black'; //screen blank
        G.ctx.fillRect(0, 0, 800, 600);
        G.ctx.fillStyle = 'white';
        G.ctx.font = "48px monospace";
        G.ctx.fillText("Loading... "+G.sounds.loaded, 10, 50);
    }
    else if(!G.startGame) {//title screen!
        requestAnimationFrame(G.loadingScreen);
        G.ctx.fillStyle = 'black'; //screen blank
        G.ctx.fillRect(0, 0, 800, 600);
        G.ctx.fillStyle = 'white';
        G.ctx.font = "12px monospace";
        G.ctx.fillText("z to flip across wall, x to shoot, space to jump. Arrows. Press X to begin", 10, 50);
        G.Key.update();
        
        if(G.Key.isDown(G.Key.x)){
            console.log('x pressed');
            G.startGame = true;
        }
        
        //  //G.playSound(G.sounds.gameSong, true);
        //  G.jetloop = G.playSound(G.sounds.jet, true);
        //  G.jetloop.sound.loopEnd = 0.3;
        //  G.jetloop.volume.gain.value = 0;
        //  //G.jetloop.gainNode.value = 0;
        //  G.loop();
    }
    
    else if(G.startGame){
        G.jetloop = G.playSound(G.sounds.jet, true);
        G.jetloop.sound.loopEnd = 0.3;
        G.jetloop.volume.gain.value = 0;
        G.gameLoop = window.requestAnimationFrame(G.loop, G.bufferCanvas);
    }
   
    
    
    
};

G.loop = function() {
    
    if(!G.gameOver){
        
    
    G.stats.begin();
    
    if(!G.paused && G.gameLoop){
        
    //----------------UPDATE-------------------
    G.mobUpdate();
    G.particlesUpdate();
    G.Map = G.Map;
    G.player.map = G.player.map;
    
    G.player.inputUpdate();
    G.player.update();
    
    G.camera.update();        
    // G.enemy.update();
    //console.log(G.player.xx + ' ' + G.player.yy + ' ' );
    //--------------END UPDATE-----------------
    }

    //--------------RENDER---------------------
    
    G.buffer.fillStyle = 'rgba(0,0,0,.7)'; //screen blank
    G.buffer.fillRect(0, 0, G.const.VIEW_X, G.const.VIEW_Y);
    G.drawBG(G.buffer, G.camera.xView, G.camera.yView);
    G.drawMap(G.buffer, G.camera.xView, G.camera.yView);
    G.drawMobs(G.buffer, G.camera.xView, G.camera.yView);
    G.player.draw(G.buffer, G.camera.xView, G.camera.yView);
    G.drawParticles(G.buffer, G.camera.xView, G.camera.yView);
    //G.enemy.draw(G.buffer, G.camera.xView, G.camera.yView);

    G.render(G.bufferCanvas); //draw buffer to full-size with scaling
    
    if (G.Key.justReleased(G.Key.p)){
    G.paused = !G.paused;
    }
    
    G.Key.update();
    
    G.stats.end();
    
    G.gameOver = G.checkMap(G.Map);
    
    requestAnimationFrame(G.loop);

    }
    else {
        G.ctx.fillStyle = 'black'; //screen blank
        G.ctx.fillRect(0, 0, 800, 600);
        G.ctx.fillStyle = 'white';
        G.ctx.font = "36px monospace";
        G.ctx.fillText("Game Over. Press x to play again ", 10, 50);
        if(G.Key.isDown(G.Key.x)){
        G.jetloop.volume.gain.value = 0;
        window.cancelAnimationFrame(G.loop);
        G.gameLoop = undefined;
        G.init();
        }      
        G.Key.update();
        requestAnimationFrame(G.loop);
    }
};



setInterval(function(){

    G.const.E_HUNGER-=5;
        //G.mobMouth = !G.mobMouth;
        //console.log(G.const.E_HUNGER);

},1000);

setInterval(function(){

        G.mobMouth = !G.mobMouth;

},500);

setInterval(function(){
    console.log(G.checkMap(G.Map));
}, 1000);
    



window.addEventListener('keyup', function(event) {
    G.Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
    G.Key.onKeydown(event);
}, false);
window.addEventListener('focus'), function(event) {
    if(G.paused)G.paused = false;
}
window.addEventListener('blur'), function(event) {
    G.paused = true;
}
//window.addEventListener('resize', G.resizeGame());

window.onload = G.init;
