
BasicGame.MainMenu = function (game) {

};

BasicGame.MainMenu.prototype = {

    create: function () {

        //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
        //var tmpImg1 = this.cache.getImage('preloaderBackground');

        this.playbtn = this.add.button(this.world.centerX + 35, 150, 'bottle', this.startGame, this);
   

    },

    update: function () {

        //	Do some nice funky main menu effect here

    },

    startGame: function (btn) {

        this.game.state.start('Game');

        //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        //this.music.stop();

    }

};