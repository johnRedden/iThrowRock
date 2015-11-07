/* jshint browser:true */
/* global Phaser, BasicGame */
// create Game function in BasicGame
BasicGame.Game = function (game) {

};
// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {

        this.stage.backgroundColor = '#bfbfdf';
		
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.restitution = 0.2; //this gives bounce
		this.physics.p2.gravity.y = 500;
		
		//draw the board
		var graphics = this.add.graphics(0, 0);
		graphics.beginFill(0xc0c0c0,0);
		graphics.lineStyle(2, 0xc0c0c0, 0.5);
		this.boundaryLine = this.world.height/2;
		graphics.moveTo(0, this.boundaryLine);
		graphics.lineTo(this.world.width, this.boundaryLine); 
		
		//new
		// collision groups http://phaser.io/examples/v2/p2-physics/collision-groups
		this.physics.p2.setImpactEvents(true);
		//  Create our collision groups. One for the rocks, one for the bottles
		this.rockCollisionGroup = this.physics.p2.createCollisionGroup();
		this.bottleCollisionGroup = this.physics.p2.createCollisionGroup();
		this.emptyCollisionGroup = this.physics.p2.createCollisionGroup();
		this.menuCollisionGroup = this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();


		
	},

	preload: function () {

   
	},

	create: function () {
		// Add logo to the center of the stage
		this.rock = this.add.sprite(this.world.centerX, this.world.centerY, 'rock');
		this.rock.anchor.setTo(0.5, 0.5);
		this.rock.scale.setTo(0.06,0.06);
		
		// turn false the collision circle in production
		this.physics.p2.enable(this.rock, false); //change to true to see hitcircle
		this.rock.body.setRectangle(25,20);
		this.rock.body.collideWorldBounds = true;
		this.rock.body.velocity.x = 20;
		this.rock.body.velocity.y = 150;
		this.rock.body.angularDamping = 0.5;


		
		
		//new set collision group and tell what to collide with
		this.rock.body.setCollisionGroup(this.rockCollisionGroup);
		this.rock.body.collides(this.bottleCollisionGroup,this.bottleHit2,this);
		
		//rock2 BOTTLE code ****************
		//new
		this.bottles = this.add.group();
		for(var i = 0; i<5; i++){
			this.bottles.create(10,this.rnd.integerInRange(10,100),'bottleSht');
		}
		//enable physics on the whole group
		this.physics.p2.enable(this.bottles, false);
		// use set all to setAll for same value
		this.bottles.setAll('body.static', true); 
		// use forEach to access each individual bottle
		this.bottles.forEach(function (bottle) {
			var scaleFactor = this.rnd.realInRange(.6,1);
			bottle.scale.setTo(scaleFactor,scaleFactor);
			
			bottle.body.setRectangle(scaleFactor*15,scaleFactor*40);
			bottle.body.velocity.x = this.rnd.integerInRange(50,150);
			bottle.body.angularVelocity = this.rnd.integerInRange(-5,5);
			
			//bottle.scale.setTo(this.rnd.realInRange(0.5,1),this.rnd.realInRange(0.5,1));
			bottle.animations.add('splode');
			
			bottle.body.setCollisionGroup(this.bottleCollisionGroup);
			bottle.body.collides(this.rockCollisionGroup);
			bottle.body.static = true;
			
			
		},this);
		
		
		
		this.bottleBreak =  this.add.audio('breakBottle');
		this.rockHitSnd =  this.add.audio('rockHit');
		//add start marker to rock hit sound
		this.rockHitSnd.addMarker('rockSrt',0.15,0.5);
		this.rock.grabbed = false;
		this.rock.body.onBeginContact.add(this.rockHit, this);
		//***rock2 code *************
					
		
		//input event liseteners
		this.input.onDown.add(this.rockGrab, this);
		this.input.onUp.add(this.rockDrop, this);
		this.input.addMoveCallback(this.rockMove, this);

	    //munu at bottom  **************************************
		this.menuGroup = this.add.group();
		
		var menuButton = this.add.button(this.world.width / 2, this.world.height - 30, "menubutton", this.toggleMenu,this);
		menuButton.anchor.set(0.5);

		this.menuGroup.add(menuButton);
		var resetGame = this.add.button(this.world.width / 2, this.world.height + 30, "resetgame", function () {
            // game reset functionality
		    this.state.start('MainMenu');
		},this);
		resetGame.anchor.set(0.5);
		this.menuGroup.add(resetGame);
		var thankYou = this.add.button(this.world.width / 2, this.world.height + 90, "thankyou", function () {
            // maybe a credits state here.
		}, this);
		thankYou.anchor.set(0.5);
		this.menuGroup.add(thankYou);
	    //******************************************************
		

	},
	getDistance:    function(x, y)
	{
		return Math.sqrt(x*x+y*y);
	},
	update: function(){
		if(this.getDistance(this.rock.body.velocity.x, this.rock.body.velocity.y)> 400)
		{
			this.rockTrailing();
			this.bStartedTrail=	true;
		}
		else
		{
			this.rock.tint=	0xffffff;
			if(this.trails!= null)
				this.deleteRockTrailing();
			this.bStartedTrail=	false;
		}
		this.bottles.forEach(function (bottle) {

			if(bottle.body.x > this.world.width+25){
				bottle.body.x = -10;
			}
			
		},this);
		
	},
	bStartedTrail:	false,
	
	
	// utility functions for the rock grab *****************
	rockGrab: function (pointer) {
		if(pointer.y > this.boundaryLine && this.rock.y > this.boundaryLine){
			this.rock.body.angularVelocity = 0;
			this.rock.grabbed = true;
			//create a sprite at the pointer
			pointer.handle = this.add.sprite(pointer.x, pointer.y);
			this.physics.p2.enable(pointer.handle, false);

			pointer.handle.body.setRectangle(5);
			pointer.handle.anchor.setTo(0.5, 0.5);
			pointer.handle.body.static = true;
			pointer.handle.body.collideWorldBounds = true;

			//create a constraint with the rock and the pointer
			pointer.rockConstraint = this.physics.p2.createLockConstraint(this.rock, pointer.handle );
		}
		
	},
	rockMove: function(pointer, x, y, isDown) {
		//at this point the constraint may is attached
		if(pointer.rockConstraint){
			pointer.handle.body.x = x;
			pointer.handle.body.y = y;
		}
	}, 
	rockDrop: function(pointer){
		if(pointer.rockConstraint){
			this.physics.p2.removeConstraint(pointer.rockConstraint);
			pointer.handle.destroy();
			
			pointer.rockConstraint = null;
			this.rock.grabbed = false;
		}
	},
	rockTrailing:   function()  {
		
		// Variables
		var	temp;
		
		if(!this.bStartedTrail)
		{
			if(this.trails!= null)
				this.trails.removeAll(true);
			this.trails=	this.add.group();
			this.add.spriteBatch(this.trails);
		}
		if(this.trails.length> 10)
			this.trails.removeChildAt(0);

		temp=	this.add.sprite(this.rock.x, this.rock.y, "firepuff");
		temp.anchor.setTo(0.5, 0.5);
		temp.scale.setTo(0.2, 0.2);
		temp=	temp.sendToBack();
	    //temp.tint=	0xde0000;
		temp.animations.add('light').play('light');
		this.rock.bringToTop();
		this.rock.tint=	0xac2010;
		this.trails.add(temp);
	},
	deleteRockTrailing:	function()	{
		if(this.trails.length> 0)
			this.trails.removeChildAt(0);
	},
	rockHit: function(){
		if(!this.rock.grabbed){
			this.rockHitSnd.play('rockSrt');
		}
	},
	//*************************************


	// Rock2 Bottle utility methods
	bottleHit2: function(rock, bottle){
				
		if(this.getDistance(rock.velocity.x, rock.velocity.y) > 400){
			this.bottleBreak.play();
			//last true kills the sprite
			bottle.sprite.animations.play('splode',30,false,true); 
			//bottle.sprite.kill();
			this.time.events.add(Phaser.Timer.SECOND * 2, this.spawnBottle, this);
		}
		
	},
	spawnBottle: function(){
		// grab a dead bottle from the group
		var bottle = this.bottles.getFirstDead();
		
		if(bottle != null){
			bottle.animations.stop('splode',true);
			bottle.body.x = -10;
			bottle.body.velocity.x = this.rnd.integerInRange(50,150);
			bottle.body.angularVelocity = this.rnd.integerInRange(-5,5);
			
			var scaleFactor = this.rnd.realInRange(.6,1);
			bottle.scale.setTo(scaleFactor,scaleFactor);
			bottle.body.setRectangle(scaleFactor*15,scaleFactor*40);
						bottle.body.setCollisionGroup(this.bottleCollisionGroup);
			bottle.body.collides(this.rockCollisionGroup);
			bottle.body.static = true;
			
			bottle.revive();
		}
	},

	

    // bottom menu utility methods
	toggleMenu: function () {
         if(this.menuGroup.y == 0){
             var menuTween = this.add.tween(this.menuGroup).to({
                 y: -180     
             }, 500, Phaser.Easing.Bounce.Out, true);
         }
        if(this.menuGroup.y == -180){
            var menuTween = this.add.tween(this.menuGroup).to({
                y: 0    
            }, 500, Phaser.Easing.Bounce.Out, true);     
        }
    },

};