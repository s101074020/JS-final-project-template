var FPS= 60;
var clock = 0;
var HP = 100;
var score =0;
var money =60000;
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var btnImg = document.createElement("img");
var towerImg = document.createElement("img");
var crosshairlmg = document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/slime.gif";
btnImg.src = "images/tower-btn.png";
towerImg.src = "images/tower.png";
crosshairlmg.src = "images/crosshair.png";
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("ppap");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
    clock++;
    if((clock%80)==0){
        var newEnemy = new Enemy();
        enemies.push(newEnemy);
    }
  	// 將背景圖片畫在 canvas 上的 (0,0) 位置
    ctx.drawImage(bgImg,0,0);
    for(var i = 0; i < enemies.length; i++){
        if (enemies[i].HP <= 0){
             enemies.splice(i, 1);
             score += 900;
             money += 1000;
        }else{
        enemies[i].move();
        ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y);
        }
    }
    
    ctx.drawImage(btnImg,640-64,480-64,64,64);
    if(isBuilding == true){
      ctx.drawImage(towerImg,cursor.x-cursor.x%32,cursor.y-cursor.y%32);
    }
    
      for(var i =0; i < towers.length; i++){
        ctx.drawImage(towerImg,towers[i].x,towers[i].y);
        towers[i].searchEnemy();
    if(towers[i].aimingEnemyID != null){
       var ID = towers[i].aimingEnemyID;
       ctx.drawImage(crosshairlmg, enemies[ID].x,
       enemies[ID].y);
    }
      }
    
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("HP:  " + HP, 32, 32);
    ctx.fillText("Score:  " + score, 10, 64);
    ctx.fillText("Money:  " + money, 10, 96);
    if(HP < 100) {
        clearInter
    }


}

// 執行 draw 函式
setInterval(draw, 1000/FPS);

var enemyPath = [
    {x: 96, y: 64},
    {x: 384, y: 64},
    {x: 384, y: 192},
    {x: 224, y: 192},
    {x: 224, y: 320},
    {x: 544, y: 320},
    {x: 544, y: 96}
];

 function Enemy(){
 	 this.x= 96;
 	 this.y= 480 -32;
   this.HP = 10;
 	 this.speedX= 0;
 	 this.speedY= -64;
 	 this.pathDes= 0;
   this.move= function(){
       if (isCOllided(enemyPath[this.pathDes].x,
              enemyPath[this.pathDes].y,
                      this.x,
                      this.y,
                      64/FPS,
                      64/FPS)){
            // 移動
           	this.x = enemyPath[this.pathDes].x;
            this.y = enemyPath[this.pathDes].y;
            // 指定
            this.pathDes++;
            if(this.pathDes == enemyPath.length){
                this.HP = 0;
                HP -= 10;
                return;
            }
            // 計算, 修改
            if ( enemyPath[this.pathDes].y < this.y){
                 // 往上走
                 this.speedX = 0;
                 this.speedY = -64;
            } else if( enemyPath[this.pathDes].x > this.x){
                 this.speedX = 64;
                 this.speedY = 0;
            } else if( enemyPath[this.pathDes].y > this.y){
                 this.speedX = 0;
                 this.speedY = 64;
            } else if( enemyPath[this.pathDes].x < this.x){
                 this.speedX = -64;
                 this.speedY = 0;
            }


        }else{

           	   this.x += this.speedX/FPS;
 	 	           this.y += this.speedY/FPS;

           }
	    }
 }
var enemies = [];


 var cursor ={
 	 x: 100,
 	 y: 200
 }


$("#ppap").on("mousemove", cursorMove);

function cursorMove(event){
   cursor.x = event.offsetX - event.offsetX%32;
   cursor.y = event.offsetY - event.offsetY%32;
}

var isBuilding = false;
 function Tower () {
     this.shoot =function(ID){
         ctx.beginPath();
         ctx.moveTo(this.x, this.y);
         ctx.lineTo(enemies[ID].x, enemies[ID].y);
         ctx.strokeStyle = 'red';
         ctx.lineWidth = 3;
         ctx.stroke();
         enemies[ID].HP -= this.damage;
     };
     this.fireRate=1;
     this.readyToShootTime=0.8;
     this.damage=3;
    this.x = 0;
    this.y = 0;
    this.range = 100;
    this.aimingEnemyID = null;
    this.searchEnemy = function(){
        this.readyToShootTime -=1,FPS
        for(var i=0; i<enemies.length; i++){
            var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
            if (distance<=this.range) {
                this.aimingEnemyID = i;
                if (this.readyToShootTime <= 0) {
                    this.shoot(i);
                    this.readyToShootTime =this.fireRate;
                }
        return;
            }
        }
          // 如果都沒找到，會進到這行，清除鎖定的目標
          this.aimingEnemyID = null;
      }

}
var towers = [];

$("#ppap").on("click", cursorClick)

function cursorClick(event){
   if (event.offsetX>576 && event.offsetY>416) { 
        isBuilding = true;
    } else{
         //建造塔
    	 if(isBuilding == true){
        if (money > 10) {
             money -= 10;
         var newTower = new Tower();
    	 	 newTower.x = cursor.x - cursor.x%32;
    	 	 newTower.y = cursor.y - cursor.y%32;
         towers.push(newTower)
    	  }
    }
    	 //建造完成
    	 isBuilding = false;
    }
}

 function isCOllided(pointX, pointY, targetX, targetY, targetWidth, targetHeight){
     //如果在框框裡面
     if(targetX <= pointX &&
     	           pointX <= targetX + targetWidth &&
     	  targetY <= pointY &&
     	           pointY <= targetY + targetHeight){
         return true;
      }else{
         return false;
      }
}