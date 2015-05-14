import Ember from 'ember';

export default Ember.Component.extend({

  score: null,

  highScore: null,

  actions: {
    newGame: function(){
      this.sendAction('newGameClick');
    }
  }
});
