G.seedMap = function(map, chance) { //fill map with random values
    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[0].length; j++){
            if(Math.random() < chance){
                map[i][j] = 1;
            }
            else map[i][j] = 0;
        }
    }
    return map;
};

G.flipMap = function(map) { 
    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[0].length; j++){
            if(map[i][j] == 0){
                map[i][j] = 1;
            }
            else map[i][j] = 0;
        }
    }
    return map;
};

G.initMap = function(width, height) { //fill an array at dimensions with falsy values
    var map = [];
    for(var i = 0; i < height; i++){
        map.push([]);
        for(var j = 0; j < width; j++){
            map[i].push(0);
        }
    }
    return map;
};

G.initPlayerSpace = function(map,cx,cy){
    for(var i = -1; i < 2; i++){  //set up loops to check the 3x3 area around x,y
        for(var j = -1; j < 2; j++){
            map[cy+j][cx+i] = 0;
        }
    }
    
};

G.cellFlip = function(cx, cy){
    if(G.Map[cy][cx+1] == 0){
                G.Map[cy][cx+1] = 1;
            }
            else G.Map[cy][cx+1] = 0;
            
    if(G.player.map[cy][cx+1] == 0){
                G.player.map[cy][cx+1] = 1;
            }
            else G.player.map[cy][cx+1] = 0;
};

G.countAliveNeighbors = function(map, x, y) {  
    var count = 0;
    for(var i = -1; i < 2; i++){  //set up loops to check the 3x3 area around x,y
        for(var j = -1; j < 2; j++){
            var nX = x + j;
            var nY = y + i;
            if(i == 0 && j == 0) {}//if checking center, do nothing.
            else if(nX < 0 || nY < 0 || nX >= map[0].length || nY >= map.length){
                count++;
            }
            else if(map[nY][nX]){
                count++;
            }
        }
    }
    return count;
};

G.iterateMap = function(oldMap, birthLimit, deathLimit) {
    var newMap = G.initMap(G.const.WIDTH, G.const.HEIGHT);
    for(var y = 0; y < oldMap.length; y++){
        for(var x = 0; x < oldMap[0].length; x++){
            var nbs = G.countAliveNeighbors(oldMap, x, y);
            if(oldMap[y][x]){
                if(nbs > deathLimit){
                newMap[y][x] = 0;
                }
                else{
                    newMap[y][x] = 0;
                }
            }
            else{
                if(nbs < birthLimit){
                    newMap[y][x] = 1;
                }
                else{
                    newMap[y][x] = 0;
                }
            }
                
        }
            
    }
    return newMap;
};

//------------------------------------------------------------
//TODO: optimize drawing for on-screen tiles only. 
//------------------------------------------------------------
G.drawMap = function(ctx, xView, yView) {
    for (var i = 0; i < G.Map.length; i++) {
        for (var j = 0; j < G.Map[i].length; j++) { 
            //if(G.Map[i][j] < 0){G.Map[i][j] = 0} //hacky update bit to prevent negative cell health
            if (G.Map[i][j]) {
                //ctx.lineWidth = 0.5;
                ctx.strokeStyle = '#202020';
                ctx.strokeRect((j * G.const.GRID) - xView, (i * G.const.GRID) - yView, G.const.GRID, G.const.GRID);
                
                if(i > 0 && i < G.Map.length-1){ 
                    if (G.Map[i - 1][j] == 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = G.player.flipped ? 'purple' : 'red';
                    ctx.moveTo(j * G.const.GRID - xView, i * G.const.GRID - yView);
                    ctx.lineTo(j * G.const.GRID - xView + G.const.GRID, (i * G.const.GRID - yView));
                    ctx.stroke();
                    }
                    
                    if (G.Map[i + 1][j] == 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = G.player.flipped ? 'red' : 'purple';
                    ctx.moveTo(j * G.const.GRID - xView, i * G.const.GRID - yView+G.const.GRID);
                    ctx.lineTo(j * G.const.GRID - xView + G.const.GRID, (i * G.const.GRID - yView+G.const.GRID));
                    ctx.stroke();
                    }
                }
                
                if(j > 0 && j < G.Map[i].length-1){ 
                    if (G.Map[i][j-1] == 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'gray';
                    ctx.moveTo(j * G.const.GRID - xView, i * G.const.GRID - yView);
                    ctx.lineTo(j * G.const.GRID - xView, i * G.const.GRID - yView+G.const.GRID);
                    ctx.stroke();
                    }
                    
                    if (G.Map[i][j+1] == 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'gray';
                    ctx.moveTo(j * G.const.GRID - xView+G.const.GRID, i * G.const.GRID - yView);
                    ctx.lineTo(j * G.const.GRID - xView+G.const.GRID, i * G.const.GRID - yView+G.const.GRID);
                    ctx.stroke();
                    }
                }
                
            }
        }
    }
};

    
    
        