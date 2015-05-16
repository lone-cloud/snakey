import Em from 'ember';

// represents the snake behaviour on the board
export default Em.Object.extend({

  // set during snake creation
  parentController: null,

  // direction of the snake representing movement on [row,column]
  direction: null,

  headPosition: null,
  body: null,

  // specifies the base speed at which the snake will move
  // the effective heartbeat will be scaled based on the size of the board
  baseHeartBeat: 75000,
  timer: null,

  start: function(startRow, startCol){
    var doMove = this.get('doMove'), baseHeartBeat = this.get('baseHeartBeat'), timer = this.get('timer'), self = this, dimensions = this.get('parentController.dimensions'), heartBeat = baseHeartBeat/(dimensions[0]*dimensions[1]);

    // set the start game defaults
    this.setProperties({
      'headPosition': [startRow, startCol],
      'body' : [],
      'direction' : [0, 1]
    });

    this.get('parentController.grid')[startRow][startCol].set('entity', 'snake-head');

    // TODO: is this necessary?
    if(timer !== null){
      clearInterval(timer);
    }

    this.set('timer', setInterval(function () {
      doMove.bind(self)();
      }, heartBeat));
  },

  doMove: function(){
    var parentController = this.get('parentController');

    // keep moving while the game is on
    if(parentController.get('gameState') === 'gameOn'){
      var direction = this.get('direction'), headPosition = this.get('headPosition'), body = this.get('body');
      var newHeadPosRow = headPosition[0] + direction[0], newHeadPosColumn = headPosition[1] + direction[1];

      var isWithinBounds = newHeadPosRow >= 0 && newHeadPosColumn >= 0 && newHeadPosRow < parentController.get('dimensions')[0] && newHeadPosColumn < parentController.get('dimensions')[1];
      var selfCollision = false;

      // game is over since the user went out of bounds or hit its own body
      if(!isWithinBounds || selfCollision){
        parentController.set('gameState', 'gameFinished');
      } else { // figure out the movement
        var oldHeadPos = parentController.get('grid')[headPosition[0]][headPosition[1]],
          newHeadPost = parentController.get('grid')[newHeadPosRow][newHeadPosColumn];

        // check if we ate a frog
        if(newHeadPost.get('entity') === 'frog'){
          parentController.send('eatFrog');
          body.push([headPosition[0], headPosition[1]]);
        }

        oldHeadPos.set('entity', 'empty');
        newHeadPost.set('entity', 'snake-head');
        this.set('headPosition', [newHeadPosRow, newHeadPosColumn]);
      }
    } else {
      clearInterval(this.get('timer'));
    }
  },

  init: function(){
    var self = this;

    Em.$(document).keydown(function(event) {
      var key = event.which;

      if(key === 38 || key === 87){ // up
        self.set('direction', [-1,0]);
      } else if(key === 40 || key === 83){ // down
        self.set('direction', [1,0]);
      } else if(key === 37 || key === 65){ // left
        self.set('direction', [0,-1]);
      } else if(key === 39 || key === 68){ // right
        self.set('direction', [0,1]);
      }
    });
  }
});
