'use strict'

import { componentSelector } from "/services/componentSelector.js";

(async () => {

  const res             = await fetch('/components/volume-control/VolumeControl.html');
  const textTemplate    = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

  class VolumeControl extends HTMLElement {

    constructor() {
      
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();
      
    }

    // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot = this.attachShadow({mode: 'open'});
      const instance = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);

      let element = this.shadowRoot.querySelector('#range');

      // Setup a input listener on <volume-control>
      element.addEventListener('input', e => {

        // Don't do shit when disabled
        if (this.disabled) {
          return;
        }

        this.changeVolume(e.target);
      });

      this.element = this.shadowRoot.querySelector('#range');
    }

    // Setter used by power switch
    set value(value) {
      this.element.value = value;
    }

    get value() {
      return this.element.getAttribute('value');
    }

    toggleDisabled(task) {
      this.shadowRoot.querySelector('#range').disabled = this.shadowRoot.querySelector('#range').disabled ? false : true;
    }

    // Change volume with slider and set value to number field
    changeVolume(element) {
      let VolumeDisplay       = componentSelector.find('volume-display');
          VolumeDisplay.value = element.value;
    }

  }

  // Define this awesome element
  customElements.define('volume-control', VolumeControl);

})();