/*global BasicGame:true,Phaser:true*/
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

    create: function () {   
        this.stage.backgroundColor = '#add8e6'; //blue??
        this.world.setBounds(0,0,window.innerWidth, window.innerHeight);
        this.world.alpha = 1;
        
        //HTML5 localStorage zero if empty
            if(typeof(Storage) !== "undefined") {
                BasicGame.highScore = localStorage.getItem("highScore")?localStorage.getItem("highScore"):0;
                BasicGame.highLevel = localStorage.getItem("highLevel")?localStorage.getItem("highLevel"):0;
            } else {
                // Sorry! No Web Storage support..
                BasicGame.highScore = 0;
                BasicGame.highLevel = 0;
            }
        //*****************
        
        this.initGameMenu();
        
        this.add.text(this.world.centerX-100, this.world.centerY+50, "High Score: "+BasicGame.highScore +"\nHigh Level: "+BasicGame.highLevel, {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#101820"
		});
        this.add.text(this.world.centerX-100, this.world.centerY+120, "Throw rock - break stuff.", {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#fff"
		});
   
    },

    update: function () {

        //	Do some nice funky main menu effect here

    },
    

    startGame: function (btn) {

        this.game.state.start('Game');

    },
    
    initGameMenu: function(){ // Game Menu Overlay  **************************************
        		
		var mnuGrp = this.add.group();
       
        mnuGrp.add(this.add.image(this.world.centerX-100, -250, 'rope'));
        mnuGrp.add(this.add.image(this.world.centerX+87, -250, 'rope'));
        
		var mm = this.add.button(this.world.width / 2, -30, "aboutForward", function () {
			this.state.start('About');
		},this);
		mm.anchor.set(0.5);
		mnuGrp.add(mm);
        
		var pa = this.add.button(this.world.width / 2, -80, "play1", function () {
			this.lives = 3;
            BasicGame.score=0;
            BasicGame.level=1;
            //fade into new state
            this.game.add.tween(this.world).to({
				alpha:	0
			}, 1500, Phaser.Easing.Linear.In).start().onComplete.add(function(){
               this.game.state.start('Game');
            }, this);
            
		}, this);
		pa.anchor.set(0.5);
		mnuGrp.add(pa);
        
        var mo = this.add.button(this.world.centerX-50, -140, 'musicToggle',function(arg){
            if(BasicGame.music){
                arg.frame=1;
                BasicGame.backgroundMusic.stop();
                BasicGame.music = false;
            }else{
                arg.frame=0;
                BasicGame.backgroundMusic.play();
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
        mnuGrp.add(mo);
        mnuGrp.add(so);
        
        var st =	this.add.text(this.world.centerX, 50, "iThrowRock\n", {
			fontFamily:	"arial",
			fontSize:	"28px",
            fontStyle: "italic",
			fill:	"#fff",
            align: "center"
		});
        st.anchor.set(0.5);
        mnuGrp.add(st);
        var ver =	this.add.text(this.world.centerX, 60, "Version: "+BasicGame.version, {
			fontFamily:	"arial",
			fontSize:	"14px",
            fontStyle: "italic",
			fill:	"#fff",
            align: "center"
		});
        ver.anchor.set(0.5);
        mnuGrp.add(ver);
        
        this.add.tween(mnuGrp).to({
				 y: 210     
        }, 500, Phaser.Easing.Bounce.Out, true);
        
    }

};