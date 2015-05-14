import Ember from 'ember';

export default Ember.Object.extend({
  state: 'empty',

  class: function(){
    return this.get('state') + '-cell';
  }.property('state')
});
