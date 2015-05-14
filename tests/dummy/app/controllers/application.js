import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug, keys } = Ember;    // jshint ignore:line


export default Ember.Controller.extend({

  queryParams: ['imageSrc', 'borderMask', 'frameSize', 'sizePreset'],

  imageSrc: '/images/actress.png',
  imageChoices: [
    { id:'/images/jobs.png', name: 'Steve Jobs' },
    { id:'/images/actress.png', name: 'Actress' },
    { id:'/images/michelle-obama.jpg', name: 'Michelle Obama' }
  ],
  borderMasks: [
    { id: '', name: 'None'},
    { id: 'circle', name: 'Circle'},
    { id: 'rounded', name: 'Rounded'},
    { id: 'thumbnail', name: 'Thumbnail'},
    { id: 'circular-thumbnail', name: 'Circular Thumbnail'}
  ],
  borderMask: '',
  frameSize: 200,
  sizePresets: [
    { id: 'tiny', name: 'Tiny' },
    { id: 'small', name: 'Small' },
    { id: 'default', name: 'Default' },
    { id: 'large', name: 'Large' },
    { id: 'huge', name: 'Huge' },
    { id: 'portrait', name: 'Portrait' },
    { id: 'portrait-big', name: 'Big Portrait' },
  ],
  sizePreset: 'default',
  squareConstraint: true,
  magicSizePreset: on('init', computed('squareConstraint','sizePreset', function() {
    let { sizePreset, squareConstraint } = this.getProperties('sizePreset','squareConstraint');
    return squareConstraint ? sizePreset : `${sizePreset}.unconstrained`;
  })),
  explicitWidth: 125,
  explicitHeight: 125,
  explicitSize: 125

});