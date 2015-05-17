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
  baseHeartBeat: 40000,
  timer: null,

  start: function(startRow, startCol){
    var doMove = this.get('doMove'), baseHeartBeat = this.get('baseHeartBeat'), timer = this.get('timer'), self = this, dimensions = this.get('parentController.dimensions'), heartBeat = baseHeartBeat/(dimensions[0]*dimensions[1]);

    // set the start game defaults
    this.setProperties({
      'headPosition': [startRow, startCol],
      'body' : [],
      'direction' : [0, 1, '-right']
    });

    this.get('parentController.grid')[startRow][startCol].set('entity', 'snake-head' + this.get('direction')[2]);

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
      var isNotSelfCollided = body.every(function(bodyPart) {
        return !(bodyPart[0] === newHeadPosRow && bodyPart[1] === newHeadPosColumn);
      });

      // game is over since the user went out of bounds or hit its own body
      if(!isWithinBounds || !isNotSelfCollided) {
        parentController.set('gameState', 'gameFinished');
      } else { // figure out the movement
        var grid = parentController.get('grid'), oldHeadPos = grid[headPosition[0]][headPosition[1]],
          newHeadPost = grid[newHeadPosRow][newHeadPosColumn];

        // check if we ate a frog
        if(newHeadPost.get('entity') === 'frog'){
          parentController.send('eatFrog');
          body.push([headPosition[0], headPosition[1]]);
          grid[headPosition[0]][headPosition[1]].set('entity', 'snake-body' + direction[2]);
        } else {
          var bodyTail = body.shift();
          if(bodyTail !== undefined){
            grid[bodyTail[0]][bodyTail[1]].set('entity', 'empty');
            grid[headPosition[0]][headPosition[1]].set('entity', 'snake-body' + direction[2]);
            body.push([headPosition[0], headPosition[1]]);
          } else {
            oldHeadPos.set('entity', 'empty');
          }
        }

        if(body.length > 0){
          var tailEntity = grid[body[0][0]][body[0][1]].entity.replace('snake-body', 'snake-tail');
          grid[body[0][0]][body[0][1]].set('entity', tailEntity);
        }

        newHeadPost.set('entity', 'snake-head' + direction[2]);
        this.set('headPosition', [newHeadPosRow, newHeadPosColumn]);
      }
    } else {
      clearInterval(this.get('timer'));
    }
  },

  init: function(){
    var self = this, isSafeNewDirection = this.get('isSafeNewDirection').bind(this);

    Em.$(document).keydown(function(event) {
      var key = event.which;

      if((key === 38 || key === 87) && isSafeNewDirection([-1,0])){ // up
        self.set('direction', [-1,0, '-up']);
      } else if((key === 40 || key === 83) && isSafeNewDirection([1,0])){ // down
        self.set('direction', [1,0, '-down']);
      } else if((key === 37 || key === 65) && isSafeNewDirection([0,-1])){ // left
        self.set('direction', [0,-1, '-left']);
      } else if((key === 39 || key === 68) && isSafeNewDirection([0,1])){ // right
        self.set('direction', [0,1, '-right']);
      }
    });
  },

  // noob friendly check to prevent accidental suicides
  isSafeNewDirection: function(newDirection){
    if(this.get('body').length > 0){
      var direction = this.get('direction');

      if(direction[0] + newDirection[0] === 0 && direction[1] + newDirection[1] === 0){
        return false;
      }
    }

    return true;
  }
});
