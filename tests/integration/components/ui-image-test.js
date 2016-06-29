import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-image', 'Integration | Component | ui image', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{ui-image}}`);

  assert.equal(this.$('img').length, 1);

  // Template block usage:"
  this.render(hbs`
    {{#ui-image}}
      template block text
    {{/ui-image}}
  `);

  assert.equal(this.$('img').length, 1);
});
