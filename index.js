/* jshint node: true */
'use strict';

module.exports = {
  name: 'ui-image',
  description: 'A simple image wrapper with sugar sprinkled on top',
  included: function(app, parentAddon) {
    this._super.included(app);
    const target = (parentAddon || app);
    const bower = target.bowerDirectory;
    target.import('vendor/ui-image/ui-image.css');
    target.import(bower + '/fetch/fetch.js');
    target.import(bower + '/es6-promise/promise.js');


  }
};
