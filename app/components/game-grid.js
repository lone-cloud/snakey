import Em from 'ember';
import Cell from './game-grid/cell';
import Snake from './game-grid/snake';

export default Em.Component.extend({
  actions: {
    eatFrog: function(){
      this.sendAction('eatFrog');
    }
  },

  gameState: null,

  onGameStateChange: function(){
    if(this.get('gameState') === 'newGame'){
      this.resetBoard();
      this.putFrogsInGrid();
      this.get('gridCells')[0][0].state = 'snake-head';
      this.get('snake').start();
      this.set('gameState', 'gameOn');
    }
  }.observes('gameState'),

  // grid dimensions [x,y]
  dimensions: [25, 25],

  // AI object responsible for controlling the behaviour of the snake
  snake: null,

  maxFrogs: 2,
  currentFrogs: 0,
  // assumes that we have at least 2 places to put the frogs
  putFrogsInGrid: function(){
    var freeCells = this.get('freeCells'), freeCellKeys = Object.keys(freeCells),
      randomFreeCellIndices = [], randomVal, gridCells = this.get('gridCells'),
      currentFrogs = this.get('currentFrogs'),
      frogsToAdd = this.get('maxFrogs') - currentFrogs,
      self = this;

    for(let i=0; i < frogsToAdd; i++){
      do {
        randomVal = Math.floor(Math.random() * freeCellKeys.length);
      } while(randomFreeCellIndices.contains(randomVal));

      randomFreeCellIndices.push(randomVal);
    }

    randomFreeCellIndices.forEach(function(i){
      var freeCellInd = freeCellKeys[i], x = freeCells[freeCellInd][0], y = freeCells[freeCellInd][1];
      gridCells[x][y].state = 'frog';
      self.set('currentFrogs', (currentFrogs+1));
      delete freeCells[freeCellInd];
    });
  },

  gridCells: null,
  freeCells: {},

  resetBoard: function(){
    var gridCells = [], dimensions = this.get('dimensions'), freeCells = {};

    for(let i=0; i<dimensions[0]; i++){
      var row = [];

      for(let j=0; j<dimensions[1]; j++){
        row.push(Cell.create());
        freeCells[i + ',' + j] = [i,j];
      }

      gridCells.push(row);
    }

    this.setProperties({
      'gridCells': gridCells,
      'freeCells': freeCells
    });
  },

  didInsertElement: function(){
    this.resetBoard();
    this.set('snake', Snake.create({parentController: this}));
  }
});
