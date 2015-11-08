
BasicGame.Preloader = function (game) {


};

BasicGame.Preloader.prototype = {

    preload: function () {

        //	These are the assets we loaded in Boot.js
        //	A nice sparkly background and a loading progress bar
        //var tmpImg1 = this.cache.getImage('preloaderBackground');
        //this.add.sprite(this.world.centerX - tmpImg1.width / 2.0, 20, 'preloaderBackground');

        this.preloadBar = this.add.sprite(50, 170, 'preloaderBar');

        //	This sets the preloadBar sprite as a loader sprite.
        //	What that does is automatically crop the sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

        //	Here we load the rest of the assets our game needs.
        this.load.image('rock', 'asset/a_0.png');
  
        this.load.image('bottle', 'asset/bottle1.png');
        this.load.spritesheet('bottleSht', 'asset/green_sheet.png', 112.5, 169, 6);
        this.load.spritesheet('firepuff','asset/fireball_spritesheet.png',264,179,14);

        this.load.audio('breakBottle', ['asset/bottleBreak2.wav']);
        this.load.audio('rockHit', ['asset/rockHit.wav']);

        //menu stuff
        this.load.image("menubutton", "asset/menu/menubutton.png");
        this.load.image("resetgame", "asset/menu/resetgame.png");
        this.load.image("thankyou", "asset/menu/thankyou.png");
        this.load.image("playBtn", "asset/menu/playbutton.png");
        

    },

    create: function () {

        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        //this.preloadBar.cropEnabled = false;

    },

    update: function () {

        //Todo: pause a bit

        this.state.start('MainMenu');

        /*
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			//this.state.start('MainMenu');
		}
        */

    }

};