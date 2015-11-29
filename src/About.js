/*global BasicGame:true,Phaser:true*/
BasicGame.About = function (game) {

};

BasicGame.About.prototype = {

    create: function () {   
        //awesome plugin I found...
        this.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
        this.kineticScrolling.configure({
            kineticMovement: true,
            timeConstantScroll: 325, //really mimic iOS
            horizontalScroll: false,
            verticalScroll: true,
            horizontalWheel: false,
            verticalWheel: true,
            deltaWheel: 40
        });
        this.kineticScrolling.start();
        //*********************** works like magik
        
        this.wth = this.world.width;
        this.lth = this.world.length;

        this.stage.backgroundColor = '#add8e6'; //blue??
        this.world.setBounds(0,0,this.wth,3000);
        
        this.initGameMenu();
        this.toggleMenu();
        
        
        /*
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
        
        */
        
        this.backBtn = this.add.button(this.world.centerX, 300, 'aboutBack',function(){
            this.game.state.start('MainMenu');
        }, this);
        
        //  Text here ... may need scrolling if too big.
        
        this.text1 = "This is where we have our bios and INSTRUCTIONS. \nHowever, we are all so dang ugly!";
        
        this.add.text(10, 200, this.text1, {
			fontFamily:	"arial",
			fontSize:	"14px",
		});
        
        this.add.sprite(this.world.centerX, 300, 'cory');
        this.add.sprite(this.world.centerX, 500, 'paul');

    },

    update: function () {

        //	Do some nice funky main menu effect here

    },
    

    back: function (btn) {

        this.game.state.start('MainMenu');


    },
    initGameMenu: function(){ // Game Menu Overlay  **************************************
        		
		this.menuGroup = this.add.group();
       
        this.menuGroup.add(this.add.image(this.world.centerX-100, -250, 'rope'));
        this.menuGroup.add(this.add.image(this.world.centerX+87, -250, 'rope'));
		
        
		var mm = this.add.button(this.world.width / 2, -30, "mainmenu", function () {
			this.state.start('MainMenu');
		},this);
		mm.anchor.set(0.5);
		this.menuGroup.add(mm);
        
		var pa = this.add.button(this.world.width / 2, -80, "playagain", function () {
			this.lives = 3;
            BasicGame.score=0;
            BasicGame.level=1;
            //fade into new state
            this.game.add.tween(this.world).to({
				alpha:	0
			}, 1500, Phaser.Easing.Linear.In).start().onComplete.add(function(){
               //this.game.state.start('Game');
                this.world.alpha = 1;
            }, this);
            
		}, this);
		pa.anchor.set(0.5);
		this.menuGroup.add(pa);
        

        
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