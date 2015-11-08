/*global BasicGame:true,Phaser:true*/
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

    create: function () {
        this.stage.backgroundColor = '#add8e6'; //blue??

        this.playbtn = this.add.button(this.world.centerX + 35, 150, 'playBtn', this.startGame, this);
        
        //music on...off button
        var tmpImg1 = this.cache.getImage('musicToggle');
        this.musicBtn = this.add.button(this.world.centerX, this.world.height - tmpImg1.height/2.0, 'musicToggle',this.changeMusic, this);
        this.musicBtn.scale.setTo(0.5,0.5);
        this.musicBtn.anchor.setTo(0.5,0.5);
        //***********************
        
        // title
        this.title=	this.add.text(this.world.centerX, this.world.height, "iThrowRock", {
			fontFamily:	"arial",
			fontSize:	"48px",
            fontStyle: "italic",
			fill:	"#fff"
		});
        this.title.anchor.setTo(0.5, 0.5);
        
        this.add.tween(this.title).to({
                 y: 50     
        }, 2000, Phaser.Easing.Bounce.Out, true);
        //****************************
        this.highScoreTxt =	this.add.text(10, this.world.height-20, "High Score: "+BasicGame.highScore +" Level: "+BasicGame.highLevel, {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#101820"
		});
   

    },

    update: function () {

        //	Do some nice funky main menu effect here

    },
    
    changeMusic: function(){
        if(this.musicBtn.frame===0){
            this.musicBtn.frame=1;
            // turn music off
        }else{
            this.musicBtn.frame=0;
            //turn music on
        }
    
    },

    startGame: function (btn) {

        this.game.state.start('Game');

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        //this.music.stop();

    }

};