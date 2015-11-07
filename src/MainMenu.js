
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

    create: function () {
        this.stage.backgroundColor = '#add8e6'; //blue??

        //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
        //var tmpImg1 = this.cache.getImage('preloaderBackground');

        this.playbtn = this.add.button(this.world.centerX + 35, 150, 'playBtn', this.startGame, this);
        
        this.title=	this.add.text(this.world.width/2, this.world.height, "iThrowRock", {
			fontFamily:	"arial",
			fontSize:	"48px",
            fontStyle: "italic",
			fill:	"#fff"
		});
        this.title.anchor.setTo(0.5, 0.5);
        
        this.add.tween(this.title).to({
                 y: 50     
        }, 2000, Phaser.Easing.Bounce.Out, true);
   

    },

    update: function () {

        //	Do some nice funky main menu effect here

    },

    startGame: function (btn) {

        this.game.state.start('Game');

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        //this.music.stop();

    }

};