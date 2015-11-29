/* jshint browser:true */
/* global Phaser, BasicGame */
// create Game function in BasicGame
BasicGame.Game = function (game) {
	
};
// set Game function prototype
BasicGame.Game.prototype = {
	bStartedTrail:	false,
	trailing:	0,
	combo:	0,
	init: function () {
		
		this.stage.backgroundColor = '#fff'; //white
		
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.restitution = 0.2; //this gives bounce
		this.physics.p2.gravity.y = 500;
		
		//draw the board
		var graphics = this.add.graphics(0, 0);
		this.boundaryLine = this.world.height/2;

		graphics.beginFill(0xadd8e6,1);  // blue 
		graphics.drawRect(0,0,this.world.width,this.boundaryLine);
		graphics.beginFill(0x98fb98,0.5); //green 0.5 opacity
		graphics.drawRect(0,this.boundaryLine,this.world.width,this.boundaryLine);
		
		graphics.lineStyle(6, 0xc0c0c0, 1);//light gray
		graphics.moveTo(0, this.boundaryLine);
		graphics.lineTo(this.world.width, this.boundaryLine); 
		
		//Set collision groups http://phaser.io/examples/v2/p2-physics/collision-groups
		this.physics.p2.setImpactEvents(true);
		//  Create our collision groups. One for the rocks, one for the bottles
		this.rockCollisionGroup = this.physics.p2.createCollisionGroup();
		this.bottleCollisionGroup = this.physics.p2.createCollisionGroup();
		this.boardCollisionGroup = this.physics.p2.createCollisionGroup();
		this.molotovCollisionGroup = this.physics.p2.createCollisionGroup();
		this.darkBottleCollisionGroup = this.physics.p2.createCollisionGroup();
		this.goldenBottleCollisionGroup=	this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
		
	},
	create: function () {
		// Add rock to the center of the stage
		this.rock = this.add.sprite(this.world.centerX, this.world.centerY, 'rock');
		this.rock.anchor.setTo(0.5, 0.5);
		this.rock.scale.setTo(0.06,0.06);
		
		// Adds the death rock
		this.deathRock=	this.add.sprite(0, 0, "deathrock");
		this.deathRock.animations.add("toheaven");
		this.deathRock.visible=	false;
		this.deathRock.anchor.setTo(0.5, 0.5);
		this.physics.p2.enable(this.deathRock);
		this.deathRock.static=	true;
		
		// turn false the collision circle in production
		this.physics.p2.enable(this.rock, false); //change to true to see hitcircle
		this.rock.body.setRectangle(25,20);
		this.rock.body.collideWorldBounds = true;
		this.rock.body.velocity.x = 20;
		this.rock.body.velocity.y = 150;
		this.rock.body.angularDamping = 0.5;

		//new set collision group note: no callbacks on rock.body.collides
		this.rock.body.setCollisionGroup(this.rockCollisionGroup);
		this.rock.body.collides([this.bottleCollisionGroup,this.boardCollisionGroup, this.molotovCollisionGroup, this.darkBottleCollisionGroup,this.goldenBottleCollisionGroup]);
		
		//green BOTTLE group code code ****************
		this.bottles = this.add.group();
		for(var i = 0; i<BasicGame.numGreenBottles; i++){
			var bottle = this.bottles.create(10,this.rnd.integerInRange(10,100),'bottleSht');
			bottle.animations.add('splode');
		}
		//enable physics on the whole group
		this.physics.p2.enable(this.bottles, false);
		this.spawnBottles();
		
		// initialize wood boards *******************
		this.boards = this.add.group();
		this.addToSpecialGroup(this.boards, 3, 'woodBlocker', 0.7, 0.25);
		this.physics.p2.enable(this.boards, false);
		this.spawnBoards();
		//***********************************************
        // initialize lives boards *******************
        this.lifeGroup = this.add.group();
        this.addToSpecialGroup(this.lifeGroup, 3, 'livesSht', 0.3, 0.3);
        this.lifeGroup.forEach(function(life){
                life.revive();
                life.y = this.world.height - 60;
        },this);
        this.lifeGroup.getAt(1).x = 50;
        this.lifeGroup.getAt(2).x = 100;
        //***********************************************
		
		// initialize molotovs boards *******************
		this.molotovs = this.add.group();
		this.addToSpecialGroup(this.molotovs, 3, 'molotovSht', 0.35, 0.35, function(molotov) {
                molotov.animations.add('fire');
                molotov.animations.play('fire',8,true,false);
        });
		this.physics.p2.enable(this.molotovs, false);
		this.spawnMolotovs();
		//***********************************************
		
        // initialize dark bottles
		this.darkBottles=	this.add.group();
		this.addToSpecialGroup(this.darkBottles, 3, 'darkBottleSht', 0.3, 0.3, function(dark) {
                dark.animations.add('toxic');
                //dark.animations.play('toxic',4,true,false);
        });
		this.physics.p2.enable(this.darkBottles,false);
		this.spawnDarkBottles();
		
        // only ever one golden bottle
		this.goldenBottle=	this.add.sprite(0, 0, "goldenBottle");
		this.physics.p2.enable(this.goldenBottle,false);
        this.goldenBottle.body.setRectangle(15, 30);
		this.goldenBottle.animations.add("glow");
		this.goldenBottle.animations.play("glow", 3, true);
		this.goldenBottle.scale.setTo(0.65, 0.65);
		this.goldenBottle.kill();
		this.spawnGoldenBottle();
		
		this.bottleBreak =  this.add.audio('breakBottle');
		this.bottleExplode =  this.add.audio('explodeBottle');
		this.rockHitSnd =  this.add.audio('rockHit');
		//add start marker to rock hit sound
		this.rockHitSnd.addMarker('rockSrt',0.15,0.5);
		this.rock.body.onBeginContact.add(this.rockHit, this);
		//*************
		
		//input (grab functionality)
		this.rock.grabbed = false;
		this.throwHandle = this.add.sprite(0, 0);
		this.physics.p2.enable(this.throwHandle, false);
		this.throwHandle.body.static = true;
		this.throwConstraint = null;
		//event listeners 
		this.input.onDown.add(this.rockGrab, this);
		this.input.onUp.add(this.rockDrop, this);
		this.input.addMoveCallback(this.rockMove, this);
		
		this.scoreText=	this.add.text(10, this.world.centerY-24, "Score: "+BasicGame.score+"\nLevel: "+BasicGame.level, {
			fontFamily:	"arial",
			fontSize:	"16px",
			fill:	"#101820"
		});
		this.levelTxt =	this.add.text(this.world.centerX, this.world.centerY/2, "Level: "+BasicGame.level, {
			fontFamily:	"arial",
			fontSize:	"28px",
			fill:	"#fff"
		});
		this.levelTxt.anchor.set(0.5,0.5);
		this.levelTxt.lifespan = 2000;
        this.highScoreText=	this.add.text(10, this.world.height-75, "High Score: "+BasicGame.highScore, {
			fontFamily:	"arial",
			fontSize:	"14px",
			fill:	"#101820"
		});
		
		// Add lives
		this.lives=	3;
        
        // game overlay menu ... code at very bottom
        this.initGameMenu();
        
	},
	addToSpecialGroup:	function(group, size, textureID, scaleX, scaleY, modifyEvent)	{
		for(var i = 0; i<size; i++)
		{
			// Variables
			var temp = group.create(0, 0, textureID);
			
			if(modifyEvent)
			{
                modifyEvent(temp);
			}
			temp.scale.setTo(scaleX, scaleY);
			temp.kill();
		}
	},
	update: function(){
		if(this.trailing !== 0)
		{
			if(this.getSpeed(this.rock.body.velocity.x, this.rock.body.velocity.y)> 400)
			{
				this.rockTrailing();
				this.bStartedTrail=	true;
			}
			else
			{
				this.rock.tint=	0xffffff;
				if(this.trails!== null)
					this.deleteRockTrailing();
				this.bStartedTrail=	false;
			}
		}
		this.bottles.forEachAlive(this.resetObjLocation,this);
		this.boards.forEachAlive(this.resetObjLocation,this);
		this.molotovs.forEachAlive(this.resetObjLocation,this);
		this.darkBottles.forEachAlive(this.resetObjLocation, this);
		//****************************************
	},
	
	resetObjLocation:	function(obj)	{
		if(obj.body.x> this.world.width+25)
			obj.body.x=	-10;
	},
	
	// utility functions for the rock grab *****************
	rockGrab: function (pointer) {
		if(pointer.y > this.boundaryLine && this.rock.y > this.boundaryLine){
			this.rock.body.angularVelocity = 0;
			this.rock.grabbed = true;
			//move the blank sprite to the pointer
			this.throwHandle.body.x = pointer.x;
			this.throwHandle.body.y = pointer.y;
			//create a constraint with the rock and the blank sprite
			this.throwConstraint = this.physics.p2.createLockConstraint(this.rock, this.throwHandle );
		}
	},
	rockMove: function(pointer, x, y, isDown) {
		if(this.rock.grabbed){
			this.throwHandle.body.x = x;
			this.throwHandle.body.y = y;
			//ROCK DROP at BOUNDARY -- can remove this for testing
			if(this.rock.body.y<this.boundaryLine){
				this.rockDrop(pointer);
			}
		}
	}, 
	rockDrop: function(pointer){
		if(this.rock.grabbed){
			this.physics.p2.removeConstraint(this.throwConstraint);			
			this.throwConstraint = null;
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
		}
		if(this.trails.length> 10)
			this.trails.removeChildAt(0);

		temp=	this.add.sprite(this.rock.x, this.rock.y, "firepuff");
		temp.anchor.setTo(0.5, 0.5);
		temp.scale.setTo(this.rock.scale.x*4, this.rock.scale.y*4);
		temp=	temp.sendToBack();
		//temp.tint=	0xde0000;
		temp.animations.add('light').play('light');
		this.rock.bringToTop();
		this.rock.tint=	0xac2010;
		this.trails.add(temp);
	},
	deleteRockTrailing:	function()	{
		if(this.trails!= null && this.trails.length> 0)
			this.trails.removeChildAt(0);
	},
	rockHit: function(){
		if(!this.rock.grabbed){
			if(BasicGame.sound){
				this.rockHitSnd.play('rockSrt');
			}
		}
	},
	//*************************************
	

	// Rock2 Bottle utility methods
	bottleHit2: function(bottle,rock){
		// bottle needs to be going fast enough and not playing its animation
		if(this.getSpeed(rock.velocity.x, rock.velocity.y) > BasicGame.breakSpeedGreenBottle && !bottle.sprite.animations.currentAnim.isPlaying){
			if(BasicGame.sound){ 
				 this.bottleBreak.play();
			}
			bottle.sprite.animations.play('splode',30,false,true); 
			this.spawnShards(bottle.sprite);
			bottle.sprite.events.onKilled.addOnce(function(){
				this.spawnGoldenBottle();
				this.combo++;
				this.increaseScore((10+2*(BasicGame.level-1))*this.combo);
				if(this.comboText!= null)
				{
					if(this.combo> 1)
						this.comboText.setText("Combo! x"+this.combo);
				}
				else
					this.comboText=	this.add.text(this.world.width-200, this.world.centerY-20,
						((this.combo> 1) ? "Combo! x"+this.combo : "")
					);
				if(this.comboTimer!= null)
					this.time.events.remove(this.comboTimer);
				this.comboTimer=	this.time.events.add(Phaser.Timer.SECOND, function(){
					this.combo= 0;
					this.comboText.setText("");
				}, this);
				if(this.bottles.countDead()===BasicGame.numGreenBottles){
					BasicGame.level+=1;
					this.announceLevel();
					this.spawnBottles();
					this.spawnBoards();
					this.spawnMolotovs();
				};
			},this);
		}
		
	},

	spawnBottles: function(){
		this.bottles.forEach(function (bottle) {
			bottle.animations.stop('splode',true);
			bottle.body.x = -10;
			// NEED a better level up AI
			bottle.body.velocity.x = this.rnd.integerInRange(50,150)*BasicGame.level/2.0; // whoa...
			bottle.body.angularVelocity = this.rnd.integerInRange(-5,5);
			if(bottle.body.angularVelocity== 0)
				bottle.body.angularVelocity=	4;
			
			var scaleFactor = this.rnd.realInRange(0.3,0.6);
			bottle.scale.setTo(scaleFactor,scaleFactor);
			bottle.body.setRectangle(scaleFactor*20,scaleFactor*100);
			bottle.body.static = true;
			bottle.body.setCollisionGroup(this.bottleCollisionGroup);
			bottle.body.collides(this.rockCollisionGroup,this.bottleHit2,this);
			
			bottle.revive();

		},this);
	},
	spawnSpecialsGroup:	function(group, collisionGroup, rockHitEvent, modifyEvent)	{
		// Variables
		var	num=	0;
		
		if(BasicGame.level< 5)	num=	1;
		else if(BasicGame.level>= 5 && BasicGame.level< 10)	num=	2;
		else	num=	3;
		
		for(var i= 0; i< num-group.countLiving(); i++)
		{
			// Variables
			var	item=	group.getFirstDead();
			
			if(item)
			{
				item.body.x=	-10;
				item.body.y=	this.world.centerY-this.rnd.integerInRange(10, 100);
				item.body.velocity.x=	this.rnd.integerInRange(50, 200);
				item.body.velocity.y=	0;
				item.body.angularVelocity=	this.rnd.integerInRange(-5, 5);
				if(item.body.angularVelocity== 0)
					item.body.angularVelocity=	4;
				item.body.setCollisionGroup(collisionGroup);
				item.body.collides(this.rockCollisionGroup, rockHitEvent, this);
				item.body.static=	true;
				
				if(modifyEvent)
				{
					this.deletemelaterfunc=	modifyEvent;
					this.deletemelaterfunc(item);
					this.deletemelaterfunc=	null;
				}
				item.revive();
			}
		}
	},
	spawnBoards: function(){
		this.spawnSpecialsGroup(this.boards, this.boardCollisionGroup, this.boardHit, function(board){
			board.frame=	0;
		});
	},
	boardHit: function(arg){
		var board = arg.sprite;
		// each board is a spritesheet
		if(board.frame===4){
			board.lifespan = 1000;
			board.body.velocity.y=75;
			board.body.angularVelocity = this.rnd.integerInRange(20,45);
			this.increaseScore(50);
		}else{
			board.frame+=1;
		}
	},
	spawnMolotovs: function(){
		this.spawnSpecialsGroup(this.molotovs, this.molotovCollisionGroup, this.molotovHit, function(molotov)	{
            // implement ghost rock when death occurs
            // have to reset collision group after rectangle set
			molotov.body.setRectangle(20, 60);
            molotov.body.setCollisionGroup(this.molotovCollisionGroup);
			//molotov.events.onKilled.addOnce(this.spawnShards,this);
		});
	},
	molotovHit: function(arg){
		var molotov = arg.sprite;
		
		
		if(this.getSpeed(this.rock.body.velocity.x, this.rock.body.velocity.y) > BasicGame.breakSpeedMolotov && molotov.alive){
			molotov.kill();
			if(BasicGame.sound){
				this.bottleBreak.play();
				this.bottleExplode.play();
				//this.dieYouDie();
			};
			var temp=	this.add.sprite(molotov.x, molotov.y, "firepuff");
			temp.anchor.setTo(0.5, 0.5);
			temp.animations.add('explode').play('explode',30,true);
			if(this.trailing== 0) // Only take damage if thrasher mode is off
				this.damageLife();
 			// Is there a memory leak?
		}

	},
	spawnShards: function(sprite){
			var shards =	this.add.group();
	  
			shards.create(sprite.body.x,sprite.body.y,'shard01');
			shards.create(sprite.body.x,sprite.body.y,'shard02');
			shards.create(sprite.body.x,sprite.body.y,'shard03');
			shards.create(sprite.body.x,sprite.body.y,'shard04');
			this.physics.p2.enable(shards, false);
			//MEMORY LEAK CHECK: destry these shards and group?
			shards.forEach(function (shard) {
				shard.scale.setTo(0.5,0.5);
                shard.body.velocity.x = this.rnd.integerInRange(20,100);
				shard.body.angularVelocity = this.rnd.integerInRange(1,30);;
				shard.lifespan = 1000;  //kill at end of time I think?
				// destroy shard but the group survives (or is it a local var?)
				shard.events.onKilled.addOnce(function(arg){arg.destroy()},this);
			},this);
		   
	},
	spawnDarkBottles:	function(){
		this.spawnSpecialsGroup(this.darkBottles, this.darkBottleCollisionGroup, this.darkBottleHit,function(darkbottle){
			darkbottle.frame=	0;
            darkbottle.body.setRectangle(15, 50);
            darkbottle.body.setCollisionGroup(this.darkBottleCollisionGroup);
		});
	},
	darkBottleHit: function(args){
		// Variables
		var	dbottle=	args.sprite;
		
		if(this.getSpeed(this.rock.body.velocity.x, this.rock.body.velocity.y) > BasicGame.breakSpeedDarkBottle){
			// this.rock gets BIG for 3 seconds or so
			if(BasicGame.sound){this.bottleBreak.play()};
            dbottle.animations.play('toxic',15,false,true); // last true gives a kill
			//dbottle.kill();
		 
			this.rock.scale.setTo(0.2,0.2);
			this.rock.body.setRectangle(100, 85);
			this.rock.body.setCollisionGroup(this.rockCollisionGroup);
			this.rock.body.collides([this.bottleCollisionGroup,this.boardCollisionGroup, this.molotovCollisionGroup, this.darkBottleCollisionGroup,this.goldenBottleCollisionGroup]);
			this.rock.body.collideWorldBounds = true;
			
			//this.rock.body.setRectangle(40,40);
			this.time.events.add(Phaser.Timer.SECOND *3, function(){
				//back to normal
				this.rock.scale.setTo(0.06,0.06);
				this.rock.body.setRectangle(25, 20);
				this.rock.body.setCollisionGroup(this.rockCollisionGroup);
				this.rock.body.collides([this.bottleCollisionGroup,this.boardCollisionGroup, this.molotovCollisionGroup, this.darkBottleCollisionGroup,this.goldenBottleCollisionGroup]);
				this.rock.body.collideWorldBounds = true;
				// scale the hit rectangle back
				//this.rock.body.setRectangle(25,20);
				this.spawnDarkBottles();
			}, this);
			
		}
	},
	spawnGoldenBottle:	function()	{
		if(this.goldenBottle.alive || this.trailing!= 0)
			return;
		if(this.rnd.integerInRange(0, 25)=== 0) // 4% Chance of spawning
		{
			this.goldenBottle.body.x=	-10;
			this.goldenBottle.body.y=	this.world.centerY-this.rnd.integerInRange(10, 100);
			this.goldenBottle.body.velocity.x=	this.rnd.integerInRange(50, 200);
			this.goldenBottle.body.velocity.y=	0;
			this.goldenBottle.body.angularVelocity=	this.rnd.integerInRange(-5, 5);
			if(this.goldenBottle.body.angularVelocity== 0)
				this.goldenBottle.body.angularVelocity=	4;
			this.goldenBottle.body.setCollisionGroup(this.goldenBottleCollisionGroup);
			this.goldenBottle.body.collides(this.rockCollisionGroup, this.goldenBottleHit, this);
			this.goldenBottle.body.static=	true;
			this.goldenBottle.revive();
		}
	},
	goldenBottleHit:	function(args)	{
		if(this.getSpeed(this.rock.body.velocity.x, this.rock.body.velocity.y) > BasicGame.breakSpeedDarkBottle){
			// Thrasher mode for 3 seconds or so
			if(BasicGame.sound){this.bottleBreak.play()};
			this.goldenBottle.kill();
		 	
		 	this.trailing=	1;
            //change color of stage to indicate thrasher mode.
            this.stage.backgroundColor = '#ff0000';
            //annouce thrasher mode
            this.levelTxt.setText("Thrasher mode!\nNo death 8 sec.");
            this.levelTxt.revive();
            this.levelTxt.lifespan = 2000;
			
			this.time.events.add(Phaser.Timer.SECOND *8, function(){
				this.trailing=	0;
				this.rock.tint=	0xffffff;
                this.stage.backgroundColor = '#ffffff';
				this.spawnGoldenBottle();
			}, this);
			
		}
	},
	increaseScore:	function(amount)
	{
		BasicGame.score+=	amount;
		this.scoreText.setText("Score: "+BasicGame.score+"\nLevel: "+BasicGame.level);
	},
	announceLevel: function(){
		this.levelTxt.setText("Level: "+BasicGame.level);
		this.levelTxt.revive();
		this.levelTxt.lifespan = 2000;
		// update the score
		this.scoreText.setText("Score: "+BasicGame.score+"\nLevel: "+BasicGame.level);
	},
	getSpeed: function(x, y){ return Math.sqrt(x*x+y*y);},
	dieYouDie: function(){
		this.levelTxt.setText("You died!\n"+this.lives+" "+((this.lives> 1) ? "lives" : "life")+" left.");
		this.levelTxt.revive();
		this.levelTxt.lifespan = 2000;
        
         this.lifeGroup.getAt(2-this.lives).frame = 1;

	},
	dieGameOver:	function()	{

        
        if(BasicGame.score>=BasicGame.highScore){
            BasicGame.highScore = BasicGame.score;
            this.levelTxt.setText("Game Over.\nHigh Score!");
            this.highScoreText.setText("High Score: "+BasicGame.highScore);
        }else{
            this.levelTxt.setText("Game Over!");
        }	
        if(BasicGame.level>=BasicGame.highLevel){
            BasicGame.highLevel=BasicGame.level;
            //should probably say something.
        }
            
		this.levelTxt.revive();
		this.levelTxt.lifespan=	2000;
        
        this.lifeGroup.getAt(2).frame = 1;
		// Stop game here dispatch the game overlay menu
        this.levelTxt.events.onKilled.addOnce(function(){
            this.toggleMenu();
        },this);
	},
	damageLife:	function()	{
		this.lives--;
		// Kill rock here somehow
		this.rock.visible=	false;
		this.rock.kill();
		this.deathRock.body.x=	this.rock.body.x;
		this.deathRock.body.y=	this.rock.body.y;
		this.deathRock.visible=	true;
		this.deathRock.body.static=	true;
		this.deathRock.animations.play("toheaven", 8, true);
		if(this.rock.scale.x== 0.2)
			this.deathRock.scale.setTo(2, 2);
		else
			this.deathRock.scale.setTo(1, 1);
		this.deathRock.body.velocity.y=	-10;
		this.deathRock.alpha=	1;
		// Complex system of levers and pulleys
		this.time.events.add(Phaser.Timer.SECOND, function()	{
			this.deathRock.alpha=	0.5;
		}, this);
		this.time.events.add(Phaser.Timer.SECOND*2, function()	{
			this.deathRock.alpha=	0.15;
		}, this);
		this.time.events.add(Phaser.Timer.SECOND*3, function()	{
			this.deathRock.body.velocity.y=	0;
			this.deathRock.animations.stop("toheaven");
			this.deathRock.visible=	false;
			
			this.rock.body.x=	this.world.centerX;
			this.rock.body.y=	this.world.centerY;
			this.rock.body.velocity.x=	0;
			this.rock.body.velocity.y=	10;
			this.rock.body.angularVelocity=	0;
            if(this.lives>0){
                this.rock.visible=	true;
                this.rock.revive();
            }
			     
		}, this);
		if(this.lives> 0)
			this.dieYouDie();
		else
			this.dieGameOver();
	},
    initGameMenu: function(){ // Game Menu Overlay  **************************************
        		
		this.menuGroup = this.add.group();
       
        this.menuGroup.add(this.add.image(this.world.centerX-100, -250, 'rope'));
        this.menuGroup.add(this.add.image(this.world.centerX+87, -250, 'rope'));
		
		var menuButton = this.add.button(this.world.width / 1.06,  this.world.centerY / 1.12, "menubutton", this.toggleMenu,this);
		menuButton.anchor.set(0.5);
        
		var mm = this.add.button(this.world.width / 2, -30, "mainmenu", function () {
			this.state.start('MainMenu');
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
        
        var st =	this.add.text(this.world.centerX, 10, "iThrowRock", {
			fontFamily:	"arial",
			fontSize:	"14px",
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
