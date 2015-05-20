import Em from 'ember';
import Cell from './game-grid/cell';
import Snake from './game-grid/snake';

// represents the game grid
export default Em.Component.extend({
  actions: {
    eatFrog: function(){
      this.sendAction('eatFrog');
      this.decrementProperty('currentFrogs', 1);
      this.get('putFrogsInGrid').bind(this)();
    }
  },

  // 'newGame', 'gameOn', 'gameFinished'
  gameState: null,

  onGameStateChange: function(){
    if(this.get('gameState') === 'newGame'){
      var startX = 0, startY = 0;

      this.resetBoard();
      this.putFrogsInGrid();
      this.get('snake').start(startX, startY);
      this.set('gameState', 'gameOn');
    } else if(this.get('gameState') === 'gameFinished'){
      // explosion fx
      Em.$('td[class^="snake-head"]').append('<div class="explosion"><img src="assets/images/explosion.gif?_='+Math.random()+'" /></div>');
      Em.run.later(function(){Em.$('.explosion').remove();}, 3000);
    }
  }.observes('gameState'),

  // grid dimensions [rows,columns]
  dimensions: [20, 20],

  // AI object responsible for controlling the behaviour of the snake
  snake: null,

  maxFrogs: 3,
  currentFrogs: 0,
  // assumes that we have at least 2 places to put the frogs
  putFrogsInGrid: function(){
    var freeCells = this.get('freeCells'), freeCellKeys = Object.keys(freeCells),
      randomFreeCellIndices = [], randomVal, grid = this.get('grid'),
      currentFrogs = this.get('currentFrogs'),
      frogsToAdd = this.get('maxFrogs') - currentFrogs,
      self = this;

    if(freeCells.length === 0){
      this.set('gameState', 'gameFinished');
    }

    for(let i=0; i < frogsToAdd; i++){
      do {
        randomVal = Math.floor(Math.random() * freeCellKeys.length);
      } while(randomFreeCellIndices.contains(randomVal));

      randomFreeCellIndices.push(randomVal);
    }

    randomFreeCellIndices.forEach(function(i){
      var freeCellInd = freeCellKeys[i];
      grid[freeCells[freeCellInd][0]][freeCells[freeCellInd][1]].set('entity', 'frog');
      self.incrementProperty('currentFrogs', 1);
    });
  },

  grid: null,
  freeCells: null,

  resetBoard: function(){
    var grid = Em.A(), dimensions = this.get('dimensions');

    this.set('freeCells', Em.Object.create());

    for(let i=0; i < dimensions[0]; i++){
      var row = [];

      for(let j=0; j < dimensions[1]; j++){
        row.push(Cell.create({location: [i,j], parentController: this, entity: 'empty'}));
      }

      grid.push(row);
    }

    this.setProperties({
      'grid': grid,
      'currentFrogs': 0
    });
  },

  didInsertElement: function(){
    this.resetBoard();
    this.set('snake', Snake.create({parentController: this}));
  }
});
