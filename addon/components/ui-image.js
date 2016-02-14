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
  'height', 'width', 'maxWidth', 'minWidth', 'maxHeight',
  'minHeight', 'borderRadius', 'backgroundColor', 'objectFit', 'objectPosition'
];

const uiImage = Ember.Component.extend(SharedStylist, {
  layout: layout,
  tagName: '',
  init(...args) {
    this._super(args);
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
  useCache: false, // cache using localStorage
  ttl: '14 days',
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
  width: computed('elementId', 'display', 'naturalAspect', {
    set(_, value) {
      return value;
    },
    get() {
      const imageDom = `#img-${this.elementId}`;
      const $parent = window.$(imageDom).parent();
      const width = $parent.innerWidth();

      this.set('paddingLeft', null);
      this.set('paddingRight', null);
      return Math.floor(width * 10) / 10;
    }
  }),
  height: computed('elementId',{
    set(_, value) {
      return value;
    },
    get() {
      const imageDom = `#img-${this.elementId}`;
      const $parent = window.$(imageDom).parent();
      const width = $parent.width();
      const aspect = this.get('_aspect');
      return Math.floor(width * (1 / aspect) * 10) / 10;
    }
  }),
  borderRadius: null,
  _mask: observer('mask', function()  {
    this.set('borderRadius', null);
    switch(this.get('mask')) {
    case 'circle':
      this.set('borderRadius', '50%');
      return;
    case 'rounded':
      this.set('borderRadius', '1em');
      return;
    case 'pow':
      this.set('clipPath', 'pow');
      return
    }
  }),
  _delaySecondImage: 1500,
  fetchImage() {
    const {src, _initialSrc} = this.getProperties('src', '_initialSrc');
    if (_initialSrc) {
      this.set('_src', _initialSrc);
      run.later(() => {
        this.set('_background', src);
      }, this._delaySecondImage);
    } else {
      this.set('_src', src);
    }
  },

  actions: {
    loadedBackgroundImage() {
      this.set('_src', this.get('src'));
    }
  }

});

uiImage.reopenClass({
  positionalParams: ['src']
});

uiImage[Ember.NAME_KEY] = 'ui-image';
export default uiImage;
