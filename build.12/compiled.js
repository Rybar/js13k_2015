var G=window.G||{};G.ALL=[],G["const"]={GRID:16,WIDTH:100,HEIGHT:100,P_SPEED:.03,P_SPACESPEED:.01,P_THRUST:.003,P_FRICTX:.9,P_FRICTY:.94,P_SPACEFRICT:1,P_GRAVITY:.02,P_JUMP:.5},function(){function Rectangle(left,top,width,height){this.left=left||0,this.top=top||0,this.width=width||0,this.height=height||0,this.right=this.left+this.width,this.bottom=this.top+this.height}Rectangle.prototype.set=function(left,top,width,height){this.left=left,this.top=top,this.width=width||this.width,this.height=height||this.height,this.right=this.left+this.width,this.bottom=this.top+this.height},Rectangle.prototype.within=function(r){return r.left<=this.left&&r.right>=this.right&&r.top<=this.top&&r.bottom>=this.bottom},Rectangle.prototype.overlaps=function(r){return this.left<r.right&&r.left<this.right&&this.top<r.bottom&&r.top<this.bottom},G.Rectangle=Rectangle}(),function(){function Camera(xView,yView,canvasWidth,canvasHeight,worldWidth,worldHeight){this.xView=xView||0,this.yView=yView||0,this.xDeadZone=0,this.yDeadZone=0,this.wView=canvasWidth,this.hView=canvasHeight,this.axis=AXIS.BOTH,this.followed=null,this.viewportRect=new G.Rectangle(this.xView,this.yView,this.wView,this.hView),this.worldRect=new G.Rectangle(0,0,worldWidth,worldHeight)}var AXIS={NONE:"none",HORIZONTAL:"horizontal",VERTICAL:"vertical",BOTH:"both"};Camera.prototype.follow=function(gameObject,xDeadZone,yDeadZone){this.followed=gameObject,this.xDeadZone=xDeadZone,this.yDeadZone=yDeadZone},Camera.prototype.update=function(){null!=this.followed&&((this.axis==AXIS.HORIZONTAL||this.axis==AXIS.BOTH)&&(this.followed.xx-this.xView+this.xDeadZone>this.wView?this.xView=this.followed.xx-(this.wView-this.xDeadZone):this.followed.xx-this.xDeadZone<this.xView&&(this.xView=this.followed.xx-this.xDeadZone)),(this.axis==AXIS.VERTICAL||this.axis==AXIS.BOTH)&&(this.followed.yy-this.yView+this.yDeadZone>this.hView?this.yView=this.followed.yy-(this.hView-this.yDeadZone):this.followed.yy-this.yDeadZone<this.yView&&(this.yView=this.followed.yy-this.yDeadZone))),this.viewportRect.set(this.xView,this.yView),this.viewportRect.within(this.worldRect)||(this.viewportRect.left<this.worldRect.left&&(this.xView=this.worldRect.left),this.viewportRect.top<this.worldRect.top&&(this.yView=this.worldRect.top),this.viewportRect.right>this.worldRect.right&&(this.xView=this.worldRect.right-this.wView),this.viewportRect.bottom>this.worldRect.bottom&&(this.yView=this.worldRect.bottom-this.hView))},G.Camera=Camera}(),navigator.sayswho=function(){var tem,N=navigator.appName,ua=navigator.userAgent,M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);return M&&null!=(tem=ua.match(/version\/([\.\d]+)/i))&&(M[2]=tem[1]),M=M?[M[1],M[2]]:[N,navigator.appVersion,"-?"]}(),function(){var browser;browser="Firefox"==navigator.sayswho[0]?"f":"Chrome"==navigator.sayswho[0]?"c":"Safari"==navigator.sayswho[0]?"s":"Microsoft"==navigator.sayswho[0]?"m":"f",G.browser=browser}();var sonantx;!function(){"use strict";function osc_sin(value){return Math.sin(6.283184*value)}function osc_square(value){return osc_sin(value)<0?-1:1}function osc_saw(value){return value%1-.5}function osc_tri(value){var v2=value%1*4;return 2>v2?v2-1:3-v2}function getnotefreq(n){return.00390625*Math.pow(1.059463094,n-128)}function genBuffer(waveSize,callBack){setTimeout(function(){var buf=new Uint8Array(waveSize*WAVE_CHAN*2),b=buf.length-2,iterate=function(){for(var begin=new Date,count=0;b>=0;)if(buf[b]=0,buf[b+1]=128,b-=2,count+=1,count%1e3===0&&new Date-begin>MAX_TIME)return void setTimeout(iterate,0);setTimeout(function(){callBack(buf)},0)};setTimeout(iterate,0)},0)}function applyDelay(chnBuf,waveSamples,instr,rowLen,callBack){var p1=instr.fx_delay_time*rowLen>>1,t1=instr.fx_delay_amt/255,n1=0,iterate=function(){for(var beginning=new Date,count=0;waveSamples-p1>n1;){var b1=4*n1,l=4*(n1+p1),x1=chnBuf[l]+(chnBuf[l+1]<<8)+(chnBuf[b1+2]+(chnBuf[b1+3]<<8)-32768)*t1;if(chnBuf[l]=255&x1,chnBuf[l+1]=x1>>8&255,x1=chnBuf[l+2]+(chnBuf[l+3]<<8)+(chnBuf[b1]+(chnBuf[b1+1]<<8)-32768)*t1,chnBuf[l+2]=255&x1,chnBuf[l+3]=x1>>8&255,++n1,count+=1,count%1e3===0&&new Date-beginning>MAX_TIME)return void setTimeout(iterate,0)}setTimeout(callBack,0)};setTimeout(iterate,0)}sonantx={};var WAVE_SPS=44100,WAVE_CHAN=2,MAX_TIME=33,audioCtx=null,oscillators=[osc_sin,osc_square,osc_saw,osc_tri];sonantx.AudioGenerator=function(mixBuf){this.mixBuf=mixBuf,this.waveSize=mixBuf.length/WAVE_CHAN/2},sonantx.AudioGenerator.prototype.getWave=function(){var b,k,x,wave,l1,l2,y,mixBuf=this.mixBuf,waveSize=this.waveSize,waveBytes=waveSize*WAVE_CHAN*2;for(l1=waveBytes-8,l2=l1-36,wave=String.fromCharCode(82,73,70,70,255&l1,l1>>8&255,l1>>16&255,l1>>24&255,87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,255&l2,l2>>8&255,l2>>16&255,l2>>24&255),b=0;waveBytes>b;){for(x="",k=0;256>k&&waveBytes>b;++k,b+=2)y=4*(mixBuf[b]+(mixBuf[b+1]<<8)-32768),y=-32768>y?-32768:y>32767?32767:y,x+=String.fromCharCode(255&y,y>>8&255);wave+=x}return wave},sonantx.AudioGenerator.prototype.getAudio=function(){var wave=this.getWave(),a=new Audio("data:audio/wav;base64,"+btoa(wave));return a.preload="none",a.load(),a},sonantx.AudioGenerator.prototype.getAudioBuffer=function(callBack){null===audioCtx&&(audioCtx=new AudioContext);var mixBuf=this.mixBuf,waveSize=this.waveSize,waveBytes=waveSize*WAVE_CHAN*2,buffer=audioCtx.createBuffer(WAVE_CHAN,this.waveSize,WAVE_SPS),lchan=buffer.getChannelData(0),rchan=buffer.getChannelData(1),b=0,iterate=function(){for(var beginning=new Date,count=0;waveBytes/2>b;){var y=4*(mixBuf[4*b]+(mixBuf[4*b+1]<<8)-32768);if(y=-32768>y?-32768:y>32767?32767:y,lchan[b]=y/32768,y=4*(mixBuf[4*b+2]+(mixBuf[4*b+3]<<8)-32768),y=-32768>y?-32768:y>32767?32767:y,rchan[b]=y/32768,b+=1,count+=1,count%1e3===0&&new Date-beginning>MAX_TIME)return void setTimeout(iterate,0)}setTimeout(function(){callBack(buffer)},0)};setTimeout(iterate,0)},sonantx.SoundGenerator=function(instr,rowLen){this.instr=instr,this.rowLen=rowLen||5605,this.osc_lfo=oscillators[instr.lfo_waveform],this.osc1=oscillators[instr.osc1_waveform],this.osc2=oscillators[instr.osc2_waveform],this.attack=instr.env_attack,this.sustain=instr.env_sustain,this.release=instr.env_release,this.panFreq=Math.pow(2,instr.fx_pan_freq-8)/this.rowLen,this.lfoFreq=Math.pow(2,instr.lfo_freq-8)/this.rowLen},sonantx.SoundGenerator.prototype.genSound=function(n,chnBuf,currentpos){for(var c1=(new Date,0),c2=0,o1t=getnotefreq(n+12*(this.instr.osc1_oct-8)+this.instr.osc1_det)*(1+8e-4*this.instr.osc1_detune),o2t=getnotefreq(n+12*(this.instr.osc2_oct-8)+this.instr.osc2_det)*(1+8e-4*this.instr.osc2_detune),q=this.instr.fx_resonance/255,low=0,band=0,j=this.attack+this.sustain+this.release-1;j>=0;--j){var k=j+currentpos,lfor=this.osc_lfo(k*this.lfoFreq)*this.instr.lfo_amt/512+.5,e=1;j<this.attack?e=j/this.attack:j>=this.attack+this.sustain&&(e-=(j-this.attack-this.sustain)/this.release);var t=o1t;this.instr.lfo_osc1_freq&&(t+=lfor),this.instr.osc1_xenv&&(t*=e*e),c1+=t;var rsample=this.osc1(c1)*this.instr.osc1_vol;t=o2t,this.instr.osc2_xenv&&(t*=e*e),c2+=t,rsample+=this.osc2(c2)*this.instr.osc2_vol,this.instr.noise_fader&&(rsample+=(2*Math.random()-1)*this.instr.noise_fader*e),rsample*=e/255;var f=this.instr.fx_freq;this.instr.lfo_fx_freq&&(f*=lfor),f=1.5*Math.sin(3.141592*f/WAVE_SPS),low+=f*band;var high=q*(rsample-band)-low;switch(band+=f*high,this.instr.fx_filter){case 1:rsample=high;break;case 2:rsample=low;break;case 3:rsample=band;break;case 4:rsample=low+high}if(t=osc_sin(k*this.panFreq)*this.instr.fx_pan_amt/512+.5,rsample*=39*this.instr.env_master,k=4*k,k+3<chnBuf.length){var x=chnBuf[k]+(chnBuf[k+1]<<8)+rsample*(1-t);chnBuf[k]=255&x,chnBuf[k+1]=x>>8&255,x=chnBuf[k+2]+(chnBuf[k+3]<<8)+rsample*t,chnBuf[k+2]=255&x,chnBuf[k+3]=x>>8&255}}},sonantx.SoundGenerator.prototype.getAudioGenerator=function(n,callBack){var bufferSize=this.attack+this.sustain+this.release-1+32*this.rowLen,self=this;genBuffer(bufferSize,function(buffer){self.genSound(n,buffer,0),applyDelay(buffer,bufferSize,self.instr,self.rowLen,function(){callBack(new sonantx.AudioGenerator(buffer))})})},sonantx.SoundGenerator.prototype.createAudio=function(n,callBack){this.getAudioGenerator(n,function(ag){callBack(ag.getAudio())})},sonantx.SoundGenerator.prototype.createAudioBuffer=function(n,callBack){this.getAudioGenerator(n,function(ag){ag.getAudioBuffer(callBack)})},sonantx.MusicGenerator=function(song){this.song=song,this.waveSize=WAVE_SPS*song.songLen},sonantx.MusicGenerator.prototype.generateTrack=function(instr,mixBuf,callBack){var self=this;genBuffer(this.waveSize,function(chnBuf){var waveSamples=self.waveSize,waveBytes=self.waveSize*WAVE_CHAN*2,rowLen=self.song.rowLen,endPattern=self.song.endPattern,soundGen=new sonantx.SoundGenerator(instr,rowLen),currentpos=0,p=0,row=0,recordSounds=function(){for(var beginning=new Date;;)if(32!==row){if(p===endPattern-1)return void setTimeout(delay,0);var cp=instr.p[p];if(cp){var n=instr.c[cp-1].n[row];n&&soundGen.genSound(n,chnBuf,currentpos)}if(currentpos+=rowLen,row+=1,new Date-beginning>MAX_TIME)return void setTimeout(recordSounds,0)}else row=0,p+=1},delay=function(){applyDelay(chnBuf,waveSamples,instr,rowLen,finalize)},b2=0,finalize=function(){for(var beginning=new Date,count=0;waveBytes>b2;){var x2=mixBuf[b2]+(mixBuf[b2+1]<<8)+chnBuf[b2]+(chnBuf[b2+1]<<8)-32768;if(mixBuf[b2]=255&x2,mixBuf[b2+1]=x2>>8&255,b2+=2,count+=1,count%1e3===0&&new Date-beginning>MAX_TIME)return void setTimeout(finalize,0)}setTimeout(callBack,0)};setTimeout(recordSounds,0)})},sonantx.MusicGenerator.prototype.getAudioGenerator=function(callBack){var self=this;genBuffer(this.waveSize,function(mixBuf){var t=0,recu=function(){t<self.song.songData.length?(t+=1,self.generateTrack(self.song.songData[t-1],mixBuf,recu)):callBack(new sonantx.AudioGenerator(mixBuf))};recu()})},sonantx.MusicGenerator.prototype.createAudio=function(callBack){this.getAudioGenerator(function(ag){callBack(ag.getAudio())})},sonantx.MusicGenerator.prototype.createAudioBuffer=function(callBack){this.getAudioGenerator(function(ag){ag.getAudioBuffer(callBack)})}}(),G.sonantx=sonantx,G.Key={_pressed:{},_released:{},LEFT:37,UP:38,RIGHT:39,DOWN:40,SPACE:32,a:65,w:87,s:83,d:68,z:90,x:88,f:70,isDown:function(keyCode){return this._pressed[keyCode]},justReleased:function(keyCode){return this._released[keyCode]},onKeydown:function(event){this._pressed[event.keyCode]=!0},onKeyup:function(event){this._released[event.keyCode]=!0,delete this._pressed[event.keyCode]},update:function(){this._released={}}},G.seedMap=function(map,chance){for(var i=0;i<map.length;i++)for(var j=0;j<map[0].length;j++)Math.random()<chance?map[i][j]=1:map[i][j]=0;return map},G.flipMap=function(map){for(var i=0;i<map.length;i++)for(var j=0;j<map[0].length;j++)0==map[i][j]?map[i][j]=1:map[i][j]=0;return map},G.initMap=function(width,height){for(var map=[],i=0;height>i;i++){map.push([]);for(var j=0;width>j;j++)map[i].push(0)}return map},G.initPlayerSpace=function(map,cx,cy){for(var i=-1;2>i;i++)for(var j=-1;2>j;j++)map[cy+j][cx+i]=0},G.cellFlip=function(cx,cy){0==G.Map[cy][cx+1]?G.Map[cy][cx+1]=1:G.Map[cy][cx+1]=0,0==G.player.map[cy][cx+1]?G.player.map[cy][cx+1]=1:G.player.map[cy][cx+1]=0},G.countAliveNeighbors=function(map,x,y){for(var count=0,i=-1;2>i;i++)for(var j=-1;2>j;j++){var nX=x+j,nY=y+i;0==i&&0==j||(0>nX||0>nY||nX>=map[0].length||nY>=map.length?count++:map[nY][nX]&&count++)}return count},G.iterateMap=function(oldMap,birthLimit,deathLimit){for(var newMap=G.initMap(G["const"].WIDTH,G["const"].HEIGHT),y=0;y<oldMap.length;y++)for(var x=0;x<oldMap[0].length;x++){var nbs=G.countAliveNeighbors(oldMap,x,y);oldMap[y][x]?nbs>deathLimit?newMap[y][x]=0:newMap[y][x]=0:birthLimit>nbs?newMap[y][x]=1:newMap[y][x]=0}return newMap},G.drawMap=function(ctx,xView,yView){for(var i=0;i<G.Map.length;i++)for(var j=0;j<G.Map[i].length;j++)G.Map[i][j]&&(ctx.strokeStyle="#202020",ctx.strokeRect(j*G["const"].GRID-xView,i*G["const"].GRID-yView,G["const"].GRID,G["const"].GRID),i>0&&i<G.Map.length-1&&(0==G.Map[i-1][j]&&(ctx.beginPath(),ctx.strokeStyle=G.player.flipped?"purple":"red",ctx.moveTo(j*G["const"].GRID-xView,i*G["const"].GRID-yView),ctx.lineTo(j*G["const"].GRID-xView+G["const"].GRID,i*G["const"].GRID-yView),ctx.stroke()),0==G.Map[i+1][j]&&(ctx.beginPath(),ctx.strokeStyle=G.player.flipped?"red":"purple",ctx.moveTo(j*G["const"].GRID-xView,i*G["const"].GRID-yView+G["const"].GRID),ctx.lineTo(j*G["const"].GRID-xView+G["const"].GRID,i*G["const"].GRID-yView+G["const"].GRID),ctx.stroke())),j>0&&j<G.Map[i].length-1&&(0==G.Map[i][j-1]&&(ctx.beginPath(),ctx.strokeStyle="gray",ctx.moveTo(j*G["const"].GRID-xView,i*G["const"].GRID-yView),ctx.lineTo(j*G["const"].GRID-xView,i*G["const"].GRID-yView+G["const"].GRID),ctx.stroke()),0==G.Map[i][j+1]&&(ctx.beginPath(),ctx.strokeStyle="gray",ctx.moveTo(j*G["const"].GRID-xView+G["const"].GRID,i*G["const"].GRID-yView),ctx.lineTo(j*G["const"].GRID-xView+G["const"].GRID,i*G["const"].GRID-yView+G["const"].GRID),ctx.stroke())))},G.Entity=function(){this.cx=0,this.cy=0,this.xr=0,this.yr=0,this.xx=0,this.yy=0,this.dx=0,this.dy=0,this.radius=0,this.gravity=0,this.frictX=.92,this.frictY=.94},G.Entity.prototype.setCoords=function(x,y){this.xx=x,this.yy=y,this.cx=Math.floor(this.xx/G["const"].GRID),this.cy=Math.floor(this.yy/G["const"].GRID),this.xr=(this.xx-this.cx*G["const"].GRID)/G["const"].GRID,this.xy=(this.yy-this.cy*G["const"].GRID)/G["const"].GRID},G.Entity.prototype.hasCollision=function(cx,cy){return this==G.player?this.cx<1&&this.xr<.5||cx>=G["const"].WIDTH?!0:void 0==G.player.map[cy]?!0:G.player.map[cy][cx]:this.cx<1&&this.xr<.5||cx>=G["const"].WIDTH?!0:void 0==G.Map[cy]?!1:G.Map[cy][cx]},G.Entity.prototype.overlaps=function(e){var maxDist=this.radius+e.radius,distSqr=(e.xx-this.xx)*(e.xx-this.xx)+(e.yy-this.yy)*(e.yy-this.yy);return maxDist*maxDist>=distSqr?!0:!1},G.Entity.prototype.onGround=function(){return this.hasCollision(this.cx,this.cy+1)&&this.yr>=.5},G.Entity.prototype.onCeiling=function(){return this.hasCollision(this.cx,this.cy-1)&&this.yr<=.5},G.Entity.prototype.update=function(){var gravity=this.gravity;for(this.xr+=this.dx,this.dx*=this.frictX,this.hasCollision(this.cx-1,this.cy)&&this.xr<=.3&&(this.dx=0,this.xr=.3),this.hasCollision(this.cx+1,this.cy)&&this.xr>=.7&&(this.dx=0,this.xr=.7);this.xr<0;)this.cx--,this.xr++;for(;this.xr>1;)this.cx++,this.xr--;for(this.dy+=gravity,this.yr+=this.dy,this.dy*=this.frictY,this.hasCollision(this.cx,this.cy-1)&&this.yr<=.4&&(this.dy=0,this.yr=.4),this.hasCollision(this.cx,this.cy+1)&&this.yr>=.6&&(this.dy=0,this.yr=.6);this.yr<0;)this.cy--,this.yr++;for(;this.yr>1;)this.cy++,this.yr--;for(var i=0;i<G.ALL.length;i++){var e=G.ALL[i];if(e!=this&&Math.abs(this.cx-e.cx)<=1&&Math.abs(this.cy-e.cy)<=1){var dist=Math.sqrt((e.xx-this.xx)*(e.xx-this.xx)+(e.yy-this.yy)*(e.yy-this.yy));if(dist<=this.radius+e.radius){var ang=Math.atan2(e.yy-this.yy,e.xx-this.xx),force=.03,repelPower=(this.radius+e.radius-dist)/(this.radius+e.radius);this.dx-=Math.cos(ang)*repelPower*force,this.dy-=Math.sin(ang)*repelPower*force,e.dx+=Math.cos(ang)*repelPower*force,e.dy+=Math.sin(ang)*repelPower*force}}}this.xx=Math.floor((this.cx+this.xr)*G["const"].GRID),this.yy=Math.floor((this.cy+this.yr)*G["const"].GRID),this.yy>G["const"].GRID*G["const"].HEIGHT+this.radius&&this.setCoords(this.xx,-this.radius)},G.player=new G.Entity,G.player.width=16,G.player.height=16,G.player.radius=8,G.player.gravity=G["const"].P_GRAVITY,G.player.setCoords(200,100),G.player.flipped=!1,G.player.map=[],G.player.draw=function(ctx,xView,yView){G.player;this.flipped?(ctx.beginPath(),ctx.fillStyle=this.flipped?"red":"purple",ctx.moveTo(this.xx-8-xView,this.yy+8-yView),ctx.lineTo(this.xx+8-xView,this.yy+8-yView),ctx.lineTo(this.xx-xView,this.yy-8-yView),ctx.lineTo(this.xx-8-xView,this.yy+8-yView),ctx.fill()):(ctx.beginPath(),ctx.fillStyle=this.flipped?"red":"purple",ctx.fillRect(this.xx-this.width/2-xView,this.yy-this.height/2-yView,this.width,this.height),ctx.fill())},G.player.moveLeft=function(){this.flipped?this.dx-=G["const"].P_SPEED:(this.dx-=G["const"].P_THRUST,G.jetloop.volume.gain.value=1)},G.player.moveRight=function(){this.flipped?this.dx+=G["const"].P_SPEED:(this.dx+=G["const"].P_THRUST,G.jetloop.volume.gain.value=1)},G.player.moveUp=function(){this.dy-=G["const"].P_THRUST,G.jetloop.volume.gain.value=1},G.player.jump=function(){G.playSound(G.sounds.jump),this.dy=-G["const"].P_JUMP},G.player.moveDown=function(){this.dy+=G["const"].P_THRUST,G.jetloop.volume.gain.value=1},G.player.flip=function(){this.onGround()?this.flipped&&(G.flipMap(G.player.map),this.flipped=!this.flipped,this.setCoords(this.xx,this.yy+G["const"].GRID),G.playSound(G.sounds.flip)):this.onCeiling()&&(this.flipped||(G.flipMap(G.player.map),this.flipped=!this.flipped,this.setCoords(this.xx,this.yy-G["const"].GRID),G.playSound(G.sounds.flip)))},G.player.inputUpdate=function(){this.gravity=this.flipped?G["const"].P_GRAVITY:0,this.frictY=this.flipped?G["const"].P_FRICTY:G["const"].P_SPACEFRICT,this.frictX=this.flipped?G["const"].P_FRICTX:G["const"].P_SPACEFRICT,(G.Key.isDown(G.Key.UP)||G.Key.isDown(G.Key.w))&&(this.flipped||this.moveUp()),this.flipped&&this.onGround()&&(G.Key.isDown(G.Key.UP)||G.Key.isDown(G.Key.w))&&this.jump(),(G.Key.isDown(G.Key.DOWN)||G.Key.isDown(G.Key.s)&&!this.flipped)&&this.moveDown(),(G.Key.isDown(G.Key.LEFT)||G.Key.isDown(G.Key.a))&&this.moveLeft(),(G.Key.isDown(G.Key.RIGHT)||G.Key.isDown(G.Key.d))&&this.moveRight(),G.Key.justReleased(G.Key.SPACE)&&this.flip(),(G.Key.justReleased(G.Key.a)||G.Key.justReleased(G.Key.LEFT)||G.Key.justReleased(G.Key.w)||G.Key.justReleased(G.Key.UP)||G.Key.justReleased(G.Key.d)||G.Key.justReleased(G.Key.RIGHT)||G.Key.justReleased(G.Key.s)||G.Key.justReleased(G.Key.DOWN))&&(G.jetloop.volume.gain.value=0)},G.mobs=[],G.drawMobs=function(ctx,xView,yView){G.mobs.forEach(function(e){e.update(),ctx.beginPath(),ctx.arc(e.xx+e.radius-xView,e.yy+e.radius-yView,e.radius,0,2*Math.PI,!1),ctx.fillStyle="blue",ctx.fill()})},G.enemy=new G.Entity,G.enemy.setCoords(300,500),G.enemy.width=8,G.enemy.height=8,G.enemy.radius=4,G.enemy.draw=function(ctx){ctx.beginPath(),ctx.arc(this.xx,this.yy,this.radius,0,2*Math.PI,!1),ctx.fillStyle="white",ctx.fill()},G.enemy.eUpdate=function(){},G.audio={JUMP:{osc1_oct:7,osc1_det:0,osc1_detune:0,osc1_xenv:1,osc1_vol:255,osc1_waveform:2,osc2_oct:8,osc2_det:0,osc2_detune:0,osc2_xenv:1,osc2_vol:255,osc2_waveform:2,noise_fader:0,env_attack:3706,env_sustain:0,env_release:0,env_master:191,fx_filter:3,fx_freq:4067,fx_resonance:176,fx_delay_time:4,fx_delay_amt:44,fx_pan_freq:2,fx_pan_amt:84,lfo_osc1_freq:0,lfo_fx_freq:1,lfo_freq:2,lfo_amt:96,lfo_waveform:0},FLIP:{osc1_oct:7,osc1_det:0,osc1_detune:0,osc1_xenv:1,osc1_vol:255,osc1_waveform:3,osc2_oct:5,osc2_det:0,osc2_detune:0,osc2_xenv:1,osc2_vol:143,osc2_waveform:3,noise_fader:255,env_attack:0,env_sustain:2418,env_release:17193,env_master:57,fx_filter:1,fx_freq:4067,fx_resonance:176,fx_delay_time:4,fx_delay_amt:44,fx_pan_freq:12,fx_pan_amt:84,lfo_osc1_freq:0,lfo_fx_freq:1,lfo_freq:2,lfo_amt:160,lfo_waveform:2},JET:{osc1_oct:8,osc1_det:0,osc1_detune:0,osc1_xenv:1,osc1_vol:82,osc1_waveform:2,osc2_oct:8,osc2_det:0,osc2_detune:0,osc2_xenv:0,osc2_vol:0,osc2_waveform:0,noise_fader:255,env_attack:100,env_sustain:23881,env_release:0,env_master:232,fx_filter:3,fx_freq:392,fx_resonance:47,fx_delay_time:0,fx_delay_amt:0,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:0,lfo_freq:0,lfo_amt:0,lfo_waveform:0},GAMESONG:{songLen:154,songData:[{osc1_oct:9,osc1_det:0,osc1_detune:0,osc1_xenv:0,osc1_vol:255,osc1_waveform:3,osc2_oct:9,osc2_det:0,osc2_detune:14,osc2_xenv:0,osc2_vol:255,osc2_waveform:3,noise_fader:0,env_attack:1e5,env_sustain:28181,env_release:1e5,env_master:106,fx_filter:3,fx_freq:3700,fx_resonance:88,fx_delay_time:8,fx_delay_amt:121,fx_pan_freq:1,fx_pan_amt:22,lfo_osc1_freq:0,lfo_fx_freq:1,lfo_freq:4,lfo_amt:228,lfo_waveform:0,p:[0,0,1,2,1,2,1,2,1,2,0,0,1,2,1,2],c:[{n:[123,138,135,150,0,0,0,0,0,0,0,0,0,0,0,0,119,138,131,150,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[119,140,143,152,0,0,0,0,0,0,0,0,0,0,0,0,116,138,140,150,0,0,0,0,0,0,0,0,0,0,0,0]}]},{osc1_oct:7,osc1_det:0,osc1_detune:0,osc1_xenv:0,osc1_vol:255,osc1_waveform:2,osc2_oct:8,osc2_det:0,osc2_detune:18,osc2_xenv:0,osc2_vol:255,osc2_waveform:2,noise_fader:0,env_attack:1e5,env_sustain:56363,env_release:1e5,env_master:199,fx_filter:2,fx_freq:200,fx_resonance:254,fx_delay_time:8,fx_delay_amt:24,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:0,lfo_freq:0,lfo_amt:0,lfo_waveform:0,p:[3,4,3,4,3,4,3,4,3,4,5,6,3,4,3,4,3,5],c:[{n:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[123,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[121,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[111,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]},{osc1_oct:8,osc1_det:0,osc1_detune:0,osc1_xenv:0,osc1_vol:0,osc1_waveform:0,osc2_oct:8,osc2_det:0,osc2_detune:0,osc2_xenv:0,osc2_vol:0,osc2_waveform:0,noise_fader:255,env_attack:1e5,env_sustain:1e5,env_release:1e5,env_master:192,fx_filter:2,fx_freq:2500,fx_resonance:16,fx_delay_time:3,fx_delay_amt:157,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:1,lfo_freq:3,lfo_amt:51,lfo_waveform:0,p:[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],c:[{n:[135,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,135,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]},{osc1_oct:8,osc1_det:0,osc1_detune:0,osc1_xenv:1,osc1_vol:255,osc1_waveform:0,osc2_oct:8,osc2_det:0,osc2_detune:0,osc2_xenv:0,osc2_vol:0,osc2_waveform:0,noise_fader:0,env_attack:0,env_sustain:0,env_release:6363,env_master:239,fx_filter:0,fx_freq:7400,fx_resonance:126,fx_delay_time:0,fx_delay_amt:0,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:0,lfo_freq:0,lfo_amt:0,lfo_waveform:0,p:[0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1],c:[{n:[135,135,0,0,0,0,135,0,135,0,0,0,0,0,0,0,135,135,0,0,0,0,135,0,135,0,0,135,0,0,135,0]}]},{osc1_oct:8,osc1_det:0,osc1_detune:0,osc1_xenv:1,osc1_vol:255,osc1_waveform:0,osc2_oct:8,osc2_det:0,osc2_detune:0,osc2_xenv:0,osc2_vol:0,osc2_waveform:0,noise_fader:112,env_attack:1818,env_sustain:0,env_release:18181,env_master:254,fx_filter:3,fx_freq:6600,fx_resonance:78,fx_delay_time:3,fx_delay_amt:73,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:1,lfo_freq:4,lfo_amt:85,lfo_waveform:0,p:[0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1],c:[{n:[0,0,0,0,135,0,0,0,0,0,0,0,135,0,0,0,0,0,0,0,135,0,0,0,0,0,0,0,135,0,0,0]}]},{osc1_oct:9,osc1_det:0,osc1_detune:0,osc1_xenv:0,osc1_vol:255,osc1_waveform:0,osc2_oct:9,osc2_det:0,osc2_detune:12,osc2_xenv:0,osc2_vol:255,osc2_waveform:0,noise_fader:0,env_attack:100,env_sustain:0,env_release:14545,env_master:70,fx_filter:0,fx_freq:0,fx_resonance:240,fx_delay_time:2,fx_delay_amt:157,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:0,lfo_freq:0,lfo_amt:0,lfo_waveform:0,p:[0,0,0,0,0,0,1,2,1,2,0,0,0,0,1,2],c:[{n:[135,147,135,147,0,0,0,0,0,0,0,0,0,0,145,0,147,0,0,0,0,0,0,0,138,150,138,0,137,149,137,0]},{n:[128,140,143,142,0,0,0,0,0,0,0,0,133,145,133,0,140,152,155,154,0,0,0,0,0,0,0,0,0,0,0,0]}]},{osc1_oct:9,osc1_det:0,osc1_detune:0,osc1_xenv:0,osc1_vol:255,osc1_waveform:2,osc2_oct:10,osc2_det:0,osc2_detune:28,osc2_xenv:0,osc2_vol:255,osc2_waveform:2,noise_fader:0,env_attack:100,env_sustain:0,env_release:5454,env_master:254,fx_filter:2,fx_freq:7800,fx_resonance:94,fx_delay_time:3,fx_delay_amt:103,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:1,lfo_freq:7,lfo_amt:128,lfo_waveform:0,p:[0,0,0,0,0,0,0,0,0,0,1,2,1,2,1,2,1,2],c:[{n:[0,135,137,0,137,138,0,138,140,0,140,142,0,142,143,145,0,135,137,0,137,138,0,138,140,0,140,142,0,142,143,145]},{n:[0,135,137,0,137,138,0,138,140,0,140,142,0,142,143,145,0,135,137,0,137,138,0,138,140,0,140,142,150,149,147,149]}]},{osc1_oct:8,osc1_det:0,osc1_detune:0,osc1_xenv:1,osc1_vol:82,osc1_waveform:2,osc2_oct:8,osc2_det:0,osc2_detune:0,osc2_xenv:0,osc2_vol:0,osc2_waveform:0,noise_fader:255,env_attack:100,env_sustain:0,env_release:9090,env_master:232,fx_filter:3,fx_freq:5200,fx_resonance:63,fx_delay_time:0,fx_delay_amt:0,fx_pan_freq:0,fx_pan_amt:0,lfo_osc1_freq:0,lfo_fx_freq:0,lfo_freq:0,lfo_amt:0,lfo_waveform:0,p:[0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],c:[{n:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{n:[0,0,135,0,0,0,135,0,0,0,135,0,0,135,135,0,0,0,135,0,0,0,135,0,0,0,135,135,0,0,135,0]}]}],rowLen:11025,endPattern:19}};var G=window.G||{};G.canvas=document.querySelector("#game"),G.ctx=G.canvas.getContext("2d"),G.ctx.webkitImageSmoothingEnabled=!1,G.ctx.mozImageSmowothingEnabled=!1,G.ctx.imageSmoothingEnabled=!1,G.init=function(){G.ALL.push(G.player),G.bufferCanvas=document.createElement("canvas"),G.bufferCanvas.width=800,G.bufferCanvas.height=600,G.buffer=G.bufferCanvas.getContext("2d"),G.buffer.webkitImageSmoothingEnabled=!1,G.buffer.mozImageSmoothingEnabled=!1,G.buffer.imageSmoothingEnabled=!1,G.scrollFactor=.99,G.camera=new G.Camera(0,0,G.bufferCanvas.width,G.bufferCanvas.height,G["const"].WIDTH*G["const"].GRID,G["const"].HEIGHT*G["const"].GRID),G.camera.follow(G.player,100,100),G.Map=G.initMap(G["const"].WIDTH,G["const"].HEIGHT),G.seedMap(G.Map,.4),G.Map=G.iterateMap(G.Map,4,3),G.Map=G.iterateMap(G.Map,4,3),G.Map=G.iterateMap(G.Map,4,3),G.initPlayerSpace(G.Map,G.player.cx,G.player.cy),G.player.map=G.Map.map(function(arr){return arr.slice()}),G.initAudio(),G.loadingScreen()},G.initAudio=function(){G.sounds={},G.sounds.loaded=0,G.sounds.total=4,window.AudioContext=window.AudioContext||window.webkitAudioContext,G.audioCtx=new AudioContext,G.soundGen=new G.sonantx.SoundGenerator(G.audio.JUMP),G.soundGen.createAudioBuffer(171,function(buffer){G.sounds.loaded++,G.sounds.jump=buffer}),G.soundGen=new G.sonantx.SoundGenerator(G.audio.FLIP),G.soundGen.createAudioBuffer(183,function(buffer){G.sounds.loaded++,G.sounds.flip=buffer}),G.soundGen=new G.sonantx.SoundGenerator(G.audio.JET),G.soundGen.createAudioBuffer(130,function(buffer){G.sounds.loaded++,G.sounds.jet=buffer}),G.soundGen=new G.sonantx.MusicGenerator(G.audio.GAMESONG),G.soundGen.createAudioBuffer(function(buffer){G.sounds.loaded++,G.sounds.gameSong=buffer})},G.playSound=function(buffer,loop){var source=G.audioCtx.createBufferSource(),gainNode=G.audioCtx.createGain();return source.buffer=buffer,source.connect(gainNode),gainNode.connect(G.audioCtx.destination),source.loop=loop,source.start(),{volume:gainNode,sound:source}},G.drawBG=function(ctx,xView,yView){for(var i=0;i<G["const"].HEIGHT;i++)for(var j=0;j<G["const"].WIDTH;j++)j%2==0?i%2==1&&(ctx.fillStyle="#080808",ctx.fillRect(j*G["const"].GRID-xView,i*G["const"].GRID-yView,G["const"].GRID,G["const"].GRID)):i%2==0&&(ctx.fillStyle="#080808",ctx.fillRect(j*G["const"].GRID-xView,i*G["const"].GRID-yView,G["const"].GRID,G["const"].GRID))},G.render=function(canvas){G.ctx.fillStyle="black",G.ctx.fillRect(0,0,1200,864),G.ctx.drawImage(canvas,0,0,800,600,0,0,800,600)},G.loadingScreen=function(){G.sounds.loaded!=G.sounds.total&&null==G.sounds.gameSong?(requestAnimationFrame(G.loadingScreen),G.ctx.fillStyle="black",G.ctx.fillRect(0,0,800,600),G.ctx.fillStyle="white",G.ctx.font="48px serif",G.ctx.fillText("Loading... "+G.sounds.loaded,10,50)):(G.playSound(G.sounds.gameSong,!0),G.jetloop=G.playSound(G.sounds.jet,!0),G.jetloop.sound.loopEnd=.3,G.jetloop.volume.gain.value=0,G.loop())},G.loop=function(){requestAnimationFrame(G.loop),G.player.inputUpdate(),G.Map=G.Map,G.player.map=G.player.map,G.player.update(),G.camera.update(),G.Key.update(),G.buffer.fillStyle="black",G.buffer.fillRect(0,0,800,600),G.drawBG(G.buffer,G.camera.xView,G.camera.yView),G.drawMap(G.buffer,G.camera.xView,G.camera.yView),G.drawMobs(G.buffer,G.camera.xView,G.camera.yView),G.player.draw(G.buffer,G.camera.xView,G.camera.yView),G.enemy.draw(G.buffer,G.camera.xView,G.camera.yView),G.render(G.bufferCanvas)},window.addEventListener("keyup",function(event){G.Key.onKeyup(event)},!1),window.addEventListener("keydown",function(event){G.Key.onKeydown(event)},!1),window.onload=G.init;