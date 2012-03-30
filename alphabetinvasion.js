(function (global, $, undefined) {
	var root = global.Rx
	, Observable = root.Observable
	, observableCreateWithDisposable = Observable.createWithDisposable
	, timeoutScheduler = root.Scheduler.Timeout

	, isNullOrUndefined = function (value) {
		return value === null || value === undefined;
	};

	root.Observable.random = function (low, high, intervalLow, intervalHigh, howMany, scheduler) {
		scheduler || (scheduler = timeoutScheduler);
		if (isNullOrUndefined(howMany)) { 
			howMany = -1; 
		}
		if (isNullOrUndefined(intervalLow)) {
			intervalLow = 1;
		}
		if (isNullOrUndefined(intervalHigh)) {
			intervalHigh = 1;
		}	
		return observableCreateWithDisposable(function (observer) {
			var delta = high - low
			, intervalDelta = intervalHigh - intervalLow
			, ticks = 0
			, iFunc = (intervalDelta === 0) 
					? function () { return intervalLow; }
					: function () { return Math.floor((Math.random() * intervalDelta) + intervalLow); };
			return scheduler.scheduleRecursiveWithRelative(iFunc(), function (self) {	
				if (++ticks <= howMany) {
					observer.onNext(Math.floor((Math.random() * delta) + low));
					self(iFunc());
				} else {
					observer.onCompleted();
				}
			});
		});
	};

	var GameState = {
		playing: 'playing',
		paused: 'paused',
		stopped: 'stopped'
	};

	var AlphabetInvasion = (function () {
		function AlphabetInvasion() {
			this.enemies = [];

			// get references to our needed DOM elements
			this.modalBox = $('#modalmessages');
			this.message = $('#message');
			this.score = $('#score');
			this.playfield = $('#playfield');
			this.level = $("#level");
			this.remainingEnemies = $("#remaining");
			this.highScore = $("#highscore");
		}

  		var CURRENT_SPEED = 0;
  		var LAUNCH_RATE = 1;
  		var HIGH_SCORE_STORAGE_KEY = '_alphabet_attack_high_score_';

		var playfieldheight = 0;
  		var lookup = "abcdefghijklmnopqrstuvwxyz";
		var levels = {
			"Level 1 - Rookies": [60, 1300],
			"Level 2 - Tenderfoots": [55, 1200],
			"Level 3 - Militia": [50, 1100],
			"Level 4 - Privates": [50, 1000],
			"Level 5 - Corporals": [45, 800],
			"Level 6 - Sergeants": [40, 650],
			"Level 7 - Master Sergeants": [35, 500],
			"Level 8 - Lieutenants": [30, 450],
			"Level 9 - Captains": [25, 400],
			"Level 10 - Majors": [20, 400],
			"Level 11 - Colonels": [15, 350],
			"Level 12 - Generals": [11, 350],
			"Level 13 - Special Forces": [9, 350],
			"Level 14 - Black Ops": [7, 350],
			"Level 15 - Ninjas": [5, 350]    
		};

		AlphabetInvasion.prototype.run = function () {
			this.resetGame();
			this.keyboardObservable = $(document).keyupAsObservable();

			// If paused cause game to start
			var self = this;
			this.keyboardObservable.subscribe(function () {
				if (self.gameState === GameState.paused) {
					self.hideMessage();
					self.playLevel();
				}
			});

			if (global.localStorage) {
				var hs = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
				if (hs !== null) {
					highScore.text(hs);
				}
			}
		};
		
		AlphabetInvasion.prototype.playLevel = function () {
			if (this.generator) {
				this.generator.dispose();
			}
			var title, found = false;
			for (var level in levels) {		
				if (level.indexOf(this.currentLevel) !== -1) {
					found = true;
				}
				if (found) {
					title = level;
					break;
				}		
			}
			
			var config = levels[level];
			
			this.gameState = GameState.playing;
			this.level.text(this.currentLevel);
			this.showMessage(title);
			
			// nested method to handle the actual gameplay loop
			var self = this;
			var play = function () {
				self.hideMessage();
				var enemiesThisLevel = self.currentLevel * 2 + 13;
				self.remainingEnemies.text(enemiesThisLevel);
				
				var capitalLetterProbability = 1 - ((self.currentLevel * 2.5) / 100);
				var killed = 0;
				var allEnemiesLaunched = false;
				
				// Start the game loop, which updates the enemies.
				self.gameloop = Rx.Observable.interval(config[CURRENT_SPEED]).subscribe(function () {
					self.updatePlayfield();
				});
				
				// set another subscriber to the keyboardObservable
				// which handles play input during each level				
				self.keyboard = self.keyboardObservable.subscribe(function (e) {
					if (self.enemies.length === 0 && !allEnemiesLaunched) {
						return;
					}
					
					if (self.enemies.length === 0 && allEnemiesLaunched) {
						self.nextLevel();
						return;
					}
					var key = e.shiftKey ? String.fromCharCode(e.keyCode) : String.fromCharCode(e.keyCode).toLowerCase();
					if (key === self.enemies[0].text()) {
						var enemy = self.enemies.shift();
						self.killEnemy(enemy);
						self.remainingEnemies.text(enemiesThisLevel - ++killed);
						
						if (self.enemies.length === 0 && allEnemiesLaunched) {
							self.nextLevel();
						}
					}
				});
				
				// Generate enemies for this Level.
				// 10% chance for uppercase enemy				
				self.generator = Rx.Observable.random(0, 25, config[LAUNCH_RATE], config[LAUNCH_RATE], enemiesThisLevel).select(function (v) {
					return Math.random() <= capitalLetterProbability ? lookup.charAt(v - 1) : lookup.charAt(v - 1).toUpperCase();
				}).subscribe(function (v) {
					self.launchNewEnemy(v);
				}, function (e) {
					throw e;
				}, function () {
					allEnemiesLaunched = true;
				});
			};
	
			// This observable sets a delay for showing the level title,
		    // after which we call the nested play() method to start
		    // the level.
			Rx.Observable.timer(2500).subscribe(function () { play(); });
		};
		
		AlphabetInvasion.prototype.nextLevel = function () {
			if (this.currentLevel === 15) {
				this.youWin();
			}
			
			this.gameState = GameState.stopped;
			this.gameloop.dispose();
			this.generator.dispose();
			this.keyboard.dispose();
			
			this.showMessage('Level ' + this.currentLevel + ' Complete');
			this.currentLevel++;
			
			var self = this;
			Rx.Observable.timer(4000).subscribe(function () { self.playLevel(); });
		};
		
		AlphabetInvasion.prototype.youWin = function () {
			if (this.gameState === GameState.stopped) {
				return;
			}
			
			// change game state and dispose of our
			// game loop observables			
			this.gameState = GameState.stopped;
			this.gameloop.dispose();
			this.generator.dispose();
			this.keyboard.dispose();
			
			this.showMessage("You win this time Earthling!  We'll be back!");
			
			// reset the game after 5.5 seconds
			var self = this;
			Rx.Observable.timer(5500).subscribe(function () {
				self.resetGame();
			});
		};
		
		AlphabetInvasion.prototype.youLose = function () {
			if (this.gameState === GameState.stopped) {
				return;
			}
			
			// change game state and dispose of our
			// game loop observables
			this.gameState = GameState.Stopped;
			this.gameloop.dispose();
			this.generator.dispose();
			this.keyboard.dispose();
			
			// adjust all enemies except the one that landed
			// to look like :P		
			for (var i = 0, len = this.enemies.length; i < len; i++) {
				var enemy = this.enemies[i];
				if (enemy !== this.enemies[0]) {
					enemy.text(':P').addClass('rotate').css('font-size', 72);
				}
			}
			
			this.showMessage("You Lose Earthling.  Prepare to be alphabetized!");
			
			// reset the game after 4.5 seconds
			var self = this;
			Rx.Observable.timer(5500).subscribe(function () {
				self.resetGame();
			});			
		};
		
		AlphabetInvasion.prototype.killEnemy = function (enemy) {
			// adjust the enemy visual
			enemy.css({'color': 'red', 'font-size': 48}).text('@');
			
			// calculate a score
			var v = enemy.offset().top;
			this.addToScore((this.playfield.height() - v) * this.currentLevel);
			
			// remove the enemy from the DOM after 750ms
			Rx.Observable.timer(750).subscribe(function () { 
				enemy.remove();
			});
		};
		
		// Updates positions of all enemies and calculates if an enemy has landed.
		AlphabetInvasion.prototype.updatePlayfield = function () {
			// adjusting enemy speed based on playfield height
			var factor = this.playfield.height() / 200;
			
			var self = this;
			Rx.Observable.fromArray(this.enemies).subscribe(function (enemy) {
				var offset = enemy.offset()
				, newPos = offset.top + factor;
				enemy.offset({'top': newPos, 'left': offset.left});
				if (newPos >= self.playfield.height() + 44) {
					self.youLose();
				}
			});
			
		};
		
		AlphabetInvasion.prototype.launchNewEnemy = function (v) {
			//randomize a color, not too dark
			var r = Math.floor(Math.random() * 100 + 155)
			, g = Math.floor(Math.random() * 100 + 155)
			, b = Math.floor(Math.random() * 100 + 155);
		
			// build the enemy and set it's initial position
			var enemy = $('<div />', {
				html: v,
				css: { 
					color: 'rgb('+r+','+g+','+b+')', 
					position: 'absolute',
					'top': this.playfield.offset().top,
					'left': Math.random() * (this.playfield.innerWidth() - 25)
				}
			}).addClass('enemy');
			
			// update the tracking queue and add the enemy to the DOM
			this.enemies.push(enemy);
			enemy.appendTo(this.playfield);
		};
		
		AlphabetInvasion.prototype.addToScore = function (amount) {
			var newScore = parseInt(this.score.text()) + amount;
			this.score.text(newScore);
			
			if (newScore > parseInt(this.highScore.text())) {
				this.highScore.text(newScore);
				if (global.localStorage) {
					window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, newScore);
				}
			}
		};
		
		AlphabetInvasion.prototype.resetGame = function () {
			this.gameState = GameState.paused;
			this.showMessage('');
			
			this.currentLevel = 1;
			
			this.score.text(0);
			this.level.text(1);
			this.remainingEnemies.text('');
			
			this.clearPlayfield();
			
			if (this.windowHeight) this.windowHeight.dispose();
			if (this.generator) this.generator.dispose();
			if (this.matcher) this.matcher.dispose();
			if (this.gameloop) this.gameloop.dispose();
			if (this.keyboard) this.keyboard.dispose();
			
			this.showMessage('PRESS ANY KEY TO START');
		};
		
		AlphabetInvasion.prototype.clearPlayfield = function () {
			for (var i = 0, len = 0; i < len; i++) {
				this.enemies[i].remove();
			}
			this.enemies = [];
		};
		
		// Displays a model message one letter at a time.
		AlphabetInvasion.prototype.showMessage = function (msg) {
			if (msg && msg.length === 0) {
				this.message.text('');
				return;
			}
			
			this.modalBox.css('opacity', 1);
			
			var self = this;
			for (var i = 0, len = msg.length; i < len; i++) {
				(function (i) {
					Rx.Observable.returnValue(i).delay(30 * i).subscribe(function (x) {
						self.message.text(msg.substring(0, x + 1));
					});
				})(i);
			}
		};
		
		AlphabetInvasion.prototype.hideMessage = function () {
			this.modalBox.css('opacity', 0);
		};
			
		return AlphabetInvasion;

	})();
	
	var game = new AlphabetInvasion();
	game.run();
	
})(this, jQuery);