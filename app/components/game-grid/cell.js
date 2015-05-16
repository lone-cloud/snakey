import Em from 'ember';

export default Em.Object.extend({
  state: 'empty',

  class: function(){
    return this.get('state') + '-cell';
  }.property('state')
});
