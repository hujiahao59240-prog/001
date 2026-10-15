export const SIZE = 20;
const vectors = {up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const opposite = {up:'down',down:'up',left:'right',right:'left'};
const same = (a,b) => a.x===b.x && a.y===b.y;
function foodFor(snake, random) {
  const occupied=new Set(snake.map(p=>`${p.x},${p.y}`));
  const empty=[];
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)if(!occupied.has(`${x},${y}`))empty.push({x,y});
  return empty.length ? empty[Math.floor(random()*empty.length)] : null;
}
export function createGame(random=Math.random) {
  const snake=[{x:8,y:10},{x:7,y:10},{x:6,y:10}];
  return {snake,direction:'right',pendingDirection:null,food:foodFor(snake,random),score:0,status:'ready'};
}
export function turn(state,direction) {
  if(state.status!=='running'||!vectors[direction]||state.pendingDirection||direction===state.direction||direction===opposite[state.direction])return state;
  return {...state,pendingDirection:direction};
}
export function step(state,random=Math.random) {
  if(state.status!=='running')return state;
  const direction=state.pendingDirection||state.direction;
  const [dx,dy]=vectors[direction];
  const head={x:state.snake[0].x+dx,y:state.snake[0].y+dy};
  const eats=state.food && same(head,state.food);
  const body=eats?state.snake:state.snake.slice(0,-1);
  if(head.x<0||head.y<0||head.x>=SIZE||head.y>=SIZE||body.some(p=>same(p,head)))return {...state,status:'over',pendingDirection:null};
  const snake=[head,...state.snake];
  if(!eats)snake.pop();
  const food=eats?foodFor(snake,random):state.food;
  return {...state,snake,direction,pendingDirection:null,food,score:state.score+(eats?10:0),status:food?'running':'won'};
}
