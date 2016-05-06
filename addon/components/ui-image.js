import Ember from 'ember';
import SharedStylist from 'ember-cli-stylist/mixins/shared-stylist';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line
import layout from '../templates/components/ui-image';
window.Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};

window.Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};
const styleBindings = [
  'height', 'width', 'maxWidth', 'minWidth', 'maxHeight', 'border',
  'minHeight', 'borderRadius', 'objectFit', 'objectPosition', 'animationDuration'
];

const uiImage = Ember.Component.extend(SharedStylist, {
  layout: layout,
  tagName: '',
  init() {
    this._super(...arguments);
    this.fetchImage();
  },
  srcObserver: observer('src', function() {
    this.fetchImage();
  }),

  aspect: null,
  _aspect: computed('aspect', function() {
    const aspect = this.get('aspect');
    const defaultAspect = 3 / 2;

    return isNaN(aspect) ? aspect.split(':')[0] / aspect.split(':')[1] : aspect ? aspect : defaultAspect;
  }),
  naturalAspect: computed('naturalWidth', 'naturalHeight', function() {
    const {naturalWidth, naturalHeight} = this.getProperties('naturalWidth', 'naturalHeight');
    if(naturalWidth && naturalHeight) {
      return Math.floor(naturalWidth / naturalHeight * 1000) / 1000;
    }
  }),
  height: computed('_aspect','_initialized', {
    set(_, value) {
      return value;
    },
    get() {
      const parentWidth = $(`#${get(this, 'elementId')}`).width();
      return  parentWidth ? parentWidth / this.get('_aspect') : '250px';
    }
  }),
  display: null,
  objectFit: computed('display', function() {
    switch (this.get('display')) {
    case 'cover':
    case 'contain':
      return this.get('display');
    case 'clip':
      return 'none';
    default:
      return null;
    }
  }),
  _orientation: computed('_aspect', function() {
    return this.get('_aspect') > 1 ? 'landscape' : 'portrait';
  }),
  useLowRes: false, // allow config to choose initial image
  lowResPrefix: '',
  lowResPostfix: '_init',
  styleBindings: styleBindings,
  initialSrc: null, // explicitly state initial image
  _initialSrc: computed('initialSrc', 'useLowRes', 'src', function() {
    const {useLowRes, lowResPostfix, lowResPrefix, initialSrc} = this.getProperties('useLowRes', 'lowResPostfix', 'lowResPrefix', 'useLowRes');
    let src = this.get('src');
    if (initialSrc) { return initialSrc; }

    if(src) {
      const [, filename, extension] = src.match(/(.*)(\..+)/);
      return useLowRes ? `${lowResPrefix}${filename}${lowResPostfix}${extension}` : null;
    } else {
      return '';
    }
  }),
  breakpoints: null,
  backgroundColor: '#eeeeee',
  background: computed.alias('backgroundColor'),
  transitionIn: '1s',
  transitionOut: '0.3s',
  animationDuration: computed('transitionIn', {
    set(_, value) {
      return value;
    },
    get() {
      return this.get('transitionIn');
    }
  }),
  animationName: 'fadeOut',

  borderRadius: null,
  _mask: observer('mask', function()  {
    const mask = this.get('mask');
    this.set('borderRadius', null);
    this.set('clip', null);
    switch(mask) {
    case 'circle':
      this.set('borderRadius', '50%');
      return;
    case 'rounded':
      this.set('borderRadius', '1em');
      return;
    case 'pow':
    case 'star':
    case 'cross':
    case 'left':
    case 'right':
      this.set('clip', ` clip-${mask}`);
      return;
    }
  }),
  _delaySecondImage: 100,
  fetchImage() {
    const {src, _initialSrc} = this.getProperties('src', '_initialSrc');
    if (_initialSrc) {
      // this.set('_src', _initialSrc);
      run.later(() => {
        this.set('_background', src);
      }, this._delaySecondImage);
    } else {
      this.set('_src', src);
    }
  },

  actions: {
    loadedInitialImage() {
      $(`#init-img-${this.elementId}`).addClass('transition-in');
      this.set('animationDuration', this.get('transitionOut'));
    },
    loadedFinalImage() {
      $(`#img-${this.elementId}`).addClass('ready');
      $(`#init-img-${this.elementId}`).removeClass('transition-in');
      $(`#init-img-${this.elementId}`).addClass('transition-out');
    }
  }

});

uiImage.reopenClass({
  positionalParams: ['src']
});

uiImage[Ember.NAME_KEY] = 'ui-image';
export default uiImage;
