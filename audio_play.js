var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
		update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{

    
    this.load.audio('theme', [
        'assets/audio/voca/04_001~030.mp3'
    ]);

}
var debugTxt;
function create ()
{
    var music = this.sound.add('theme');

    music.play();
	debugTxt = this.add.text(400,40,"");
}
function update (timestep, dt)
{
    debugTxt.setText("sound state is: " + game.sound.context.state);
}