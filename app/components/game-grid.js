import Ember from 'ember';
import Cell from './game-grid/cell';

export default Ember.Component.extend({
  // grid dimensions [x,y]
  dimensions: [100, 100],

  maxFrogs: 2,
  currentFrogs: 0,
  putFrogsInGrid: function(numOfFrogs){
    numOfFrogs;
  },

  gridCells: null,
  freeCells: null,

  didInsertElement: function(){
    var result = [], dimensions = this.get('dimensions'),
      numFrogs = this.get('maxFrogs'), freeCells = [];

    for(let i=0; i<dimensions[0]; i++){
      var row = [];
      for(let j=0; j<dimensions[1]; j++){
        row.push(Cell.create());
        freeCells.push([i,j]);
      }
      result.push(row);
    }

    this.setProperties({
      gridCells: result,
      freeCells: freeCells
    });
    this.putFrogsInGrid(numFrogs);
  }
});
