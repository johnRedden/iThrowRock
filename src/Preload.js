
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
        //this.load.image('molotov', 'asset/molotov_1.png');
        //this.load.image('darkBottle', 'asset/dark_bottle.png');
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
        this.load.image("menubutton", "asset/menu/menubutton.png");
        this.load.image("resetgame", "asset/menu/resetgame.png");
        this.load.image("thankyou", "asset/menu/thankyou.png");
        this.load.image("playBtn", "asset/menu/playbutton.png");
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
       
       //the following code does not work in the emulator.
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