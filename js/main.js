// Generated by CoffeeScript 1.10.0
(function() {
  var Game, Player;

  window.preferences = {
    cutscene_1: true,
    debug: false
  };

  window.game_over_text = ["Keish and her students found Log trapped in the Luddite castle. " + " They rescued him and snuck away.", "The students were given the rest of the day off, and Log and Keish lived together happily ever after.", "Happy Birthday Keisha!"];

  window.requirements = {
    obstacle1: {
      users: ['miranda'],
      sub: 'bio',
      sprite: 'spider',
      kill: true,
      scale: 1,
      problem_text: 'Oh no, there\'s a spider blocking the path\nClick on a student to come up with a solution',
      finish_text: 'Miranda remembers hearing from bio class that many animals are afraid of smoke. ' + 'She lights a fire with some wet leaves to create smoke and scare the spider away.'
    },
    obstacle2: {
      users: ['katie'],
      sub: 'math',
      sprite: 'old_guy',
      scale: 2,
      problem_text: 'This man needs help building a fence, but he wants to use his resources as efficiently as possible',
      finish_text_list: ['Katie uses her math skills to prove that a regular n-sided polygon has the largest area to ' + 'perimeter ratio.', 'She also proves that more sides also improves the ratio. She teaches the man that ' + 'building a circular fence will allow him to fence the largest area using the fewest resources.', 'The man is thankful for their help and wishes them well on the rest of their journey']
    },
    obstacle3: {
      users: ['liam', 'nina'],
      sub: 'physics',
      sprite: 'gear',
      additional: 'bridge',
      scale: 2,
      problem_text: 'We need to find some way to cross this bridge',
      finish_text_list: ['Liam and Nina work together to determine how to get the bridge down.', 'They tie two rocks together with a string. Nina calculates the vectors needed to hit the gear ' + 'across the chasm, while Liam calculates the momentum the rocks must have to cause the bridge to lower', 'Together they lower the bridge and the crew can continue their quest.']
    }
  };

  window.cutscene_font = {
    font: "24px Arial",
    fill: "#FFFFFF",
    wordWrap: true,
    wordWrapWidth: 600,
    align: "center"
  };

  Player = (function() {
    function Player(name, game, width) {
      _.bindAll(this, 'menu', 'createPlayer');
      this.game = game;
      this.name = name;
      this.game.load.spritesheet(name, "/birthday/assets/" + name + ".png", width, 25);
      this.font = {
        font: "16px Arial",
        fill: "#000000",
        wordWrap: true,
        wordWrapWidth: 200,
        align: "center"
      };
    }

    Player.prototype.createPlayer = function(scale, x, y, distance) {
      var button, button_text, j, len, ref, sub, title;
      this.initial_y = y;
      console.log(window.preferences);
      if (window.preferences.debug) {
        console.log(x);
        x += 1100;
      }
      this.distance = distance;
      this.player = this.game.add.sprite(x, y, this.name);
      this.player.anchor.setTo(0.5, 0.5);
      this.player.scale.setTo(scale, scale);
      this.player.animations.add('walk', [1, 2], 5, true);
      this.playerLeft = false;
      this.game.physics.arcade.enable(this.player);
      this.player.body.gravity.y = 300;
      this.player.body.collideWorldBounds = true;
      this.subjects = ['math', 'physics', 'bio'];
      this.buttons = [];
      this.button_texts = [];
      ref = this.subjects;
      for (j = 0, len = ref.length; j < len; j++) {
        sub = ref[j];
        button = this.game.add.button(0, 0, 'button', this.buttonClick, this, 1, 0, 2);
        button.params = {
          name: this.name,
          sub: sub
        };
        button.anchor.set(0.5, 0.5);
        button.visible = false;
        this.buttons.push(button);
        button_text = this.game.add.text(0, 0, sub, this.font);
        button_text.anchor.set(0.5, 0.4);
        button_text.visible = false;
        this.button_texts.push(button_text);
      }
      title = this.game.add.text(0, 0, this.name + " used:", this.font);
      title.anchor.set(0.5, 0.4);
      title.visible = false;
      this.button_texts.push(title);
      this.text = this.game.add.text(0, 0, this.name, this.font);
      this.text.anchor.set(0.5, 0.5);
      this.text.alpha = 0;
      this.player.inputEnabled = true;
      return this.player.events.onInputUp.add(this.menu);
    };

    Player.prototype.buttonClick = function(button) {
      var b, button_text, j, k, len, len1, ref, ref1, req;
      console.log(button.params.name);
      console.log(button.params.sub);
      ref = this.buttons;
      for (j = 0, len = ref.length; j < len; j++) {
        b = ref[j];
        b.visible = false;
      }
      ref1 = this.button_texts;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        button_text = ref1[k];
        button_text.visible = false;
      }
      this.game.button_visible = false;
      req = window.requirements[this.game.cur_obstacle];
      console.log(button.params.sub, req.sub, req.users, button.params.name);
      if (button.params.sub === req.sub) {
        if (_.contains(req.users, button.params.name)) {
          req.users = _.without(req.users, button.params.name);
          if (_.isEmpty(req.users)) {
            this.game.cur_obstacle_text.kill();
            if (req.finish_callback != null) {
              req.finish_callback();
            }
            if (req.finish_text_list != null) {
              return this.game.multiscene(req.finish_text_list);
            } else {
              return this.game.cutscene(req.finish_text);
            }
          } else {
            return this.game.log("I don't think " + button.params.name + " can do this alone");
          }
        } else {
          return this.game.log(button.params.name + " isn't strong enough at " + button.params.sub + " to solve this problem");
        }
      } else {
        return this.game.log("This doesn't look like a " + button.params.sub + " problem");
      }
    };

    Player.prototype.menu = function() {
      var button, button_text, delta, initial, j, k, len, len1, pos, ref, ref1;
      if (this.game.button_visible || this.name === 'keish') {
        return;
      }
      pos = {};
      pos.x = Math.floor(this.player.x + this.player.width / 2);
      pos.y = Math.floor(this.player.y + this.player.height / 2);
      delta = 20;
      initial = 40;
      ref = this.buttons;
      for (j = 0, len = ref.length; j < len; j++) {
        button = ref[j];
        button.x = pos.x;
        button.y = pos.y - initial;
        button.visible = true;
        initial += delta;
      }
      initial = 40;
      ref1 = this.button_texts;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        button_text = ref1[k];
        button_text.x = pos.x;
        button_text.y = pos.y - initial;
        button_text.visible = true;
        initial += delta;
      }
      return this.game.button_visible = true;
    };

    Player.prototype.update = function(game, cursors, layers, p1) {
      if (this.player.body.x > 1920 && (this.game.game_end == null)) {
        this.game.multiscene(window.game_over_text);
        this.game.game_end = true;
        return;
      }
      this.player.body.velocity.x = 0;
      game.physics.arcade.collide(this.player, layers.collision);
      if ((cursors.right.isDown || cursors.left.isDown) && this.game.game_state === this.game["const"].movement) {
        if (cursors.left.isDown) {
          if (this !== p1) {
            if (this.player.body.position.x - p1.player.body.position.x > this.distance + 10) {
              this.player.body.velocity.x = -80;
            }
          } else {
            this.player.body.velocity.x = -80;
          }
          if (!this.playerLeft) {
            this.player.scale.x *= -1;
          }
          this.playerLeft = true;
        } else {
          if (this !== p1) {
            if (this.player.body.position.x - p1.player.body.position.x < -this.distance) {
              this.player.body.velocity.x = 80;
            }
          } else {
            this.player.body.velocity.x = 80;
          }
          if (this.playerLeft) {
            this.player.scale.x *= -1;
          }
          this.playerLeft = false;
        }
        this.player.animations.play('walk');
      } else if (cursors.down.isDown) {
        this.player.animations.play('talk');
      } else {
        this.player.animations.stop(null, true);
        this.player.frame = 0;
      }
      this.text.x = Math.floor(this.player.x + this.player.width / 2);
      this.text.y = Math.floor(this.player.y + this.player.height / 2 + 10);
      if (this.player.input.pointerOver()) {
        return this.text.alpha = 1;
      } else {
        return this.text.alpha = 0;
      }
    };

    return Player;

  })();

  Game = (function() {
    function Game(Phaser) {
      _.bindAll(this, 'preload', 'create', 'create_object', 'update', 'render', 'collide_with_obstacle');
      this.game = new Phaser.Game(800, 525, Phaser.AUTO, 'game-container', {
        preload: this.preload,
        create: this.create,
        update: this.update,
        render: this.render
      }, null, false, false);
      _.bind(this.log, this.game);
      _.bind(this.cutscene, this.game);
      _.bind(this.multiscene, this.game);
      this.game.log = this.log;
      this.game.cutscene = this.cutscene;
      this.game.multiscene = this.multiscene;
      this.game["const"] = {};
      this.game["const"].movement = "movement";
      this.game["const"].obstacle = "obstacle";
      this.game["const"].cutscene = "cutscene";
      this.game["const"].multiscene = "multiscene";
      this.game["const"].end = "end";
      this.input_timeout = false;
    }

    Game.prototype.preload = function() {
      this.player = new Player('keish', this.game, 17);
      this.player_list = [];
      this.player_list.push(new Player('nina', this.game, 19));
      this.player_list.push(new Player('liam', this.game, 17));
      this.player_list.push(new Player('miranda', this.game, 20));
      this.player_list.push(new Player('katie', this.game, 22));
      this.game.load.image('tiles', '/birthday/tutorials/source/assets/images/tiles_spritesheet.png');
      this.game.load.tilemap('level', '/birthday/tutorials/v2.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.spritesheet('button', '/birthday/assets/flixel-button.png', 80, 20);
      this.game.load.image('spider', '/birthday/assets/bio1.png');
      this.game.load.image('old_guy', '/birthday/assets/old-guy.png');
      this.game.load.image('gear', '/birthday/assets/gear.png');
      this.game.load.image('bridge', '/birthday/assets/bridge.png');
      return this.game.load.image('castle', '/birthday/assets/castle.gif');
    };

    Game.prototype.create_object = function(obj) {
      var lowered_bridge, ob_info, obstacle, position, raised_bridge;
      if (window.preferences.debug) {
        if (obj.name === 'obstacle1' || obj.name === 'obstacle2') {
          return;
        }
      }
      position = {
        x: obj.x + (this.map.tileHeight / 2),
        y: obj.y - (this.map.tileHeight / 2)
      };
      ob_info = window.requirements[obj.name];
      if (ob_info.additional != null) {
        raised_bridge = this.game.add.sprite(position.x + 60, position.y - 28, ob_info.additional);
        raised_bridge.scale.setTo(3, 3);
        raised_bridge.rotation = Math.PI / 2;
        lowered_bridge = this.game.add.sprite(position.x - 10, position.y + 45, ob_info.additional);
        lowered_bridge.scale.setTo(3, 3);
        lowered_bridge.visible = false;
        ob_info.finish_callback = (function(_this) {
          return function() {
            raised_bridge.kill();
            return lowered_bridge.visible = true;
          };
        })(this);
      }
      obstacle = this.game.add.sprite(position.x, position.y, ob_info.sprite);
      obstacle.name = obj.name;
      obstacle.scale.setTo(ob_info.scale, ob_info.scale);
      if (ob_info.kill != null) {
        ob_info.finish_callback = (function(_this) {
          return function() {
            return obstacle.kill();
          };
        })(this);
      }
      this.game.physics.enable(obstacle);
      obstacle.body.allowGravity = false;
      return obstacle;
    };

    Game.prototype.create = function() {
      var c, dist, i, j, k, len, obj, obstacle, ref, ref1, x;
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.map = this.game.add.tilemap('level');
      this.map.addTilesetImage('tiles_spritesheet', 'tiles');
      this.layers = {};
      this.map.layers.forEach((function(_this) {
        return function(layer) {
          var collision_tiles, name;
          name = layer.name;
          _this.layers[name] = _this.map.createLayer(name);
          if (layer.properties.collision) {
            collision_tiles = [];
            layer.data.forEach(function(row) {
              return row.forEach(function(tile) {
                if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                  return collision_tiles.push(tile.index);
                }
              });
            });
            return _this.map.setCollision(collision_tiles, true, name);
          }
        };
      })(this));
      this.layers[this.map.layer.name].resizeWorld();
      this.obstacles = [];
      ref = this.map.objects.objects;
      for (j = 0, len = ref.length; j < len; j++) {
        obj = ref[j];
        obstacle = this.create_object(obj);
        this.obstacles.push(obstacle);
      }
      console.log(this.obstacles);
      c = this.game.add.sprite(1800, 42, 'castle');
      c.scale.set(0.5, 0.5);
      this.player.createPlayer(1.5, 80, 244, 0);
      x = 50;
      dist = 20;
      for (i = k = 0, ref1 = this.player_list.length; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        this.player_list[i].createPlayer(1, 80 - i * 10, 255, dist + i * dist);
      }
      this.game.physics.arcade.gravity.y = 250;
      this.player.player.body.collideWorldBounds = true;
      this.game.camera.follow(this.player.player);
      if (window.preferences.cutscene_1) {
        this.game.multiscene(['(Click to continue)\n' + 'Once upon a time there was a teacher named Keish. ' + 'One day she had her boyfriend, Log, in to teach her kids computer ' + 'science.', 'Everything was going great until suddenly an evil Luddite mob broke in to the classroom. ', 'The Luddites kidnapped Log in protest of computer science and all technology.', 'Four brave students volunteered to help Keish rescue Log. She assigned the rest ' + 'practice problems to do while she was away.', 'With that she rushed off with her students to ' + 'find Log and save the day...\n(Use the arrows to move)']);
      }
      if (this.game.game_state == null) {
        this.game.game_state = this.game["const"].movement;
      }
      this.cursors = this.game.input.keyboard.createCursorKeys();
      return console.log("Game created");
    };

    Game.prototype.update = function() {
      var j, k, l, len, len1, len2, obstacle, player, ref, ref1, ref2, results;
      if ((this.game.game_state === this.game["const"].cutscene || this.game.game_state === this.game["const"].multiscene || (this.game.game_end != null)) && this.game.input.mousePointer.isDown) {
        if (this.input_timeout) {
          return;
        } else {
          this.input_timeout = true;
          setTimeout(((function(_this) {
            return function() {
              return _this.input_timeout = false;
            };
          })(this)), 1000);
        }
        this.game.cutscene_screen.kill();
        this.game.cutscene_text.kill();
        if (this.game.game_state === this.game["const"].cutscene) {
          this.game.game_state = this.game["const"].movement;
        } else {
          this.game.multiscene(this.game.multiscene_text_list);
        }
      } else {
        ref = _.union(this.player_list, [this.player]);
        for (j = 0, len = ref.length; j < len; j++) {
          player = ref[j];
          player.update(this.game, this.cursors, this.layers, this.player);
        }
        ref1 = this.obstacles;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          obstacle = ref1[k];
          this.game.physics.arcade.collide(this.player.player, obstacle, ((function(_this) {
            return function() {
              return console.log("collision");
            };
          })(this)), ((function(_this) {
            return function() {
              _this.collide_with_obstacle(obstacle);
              return false;
            };
          })(this)));
        }
      }
      ref2 = _.union(this.player_list, [this.player]);
      results = [];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        player = ref2[l];
        results.push(player.player.body.y = player.initial_y);
      }
      return results;
    };

    Game.prototype.collide_with_obstacle = function(obstacle) {
      var ob_info, push_down, t;
      this.game.game_state = this.game["const"].obstacle;
      this.game.cur_obstacle = obstacle.name;
      ob_info = window.requirements[obstacle.name];
      push_down = '\n\n\n\n\n';
      t = this.game.log(push_down + ob_info.problem_text, {}, false);
      this.game.cur_obstacle_text = t;
      return this.obstacles = _.without(this.obstacles, obstacle);
    };

    Game.prototype.render = function() {
      if (window.preferences.debug) {
        return this.game.debug.inputInfo(32, 32);
      }
    };

    Game.prototype.log = function(text, font_changes, exit) {
      var new_font, t;
      if (font_changes == null) {
        font_changes = {
          fill: '#000'
        };
      }
      if (exit == null) {
        exit = true;
      }
      new_font = {};
      _.extend(new_font, window.cutscene_font, font_changes);
      t = this.add.text(this.camera.x + this.camera.width / 2, 70, text, new_font);
      t.anchor.set(0.5, 0.5);
      if (exit) {
        setTimeout(((function(_this) {
          return function() {
            return t.kill();
          };
        })(this)), 2500);
      }
      return t;
    };

    Game.prototype.cutscene = function(text) {
      var data, t;
      if (!this.cutscene_background) {
        data = ['3333', '3333', '3333'];
        this.cutscene_background = this.create.texture('solid', data, 200, 200);
      }
      this.cutscene_screen = this.add.sprite(this.camera.x, 0, 'solid');
      this.game_state = this["const"].cutscene;
      t = this.log(text, {}, false);
      return this.cutscene_text = t;
    };

    Game.prototype.multiscene = function(text_list) {
      var cur_text;
      if (text_list.length === 0) {
        this.game_state = this["const"].movement;
        return;
      }
      cur_text = text_list[0];
      this.multiscene_text_list = _.without(text_list, cur_text);
      this.cutscene(cur_text);
      return this.game_state = this["const"].multiscene;
    };

    return Game;

  })();

  window.main = (function(_this) {
    return function() {
      return window.game = new Game(Phaser);
    };
  })(this);

}).call(this);
