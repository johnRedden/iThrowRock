/*global BasicGame:true,Phaser:true*/
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

    create: function () {        
        this.stage.backgroundColor = '#add8e6'; //blue??
        this.world.setBounds(0,0,window.innerWidth, window.innerHeight);
        
        this.initGameMenu();
        this.toggleMenu();
        
        this.add.text(this.world.centerX-100, this.world.centerY+50, "High Score: "+BasicGame.highScore +"\nHigh Level: "+BasicGame.highLevel, {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#101820"
		});
        this.add.text(this.world.centerX-100, this.world.centerY+100, "Instructions: Break stuff.", {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#000"
		});

        /*
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
        */
   

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

    },
        initGameMenu: function(){ // Game Menu Overlay  **************************************
        		
		this.menuGroup = this.add.group();
       
        this.menuGroup.add(this.add.image(this.world.centerX-100, -250, 'rope'));
        this.menuGroup.add(this.add.image(this.world.centerX+87, -250, 'rope'));
		
		//var menuButton = this.add.button(this.world.width / 1.06,  this.world.centerY / 1.12, "menubutton", this.toggleMenu,this);
		//menuButton.anchor.set(0.5);
        
		var mm = this.add.button(this.world.width / 2, -30, "aboutForward", function () {
			this.state.start('About');
		},this);
		mm.anchor.set(0.5);
		this.menuGroup.add(mm);
        
		var pa = this.add.button(this.world.width / 2, -80, "playagain", function () {
			this.lives = 3;
            BasicGame.score=0;
            BasicGame.level=1;
            this.game.state.start('Game');
            
		}, this);
		pa.anchor.set(0.5);
		this.menuGroup.add(pa);
        var mo = this.add.button(this.world.centerX-50, -140, 'musicToggle',function(btn){
            if(BasicGame.music){
                BasicGame.backgroundMusic.stop();
                btn.frame=1;
                BasicGame.music = false;
            }else{
                BasicGame.backgroundMusic.play();
                btn.frame=0;
                BasicGame.music = true;
            }  
        }, this);
        BasicGame.music?mo.frame=0:mo.frame=1; // init. button
        
        var so = this.add.button(this.world.centerX +50, -140, 'soundfxToggle',function(btn){
            if(BasicGame.sound){
                btn.frame=1;
                BasicGame.sound = false;
            }else{
                btn.frame=0;
                BasicGame.sound = true;
            }             
        }, this);
        BasicGame.sound?so.frame=0:so.frame=1; // init. button
                
        mo.anchor.set(0.5);
        mo.scale.setTo(0.5,0.5);
        so.anchor.set(0.5);
        so.scale.setTo(0.5,0.5);
        this.menuGroup.add(mo);
        this.menuGroup.add(so);
        
        var st =	this.add.text(this.world.centerX, 50, "iThrowRock", {
			fontFamily:	"arial",
			fontSize:	"28px",
            fontStyle: "italic",
			fill:	"#fff"
		});
        st.anchor.set(0.5);
        this.menuGroup.add(st);
        
    },
	toggleMenu: function () {
        
		 if(this.menuGroup.y === 0){
			 this.add.tween(this.menuGroup).to({
				 y: 210     
			 }, 500, Phaser.Easing.Bounce.Out, true);
		 }else{
			this.add.tween(this.menuGroup).to({
				y: 0    
			}, 500, Phaser.Easing.Bounce.Out, true);     
		}
        
	},

};