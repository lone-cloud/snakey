import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    newGame: function(){
      this.set('score', 0);
      this.set('gameState', 'newGame');
    },

    score: function(){
      this.incrementProperty('score', this.get('incrementScoreBy'));
    }
  },

  onScoreChange: function(){
    if(typeof(Storage) !== "undefined" && (this.get('score') > this.get('highScore'))){
      localStorage.setItem('snakey.highScore', this.get('score'));
      this.set('highScore', this.get('score'));
    }
  }.observes('score'),

  didInsertElement: function() {
    if(typeof(Storage) !== "undefined") {
      var highScore = localStorage.getItem('snakey.highScore');

      if(highScore){
        this.set('highScore', highScore);
      }
    }
  },

  incrementScoreBy: 100,

  highScore: 0,

  score: 0,

  scored: false,

  gameState: 'noGame'
});
