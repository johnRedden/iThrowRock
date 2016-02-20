/* jshint browser:true */
/* global BasicGame:true,Phaser:true*/
// create BasicGame Class
BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,
    level: 1,
    numGreenBottles:5,
    numWoodBlockers:3,
    highScore: 0,
    highLevel: 0,
    music: false, //start with no music
    sound: true,
    backgroundMusic: null,
    
    breakSpeedGreenBottle: 400,
    breakSpeedDarkBottle: 600,
    breakSpeedMolotov: 800,
    version: "Beta 0.9.6"

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    //orientated: false,

};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.stage.backgroundColor = '#fff';//2892dc';

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(false, true);
        


        if (this.game.device.desktop) {
            //this.scale.setMinMax(480, 260, 1024, 768);
           
        }
        else {
            // mobile settings here

        }

    },

    preload: function () {

        //  Here we load the assets required for our preloader (just the loading bar for now)
        this.load.image('preloaderBar', 'asset/preloader-bar2.png');
        this.load.image('splash', 'asset/menu/splash01.png');

    },

    create: function () {

        this.state.start('Preload');

    },

    gameResized: function (width, height) {

        //  This could be handy if you need to do any extra processing if the game resizes.
        //  A resize could happen if for example swapping orientation on a device or resizing the browser window.
        //  Note that this callback is only really useful if you use a ScaleMode of RESIZE and place it inside your main game state.

    },

    enterIncorrectOrientation: function () {

        BasicGame.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BasicGame.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};
