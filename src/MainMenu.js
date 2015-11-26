/*global BasicGame:true,Phaser:true*/
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

    create: function () {        
        this.stage.backgroundColor = '#add8e6'; //blue??

        this.playbtn = this.add.button(this.world.centerX + 35, 100, 'playBtn', this.startGame, this);
        
        //music on...off button
        var tmpImg1 = this.cache.getImage('musicToggle');
        var tmpImg2 = this.cache.getImage('soundfxToggle');
        this.musicBtn = this.add.button(this.world.centerX-50, this.world.height - tmpImg1.height/2.0, 'musicToggle',this.changeMusic, this);
        this.soundBtn = this.add.button(this.world.centerX+50, this.world.height - tmpImg1.height/2.0, 'soundfxToggle',this.changeSound, this);
        this.aboutBtn = this.add.button(this.world.centerX, this.world.centerY+50, 'aboutForward',function(){
            this.game.state.start('About');
        }, this);
        this.musicBtn.scale.setTo(0.5,0.5);
        this.musicBtn.anchor.setTo(0.5,0.5);
        this.soundBtn.scale.setTo(0.5,0.5);
        this.soundBtn.anchor.setTo(0.5,0.5);
        
        // change music global in Boot if wanting music on init.
        this.musicCheck();
        this.soundCheck();
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
        this.highScoreTxt =	this.add.text(this.world.centerX, this.world.centerY, "High Score: "+BasicGame.highScore +"\nHigh Level: "+BasicGame.highLevel, {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#101820"
		});
        
        BasicGame.level = 1;
        BasicGame.score = 0;
   

    },

    update: function () {

        //	Do some nice funky main menu effect here

    },
    
    changeMusic: function(){
        //change logic
        if(BasicGame.music){
            // turn music off
            BasicGame.music = false;
            this.musicCheck();
            
        }else{
            //turn music on
            BasicGame.music = true;
            this.musicCheck();
        }    
    },
    changeSound: function(){
         //change logic
        if(BasicGame.sound){
            // turn sound off
            BasicGame.sound = false;
            this.soundCheck();
            
        }else{
            //turn sound on
            BasicGame.sound = true;
            this.soundCheck();
        }  
    
    },
    musicCheck: function(){
        if(BasicGame.music){
            BasicGame.backgroundMusic.play();
            this.musicBtn.frame=0;
        }else{
            BasicGame.backgroundMusic.stop();
            this.musicBtn.frame=1;
        }  
    },
    soundCheck: function(){
        if(BasicGame.sound){
            this.soundBtn.frame=0;
        }else{
            this.soundBtn.frame=1;
        }  
    },

    startGame: function (btn) {

        this.game.state.start('Game');

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        //this.music.stop();

    }

};