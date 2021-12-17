var game;

var player;
var player2;
var stars;
var stars2;
var bombs;
var platforms;
var cursors;
var keys_pressed;
var score = 0;
var score_player2 = 0;
var gameOver = false;
var scoreText;
var scoreText_player2;
var stage_name;

var fx;
var scream;

var button;

var stage = 1;

var enamel_paint_sound;
var animal_paint_sound;



var gameOptions = {
    
    screenWidth: window.innerWidth,
    screenHight: window.innerHeight


}


window.onload = function() {
    var gameConfig = {
        width: gameOptions.screenWidth,        
        height: gameOptions.screenHight,
        
        backgroundColor: 0xecf0f1,
        type: Phaser.AUTO,
        
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },



        scene: [bootGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
   
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
    
}

function resizeGame(){
    canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;


    var windowRatio = windowWidth / windowHeight;

    //gameOptions.screenWidth = windowWidth;
    //gameOptions.screenWidth = windowHeight;

    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }

    
}


class bootGame extends Phaser.Scene{
    constructor(){
        super("bootGame");
    }
    preload(){
        //this.load.image('sky', 'assets/sky.png');
        //this.load.image('sky', 'assets/befly_game_bg.png');
        //this.load.image('sky', 'assets/game_bg.jpg');
        //
        this.load.image('bg_img', 'assets/img/bg_img/game_bg.jpg');
        this.load.image('ground', 'assets/platform.png');
        //this.load.image('star', 'assets/star.png');
        //this.load.image('star', 'assets/a_Captial_small.png');
        
        this.load.image('star', 'assets/img/enamel_paint_35_42.png');

        this.load.image('star2', 'assets/img/animal_paint_35_35.png');

        this.load.image('bomb', 'assets/bomb.png');
        //this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('dude', 'assets/befly1_2_running.png', { frameWidth: 32, frameHeight: 48 });

        

        
        

        
        this.load.audio('enamel_paint',[
            'assets/sounds/enamel_paint.mp3'
        ]);

        this.load.audio('animal_paint',[
            'assets/sounds/animal_paint.mp3'
        ]);

    

        this.load.audio('theme', [
            'assets/audio/BG/arcade-game-simple-background-music.mp3'
        ]);

        this.load.audio('scream',[
            'assets/audio/SoundEffects/woman-scream.mp3'
        ]);

    }
    create(){
        this.scene.start("playGame");

        var music = this.sound.add('theme', {volume: 0.4});
        
        console.log("TEST First window.innerWidth=", window.innerWidth);


        music.play();
        //music.play('volume', {volume: 0.5});
    }
}



class playGame extends Phaser.Scene{
    constructor(){
        super("playGame");
    }

    create (){

    

    //A simple background for our game
    this.add.image(533.5, 300, 'bg_img');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(533, 600, 'ground').setScale(4).refreshBody();

    //platforms.create(gameOptions.screenWidth, gameOptions.screenHight, 'ground').setScale(4).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 430, 'ground').setScale(0.3).refreshBody();
    platforms.create(50, 250, 'ground').setScale(0.3).refreshBody();
    platforms.create(750, 220, 'ground').setScale(0.3).refreshBody();
    platforms.create(300, 220, 'ground').setScale(0.3).refreshBody();
    platforms.create(400, 320, 'ground').setScale(0.3).refreshBody();
    platforms.create(950, 200, 'ground').setScale(0.3).refreshBody();
    
    platforms.create(-7, 130, 'ground').setScale(0.3).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(900, 300, 'dude');

    // The player2 and its settings   
    player2 = this.physics.add.sprite(100, 300, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

        
    //  Player2 physics properties. Give the little guy a slight bounce.
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);


    // The player2 and its W.A.S.D Keys settings
    this.keys_pressed = this.input.keyboard.addKeys("W,A,S,D");





    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Our player2 animations, turning, walking left and walking right.
    this.anims.create({
        key: 'a',
        frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 12 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn2',
        frames: [ { key: 'dude', frame: 13 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'd',
        frames: this.anims.generateFrameNumbers('dude', { start: 14, end: 17 }),
        frameRate: 10,
        repeat: -1
    });


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();


    //this.keys_pressed = this.input.keyboard.on(); 

    this.input.keyboard.on('keydown_A', function (event) {

       console.log("A is pressed");
       keys_pressed = "a";
   
    });

    this.input.keyboard.on('keydown_D', function (event) {

        console.log("D is pressed");
        keys_pressed = "d";
   
    });

    this.input.keyboard.on('keydown_W', function (event) {

        console.log("W is pressed");
        keys_pressed = "w";
    
     });

     this.input.keyboard.on('keydown_S', function (event) {

        console.log("S is pressed");
        keys_pressed = "s";
    
     });

    //console.log(keys_pressed);

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        //child.setBounceS(Phaser.Math.FloatBetween(0.4, 0.8));
         
    });



    stars2 = this.physics.add.group({
        key: 'star2',
        repeat: 11,
        setXY: { x: 110, y: 0, stepX: 80 }
    });


    stars2.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        //child.setBounceS(Phaser.Math.FloatBetween(0.4, 0.8));
         
    });


    bombs = this.physics.add.group();

    var bomb = bombs.create(10, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    //bomb.allowGravity = false;

    //  The score
    scoreText = this.add.text(gameOptions.screenWidth - 400, 16, 'P1 score: 0', { fontSize: '20px', fill: '#01020E' });

    //  The score for Player 2
    scoreText_player2 = this.add.text(gameOptions.screenWidth - 200, 16, 'P2 score: 0', { fontSize: '20px', fill: '#F91308' });

    // stage name
    stage_name = this.add.text(20,10, 'Stage : 01', {fontSize: '25px', fill:'#01020E' });



    //  Collide the player and the stars with the platforms
    this.physics.add.collider(stars, stars2);    
    
    this.physics.add.collider(stars, platforms);
    
    this.physics.add.collider(stars2, platforms);    
    this.physics.add.collider(bombs, platforms);

    // [Player1 과 Player2 가 부딪힘]
    this.physics.add.collider(player, player2);


  
    //[Palyer 1]

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function

    this.physics.add.collider(player, platforms); 
    
        this.physics.add.overlap(player, stars, collectStar, null, this);

        // player1 star2 *****************************************************
        this.physics.add.overlap(player, stars2, collectStar2, null, this);
    
            this.physics.add.collider(player, bombs, hitBomb, null, this);

             


    //[Palyer 2]

    //  Collide the player2 and the stars with the platforms
    this.physics.add.collider(player2, platforms);

        //  Checks to see if the player2 overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player2, stars, collectStar_player2, null, this);
    
            // player 2 star2 *****************************************************
            this.physics.add.overlap(player2, stars2, collectStar2_player2, null, this);
   
                this.physics.add.collider(player2, bombs, hitBomb_player2, null, this);

    

    

    this.enamel_paint_sound = this.sound.add("enamel_paint");
    this.animal_paint_sound = this.sound.add("animal_paint");


    this.scream = this.sound.add("scream");

    

    //	Here we set-up our audio sprite
	//this.fx = this.add.audio('sfx');
    //this.fx.allowMultiple = true;


    this.fx = this.sound.add("sfx");
    this.fx.allowMultiple = true;

    //	And this defines the markers.

	//	They consist of a key (for replaying), the time the sound starts and the duration, both given in seconds.
	//	You can also set the volume and loop state, although we don't use them in this example (see the docs)

	this.fx.addMarker('alien death', 1, 1.0);
	this.fx.addMarker('boss hit', 3, 0.5);
	this.fx.addMarker('escape', 4, 3.2);
	this.fx.addMarker('meow', 8, 0.5);
	this.fx.addMarker('numkey', 9, 0.1);
	this.fx.addMarker('ping', 10, 1.0);
	this.fx.addMarker('death', 12, 4.2);
	this.fx.addMarker('shot', 17, 1.0);
	this.fx.addMarker('squit', 19, 0.3);


    /*
	//	Make some buttons to trigger the sounds
	makeButton('alien death', 600, 100);
	makeButton('boss hit', 600, 140);
	makeButton('escape', 600, 180);
	makeButton('meow', 600, 220);
	makeButton('numkey', 600, 260);
	makeButton('ping', 600, 300);
	makeButton('death', 600, 340);
	makeButton('shot', 600, 380);
	makeButton('squit', 600, 420);

    */
}
   
    


    update (){

              
        if (gameOver)
        {
            
            // 게임이 끝나면 모든 사운드 재생을 멈춤
            game.sound.stopAll();
            

            
            return;
        }
    
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
    
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
    
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
    
            player.anims.play('turn');
        }
    
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }


        // Player 2 용 커서 

        if (keys_pressed == 'a')
        {
            player2.setVelocityX(-160);
    
            player2.anims.play('a', true);
        }
        else if (keys_pressed == 'd')
        {
            player2.setVelocityX(160);
    
            player2.anims.play('d', true);
        }
        else
        {
            player2.setVelocityX(0);
    
            player2.anims.play('turn2');
        }
    
        if (keys_pressed == 'w' && player2.body.touching.down)
        {
            player2.setVelocityY(-330);
        }


        

   

    }
}


// collectStar for player 1
function collectStar (player, star) {
    
    console.log("play1 meets star1");
    
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('P1 Score: ' + score);

    this.enamel_paint_sound.play();
    //this.scream.play();
        

    if (stars.countActive(true) === 0)
    {
        
        stage += 1;
        // stage name
        
        stage_name.setText('Stage : ' + stage);

        
        
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}


// collectStar for player 2
function collectStar_player2 (player, star) {

    console.log("play2 meets star1");


    star.disableBody(true, true);

    //  Add and update the score
    score_player2 += 10;
    scoreText_player2.setText('P2 score: ' + score_player2);

    this.enamel_paint_sound.play();
    
    

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (score_player2.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}


// collectStar2 for player 1 
function collectStar2 (player, star) {

    console.log("play1 meets star2");
    star.disableBody(true, true);

    this.animal_paint_sound.play();
}

// collectStar2 for player 2 
function collectStar2_player2 (player, star) {

    console.log("play2 meets star2");

    star.disableBody(true, true);
    this.animal_paint_sound.play();
}









function hitBomb (player, bomb)
{
    
   

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');
   
   
    this.scream.play();



    setTimeout(function() {gameOver = true;}, 2000);

}


function hitBomb_player2 (player2, bomb)
{
    
   

    this.physics.pause();

    player2.setTint(0xff0000);

    player2.anims.play('turn');
   
    this.scream.play();

    setTimeout(function() {gameOver = true;}, 2000);
    
    
}
