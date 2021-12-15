
var game;


var gameOptions = {
    //default valuesl
    screenWidth: 800,
    screenHight: 600

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
    var canvas = document.querySelector("canvas");
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
        this.load.image('sky', 'assets/game_bg.jpg');
        this.load.image('ground', 'assets/platform.png');
        //this.load.image('star', 'assets/star.png');
        this.load.image('star', 'assets/a_Captial_small.png');
        this.load.image('bomb', 'assets/bomb.png');
        //this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('dude', 'assets/befly1_2_running.png', { frameWidth: 32, frameHeight: 48 });

      
        
        //this.load.audio("grow", ["assets/sounds/grow.ogg", "assets/sounds/grow.mp3"]);
        this.load.audio("a_sound", ["assets/sounds/a_for_car.wav"]);
    }
    create(){
        this.scene.start("playGame");
    }
}


var player;
var player2;
var stars;
var bombs;
var platforms;
var cursors;
var keys_pressed;
var score = 0;
var gameOver = false;
var scoreText;

class playGame extends Phaser.Scene{
    constructor(){
        super("playGame");
    }

    create (){
            //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 430, 'ground').setScale(0.3).refreshBody();
    platforms.create(50, 250, 'ground').setScale(0.3).refreshBody();
    platforms.create(750, 220, 'ground').setScale(0.3).refreshBody();
    platforms.create(300, 220, 'ground').setScale(0.3).refreshBody();
    platforms.create(400, 320, 'ground').setScale(0.3).refreshBody();
    
    platforms.create(-7, 130, 'ground').setScale(0.3).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 300, 'dude');   
    // The player2 and its settings   
    player2 = this.physics.add.sprite(700, 300, 'dude');

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

    bombs = this.physics.add.group();

    var bomb = bombs.create(10, 16, 'bomb');
    bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        //bomb.allowGravity = false;

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    
    this.physics.add.collider(player, platforms);    
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

  


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    //  Collide the player2 and the stars with the platforms

    this.physics.add.collider(player2, platforms);

    //  Checks to see if the player2 overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player2, stars, collectStar, null, this);
    this.physics.add.collider(player2, bombs, hitBomb, null, this);

    this.physics.add.collider(player, player2);   

    //this.growSound = this.sound.add("grow");
    this.a_sound = this.sound.add("a_sound");

    }
   
    


    update (){

              
        if (gameOver)
        {
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





        /*
        
        this.input.keyboard.on('keydown_A', function (event) {

        // A key down
        console.log("A is down");
        player2.setVelocityX(-160);
    
        player2.anims.play('left', true);
   
        });

        this.input.keyboard.on('keydown_D', function (event) {

            // D key down
            player2.setVelocityX(160);
    
            player2.anims.play('right', true);
       
        });

  */      

    }
}


function collectStar (player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    //this.growSound.play();
    this.a_sound.play();

    if (stars.countActive(true) === 0)
    {
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


function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

