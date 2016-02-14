import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { RSVP: {Promise, all, race, resolve, defer} } = Ember; // jshint ignore:line
const { inject: {service} } = Ember; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  aspectConfig: ['default'],
  maskConfig: ['none'],
  mask: computed.alias('maskConfig.0'),
  actions: {
    onAspectChange(hash) {
      this.set('aspectConfig', hash.values);
      this.set('display', hash.value);
      if(hash.value === 'default') {
        this.set('cover', false);
      }
      if(hash.value === 'natural-aspect') {
        this.set('cover', false);
      }
      if(hash.value === 'cover') {
        this.set('cover', true);
      }
    },
    onMaskChange(hash) {
      this.set('maskConfig', hash.values);
    }
  }

});
