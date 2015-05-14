import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug, keys } = Ember;    // jshint ignore:line
const htmlSafe = Ember.String.htmlSafe;

import layout from '../templates/components/ui-image';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'img',
  classNames: ['ui-image'],
  classNameBindings: ['_borderMask','_size', 'explicit:explicit-dimensions'],
  attributeBindings: ['src','_style:style'],
  
  borderMask: null,
  _borderMask: on('didInsertElement', computed('borderMask', function() {
    return this.get('borderMask');
  })),
  size: null,
  _size: on('didInsertElement', computed('size', function() {
    const reflect = new A(['fill','tiny','small','default','large','huge','portrait','portrait-big']);
    let size = this.get('size');
    let style = this.get('style');
    const isUnconstrained = size && String(size).indexOf('.unconstrained') !== -1;
    this.set('explicit',false);
    
    if(isUnconstrained) {
      return size.split('.').join(' ');
    }    
    if(reflect.contains(size)) {
      style.width = null;
      style.height = null;
      this.notifyPropertyChange('style');
      return size;
    } else {
      this.set('explicit',true);
      size = isNaN(Number(size)) ? size : `${size}px`;
      style.width = size;
      style.height = size;
      this.notifyPropertyChange('style');
      return ''; // no CSS class, size handled through style attribute      
    }
    
  })),
  width: null,
  _width: on('init', observer('width', function() {
    run.next( () => {
      this.setDimensions('width');      
    });
  })),
  height: null,
  _height: on('init', observer('height', function() {
    run.next( () => {
      this.setDimensions('height');      
    });
  })),
  setDimensions: function(prop) {
    const value = this.get(prop);
    let style = this.get('style');
    if(!value) {
      style[prop]=null;
      this.set('explicit',false);
    } else {
      style[prop] = isNaN(Number(value)) ? value : `${value}px`; 
      this.set('explicit',true);
      this.notifyPropertyChange('style');
    }
    return style[prop];
  },
  style: {},
  _style: on('didInsertElement', computed('style', function() {
    const style = this.get('style');
    const styleAttrs = keys(style);
    let styleProps = [];
    for( let i in styleAttrs ) {
      const property = styleAttrs[i];
      const propertyValue = style[property];
      if(propertyValue) {
        styleProps.push(`${styleAttrs[i]}: ${propertyValue}`);
      } else {
        delete styleProps[i];
      }
    }
    return htmlSafe(styleProps.join('; '));
  })),
  
  // dont want the default behaviours getting in the way of these properties
  _propertyRemapping: on('init', function() {
    new A(this.get('attributeBindings')).removeObject('size');
    new A(this.get('attributeBindings')).removeObject('height');
    new A(this.get('attributeBindings')).removeObject('width');
  })  
});
