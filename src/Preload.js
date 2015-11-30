
BasicGame.Preloader = function (game) {


};

BasicGame.Preloader.prototype = {

    preload: function () {

        //	These are the assets we loaded in Boot.js
        //	A nice sparkly background and a loading progress bar
        //var tmpImg1 = this.cache.getImage('preloaderBackground');
        //this.add.sprite(this.world.centerX - tmpImg1.width / 2.0, 20, 'preloaderBackground');
        
                // title
        this.title=	this.add.text(20, 20, "iThrowRock - \nNeed a SplashScreen \nLoading...", {
			fontFamily:	"arial",
			fontSize:	"24px",
            fontStyle: "italic",
			fill:	"#bfbfdf"
		});

        this.preloadBar = this.add.sprite(50, 170, 'preloaderBar');

        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

        //	Here we load the rest of the assets our game needs.
        this.load.image('rock', 'asset/a_0.png');
        this.load.spritesheet("deathrock", "asset/rock_death.png", 90, 79, 2);
        this.load.image('shard01', 'asset/bottle_shard_base.png');
        this.load.image('shard02', 'asset/bottle_shard_middle.png');
        this.load.image('shard03', 'asset/bottle_shard_top.png');
        this.load.image('shard04', 'asset/bottle_shard_triangle.png');
  
        //this.load.image('bottle', 'asset/bottle1.png');
        this.load.spritesheet('bottleSht', 'asset/green_sheet.png', 112.5, 169, 6);
        this.load.spritesheet('molotovSht','asset/molotov_burn.png',160,268,3);
        this.load.spritesheet('darkBottleSht','asset/dark_spritesheet.png',160,210,4);
        this.load.spritesheet('firepuff','asset/fireball_spritesheet.png',264,179,14);
        this.load.spritesheet('livesSht','asset/death_score.png',160,173,2);

        this.load.audio('breakBottle', ['asset/bottleBreak2.wav']);
        this.load.audio('explodeBottle', ['asset/explode.wav']);
        this.load.audio('rockHit', ['asset/rockHit.wav']);
        this.load.audio('gameMusic', ['asset/pentagram_rage.ogg']);
        //this.load.audio('gameMusic', ['asset/pentagram_rage.ogg', 'asset/pentagram_rage.mp3']);

        //menu stuff
        this.load.image("rope", "asset/menu/rope.png");
        this.load.image("menubutton", "asset/menu/menubutton.png");
        this.load.image("mainmenu", "asset/menu/main_menu.png");
        this.load.image("playagain", "asset/menu/play_again.png");
        this.load.image("aboutForward", "asset/menu/about_forward.png");
        this.load.image("aboutBack", "asset/menu/about_back.png");
        this.load.image("bottleTypes", "asset/menu/random_power_spritesheet.png");
        this.load.image("cory", "asset/menu/cory.png");
        this.load.image("paul", "asset/menu/paul.png");
        this.load.image("john", "asset/menu/john01.png");
        
        this.load.spritesheet('musicToggle', 'asset/music_status_new.png',210,160,2);
        this.load.spritesheet('soundfxToggle','asset/fx_status.png',210,160,2);
        this.load.spritesheet('woodBlocker', 'asset/wood_spritesheet.png',110,77,5);
        this.load.spritesheet("goldenBottle", "asset/bottle_glow.png", 160, 160, 6);  

    },

    create: function () {

        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        //this.preloadBar.cropEnabled = false;

    },

    update: function () {
        
        this.game.add.tween(this.world).to({
				alpha:	0
			}, 1800, Phaser.Easing.Linear.In).start().onComplete.add(function(){
               this.game.state.start('MainMenu');
            }, this);
       
       //  This slows down the startup alot
		if (this.cache.isSoundDecoded('gameMusic'))
		{
            BasicGame.backgroundMusic = this.add.audio('gameMusic');
            BasicGame.backgroundMusic.volume = 0.3;
            BasicGame.backgroundMusic.loop = true;
            //BasicGame.backgroundMusic.stop();
			//this.ready = true;
			this.state.start('MainMenu');
		}
         
        

    }

};