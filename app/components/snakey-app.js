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
      localStorage.setItem(this.get('highScoreLocalStorageKey'), this.get('score'));
      this.set('highScore', this.get('score'));
    }
  }.observes('score'),

  didInsertElement: function() {
    if(typeof(Storage) !== "undefined") {
      var highScore = localStorage.getItem(this.get('highScoreLocalStorageKey')), infScrolling = localStorage.getItem('snakey.infScrolling'), speedUp = localStorage.getItem('snakey.speedUp');

      if(highScore){
        this.set('highScore', highScore);
      }
      if(infScrolling){
        this.set('infScrolling', JSON.parse(infScrolling));
      }
      if(speedUp){
        this.set('speedUp', JSON.parse(speedUp));
      }
    }
  },

  onOptionsChange: function(self, option){
    if(typeof(Storage) !== "undefined"){
      localStorage.setItem('snakey.' + option, this.get(option));
      this.set('score', 0);
      if(localStorage.getItem(this.get('highScoreLocalStorageKey'))){
        this.set('highScore', localStorage.getItem(this.get('highScoreLocalStorageKey')));
      } else {
        this.set('highScore', 0);
      }
    }
  }.observes('speedUp', 'infScrolling'),

  onInfScrollingChange: function(){
    if(typeof(Storage) !== "undefined"){
      localStorage.setItem('snakey.infScrolling', this.get('infScrolling'));
    }
  }.observes('infScrolling'),

  incrementScoreBy: 100,

  highScore: 0,

  score: 0,

  speedUp: false,

  infScrolling: false,

  // return the highscore by key based on the triggered options
  highScoreLocalStorageKey: function(){
    return 'snakey.' + [this.get('speedUp'),this.get('infScrolling')].join(',') +'.highScore';
  }.property('speedUp', 'infScrolling'),

  gameState: 'noGame'
});
