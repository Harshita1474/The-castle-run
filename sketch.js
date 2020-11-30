var backgroundImage;
var player;
var player_running;
var player_standing;
var ground,groundImage;
var obstacle1,obstacle1Img;
var invisibleGround;
var obstaclesGroup;
var PLAY=1;
var END=0;
var gameState=PLAY;
var score=0;
var backGround;
var jumpSound, pointsEarnedSound,gameOverSound;

function preload() {
  backgroundImage=loadImage("background.jpg");
  player_running=loadAnimation("images/player1.png","images/player2.png","images/player3.png","images/player4.png","images/player5.png"
  ,"images/player6.png","images/player7.png","images/player8.png","images/player9.png","images/player10.png","images/player11.png",
  "images/player12.png");
  player_standing=loadAnimation("images/player.png");
  groundImage=loadImage("images/ground.jpg");
  obstacle1Img=loadImage("images/cactus.png");

  jumpSound=loadSound("sounds/jump.mp3");
  pointsEarnedSound=loadSound("sounds/When_earned_points.mp3");
  gameOverSound=loadSound("sounds/gameOver.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  backGround=createSprite(width/2,height/2,800,400);
  backGround.addImage(backgroundImage);

  ground=createSprite(width/2,height+50,800,100);
  ground.addImage(groundImage);
  ground.scale=0.7;
  
  //ground.x=ground.width/2;

  invisibleGround=createSprite(width/2,height-90,width,20);
  invisibleGround.visible=false;

  player=createSprite(width/2, height-200, 50, 50);
  player.addAnimation("running",player_running);
  player.addAnimation("standing",player_standing);
  player.x=100;
  player.scale=1.25;
  player.debug=false;
  player.setCollider("circle",0,30,30);

  obstaclesGroup= new Group();

  //obstacle1=createSprite()
}

function draw() {
  
  background(0)
  drawSprites();
  

  if(gameState===PLAY){
    ground.velocityX=-5;

    score=score + Math.round(getFrameRate()/25);

    if(score>0 && score%250===0){
      pointsEarnedSound.play();
    }

    //create a infinity ground
    if(ground.x<200){
      ground.x = 400;
    }

    //move the player
    if(keyDown("RIGHT_ARROW")){
      player.x=player.x+10;
    }
    //if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-120) {
    if((touches.length > 0 || keyDown("space"))&& player.y>height/2){
      player.velocityY=-10;
      jumpSound.play();
      touches=[];
    }

    player.velocityY=player.velocityY+0.8;

    spawnObstacles();

    if(player.isTouching(obstaclesGroup)){
      gameState=END;
      gameOverSound.play();
    }

  }else if(gameState===END){
    
    textSize(50);
    fill(255)
    text("Game Over",width/2-100,height/2);
    textSize(30);
    text("Well Played",width/2-50,height/2+50)
    text("Press R to restart",width/2-80,height/2+90)
    ground.velocityX=0;
    player.velocityY=0
    player.changeAnimation("standing",player_standing);
    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);

    if(keyDown("R")&&gameState===END){
      gameState=PLAY;
      score=0;
      obstaclesGroup.destroyEach();
      player.changeAnimation("running",player_running);
    }

    if(touches.length>0 || keyDown("SPACE")) {  
      touches = [] 
    }

  }

  

  player.collide(invisibleGround);

  
  
  
  textSize(30);
  fill("white")
  text("Score: "+score ,width-200,50);
  
}

function spawnObstacles(){
  if(frameCount % 200===0){
    obstacle1=createSprite(width,height-140,50,50);
    obstacle1.addImage(obstacle1Img);
    obstacle1.scale=0.125;
    //game adaptivity
    obstacle1.velocityX=-(5+score/50);
    obstacle1.lifetime=350;

    obstaclesGroup.add(obstacle1);
  }
  
}