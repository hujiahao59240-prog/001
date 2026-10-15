import {createGame,turn,step,SIZE} from './game.js';
const $=id=>document.getElementById(id);
const canvas=$('board'), ctx=canvas.getContext('2d');
let state=createGame(), timer=null, best=0, pointer=null;
try {const value=Number(localStorage.getItem('neon-snake-best'));best=Number.isFinite(value)&&value>0?value:0;}catch{}
const labels={ready:'准备就绪',running:'游戏中',paused:'已暂停',over:'本局结束',won:'挑战成功'};
function draw(){
 const cell=canvas.width/SIZE;
 ctx.fillStyle='#11190f';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.strokeStyle='#22301c';ctx.lineWidth=1;
 for(let i=1;i<SIZE;i++){ctx.beginPath();ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,600);ctx.moveTo(0,i*cell);ctx.lineTo(600,i*cell);ctx.stroke();}
 if(state.food){const {x,y}=state.food;ctx.shadowColor='#d9fc8b';ctx.shadowBlur=20;ctx.fillStyle='#e2ffa0';ctx.beginPath();ctx.arc((x+.5)*cell,(y+.5)*cell,7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
 state.snake.forEach((p,i)=>{ctx.fillStyle=i===0?'#d2ff89':`hsl(89 62% ${Math.max(32,65-i*1.3)}%)`;ctx.beginPath();ctx.roundRect(p.x*cell+2,p.y*cell+2,cell-4,cell-4,i===0?7:4);ctx.fill();});
 const head=state.snake[0],c=cell;ctx.fillStyle='#233815';
 const eyes={right:[[.67,.32],[.67,.68]],left:[[.33,.32],[.33,.68]],up:[[.32,.33],[.68,.33]],down:[[.32,.67],[.68,.67]]}[state.direction];
 for(const [x,y] of eyes){ctx.beginPath();ctx.arc((head.x+x)*c,(head.y+y)*c,2.5,0,Math.PI*2);ctx.fill();}
}
function render(){
 if(state.score>best){best=state.score;try{localStorage.setItem('neon-snake-best',String(best));}catch{}}
 $('score').textContent=state.score;$('best').textContent=best;$('status').textContent=labels[state.status];
 const running=state.status==='running';$('overlay').hidden=running;
 $('pause').disabled=!['running','paused'].includes(state.status);
 $('pause').innerHTML=state.status==='paused'?'继续游戏 <kbd>SPACE</kbd>':'暂停游戏 <kbd>SPACE</kbd>';
 const content={ready:['准备好出发了吗？','吃掉光点，让自己变得更长。','开始游戏'],paused:['休息一下，再出发。','你的进度还在，随时回来。','继续游戏'],over:['差一点，再来一局！',`本局得到 ${state.score} 分，下一局更进一步。`,'再玩一局'],won:['你填满了整个世界！',`满分挑战达成 · ${state.score} 分`,'再玩一局']};
 if(!running){const [title,copy,button]=content[state.status];$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;$('start').textContent=button;}
 draw();
}
function stop(){if(timer!==null)clearInterval(timer);timer=null;}
function run(){stop();state={...state,status:'running'};render();timer=setInterval(()=>{state=step(state);if(state.status!=='running')stop();render();},140);}
function pause(){if(state.status==='running'){stop();state={...state,status:'paused'};render();}else if(state.status==='paused')run();}
function restart(){stop();state=createGame();run();}
$('start').addEventListener('click',()=>{if(state.status==='paused'||state.status==='ready')run();else restart();});
$('restart').addEventListener('click',restart);$('pause').addEventListener('click',pause);
const keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
document.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;const direction=keys[event.key]||keys[event.key.toLowerCase()];if(direction){event.preventDefault();state=turn(state,direction);}else if(event.code==='Space'){event.preventDefault();if(event.repeat)return;if(state.status==='running'||state.status==='paused')pause();else if(event.target.tagName==='BUTTON')event.target.click();}});
for(const button of document.querySelectorAll('[data-dir]'))button.addEventListener('click',()=>{state=turn(state,button.dataset.dir);});
canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,id:e.pointerId};try{canvas.setPointerCapture(e.pointerId);}catch{}});
canvas.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.max(Math.abs(dx),Math.abs(dy))<15)return;state=turn(state,Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');});
canvas.addEventListener('pointercancel',()=>{pointer=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.status==='running')pause();});
render();
