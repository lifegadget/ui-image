/* jshint node: true */
'use strict';

module.exports = {
  name: 'ui-image',
  description: 'A simple image wrapper with sugar sprinkled on top',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/ui-image/ui-image.css');
  }
};
