import Em from 'ember';

// represents a single grid cell
export default Em.Object.extend({
  // set during cell creation
  parentController: null,
  location: null,

  // name of the entity residing in the cell: 'empty', 'snake-head', 'snake-body' or 'frog'
  entity: null,

  // update the game-grid's freecells when the cell's entity changes
  onEntityChange: function(){
    var entity = this.get('entity'), freeCells = this.get('parentController.freeCells'), location = this.get('location'), freeCellsKey = location[0] + ',' + location[1];

    if(entity === 'empty'){
      freeCells[freeCellsKey] = [location[0],location[1]];
    } else {
      delete freeCells[freeCellsKey];
    }
  }.observes('entity'),

  init: function(){
    this.onEntityChange();
  },

  cellClass: function(){
    return this.get('entity') + '-cell';
  }.property('entity')
});
