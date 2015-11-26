/*global BasicGame:true,Phaser:true*/
BasicGame.About = function (game) {

};

BasicGame.About.prototype = {

    create: function () {        
        this.stage.backgroundColor = '#add8e6'; //blue??
        
        // title
        this.title=	this.add.text(this.world.centerX, this.world.height, "About\niThrowRock", {
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
        
        this.backBtn = this.add.button(this.world.centerX, 125, 'aboutBack',function(){
            this.game.state.start('MainMenu');
        }, this);
        
        //  Text here ... may need scrolling if too big.
        
        this.text1 = "This is where we have our bios. \nHowever, we are all so dang ugly!";
        
        this.add.text(10, 200, this.text1, {
			fontFamily:	"arial",
			fontSize:	"14px",
		});
        this.add.sprite(this.world.centerX, 300, 'cory');

    },

    update: function () {

        //	Do some nice funky main menu effect here

    },
    

    back: function (btn) {

        this.game.state.start('MainMenu');


    }

};