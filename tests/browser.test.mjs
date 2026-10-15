import assert from 'node:assert/strict';
// npm install --prefix /tmp/snake-browser --cache /tmp/snake-npm-cache playwright
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH, args:process.env.CHROMIUM_PATH?['--no-sandbox','--disable-dev-shm-usage','--single-process']:[]});
const page=await browser.newPage({viewport:{width:1200,height:900}});
page.setDefaultTimeout(5000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();
await page.addInitScript(()=>{Math.random=()=>206.1/397;});
const url=process.env.GAME_URL||'http://127.0.0.1:8000';
try {
 await page.goto(url);await page.getByRole('heading',{name:'贪吃蛇'}).waitFor();
 const canvas=page.locator('canvas');
 const image=()=>canvas.evaluate(c=>c.toDataURL());
 const head=()=>canvas.evaluate(c=>{const ctx=c.getContext('2d');for(let y=0;y<20;y++)for(let x=0;x<20;x++){const p=ctx.getImageData(x*30+15,y*30+15,1,1).data;if(p[0]===210&&p[1]===255&&p[2]===137)return {x,y};}throw Error('head not found');});
 await page.locator('#start').click();
 assert.deepEqual(await head(),{x:8,y:10});await page.clock.runFor(140);assert.deepEqual(await head(),{x:9,y:10});
 assert.equal(await page.locator('#score').innerText(),'10');assert.equal(await page.locator('#best').innerText(),'10');
 await page.locator('#pause').click();const paused=await image();await page.clock.runFor(420);assert.equal(await image(),paused);
 await page.locator('#pause').click();await page.clock.runFor(140);assert.deepEqual(await head(),{x:10,y:10});
 await page.keyboard.press('ArrowUp');await page.clock.runFor(140);assert.deepEqual(await head(),{x:10,y:9});
 await page.keyboard.press('a');await page.clock.runFor(140);assert.deepEqual(await head(),{x:9,y:9});
 await page.keyboard.press('Space');assert.equal(await page.locator('#status').innerText(),'已暂停');await page.keyboard.press('Space');assert.equal(await page.locator('#status').innerText(),'游戏中');
 await page.locator('#restart').click();await page.locator('#restart').click();assert.equal(await page.locator('#score').innerText(),'0');await page.clock.runFor(140);assert.deepEqual(await head(),{x:9,y:10});
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 assert.equal(await page.locator('#status').innerText(),'已暂停');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
 await page.clock.runFor(420);assert.equal(await page.locator('#status').innerText(),'已暂停');
 await page.screenshot({path:'/tmp/snake-desktop.png',fullPage:true});
 await page.reload();assert.equal(await page.locator('#best').innerText(),'10');
 await page.setViewportSize({width:320,height:800});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#start').click();await page.getByRole('button',{name:'向上',exact:true}).click();await page.clock.runFor(140);assert.deepEqual(await head(),{x:8,y:9});
 await canvas.dispatchEvent('pointerdown',{clientX:100,clientY:100,pointerId:1});await canvas.dispatchEvent('pointerup',{clientX:40,clientY:100,pointerId:1});await page.clock.runFor(140);assert.deepEqual(await head(),{x:7,y:9});
 await page.locator('#pause').click();await page.screenshot({path:'/tmp/snake-mobile.png',fullPage:true});
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('storage blocked');}});});
 await page.reload();await page.locator('#start').click();await page.clock.runFor(140);assert.equal(await page.locator('#status').innerText(),'游戏中');assert.equal(await page.locator('#score').innerText(),'10');
 assert.deepEqual(errors,[]);console.log('PASS: movement, scoring, pause/resume, keyboard, restart timer, background, persistence, blocked storage, 320px layout, direction buttons, swipe');
} finally {await browser.close();}
