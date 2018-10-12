'use strict';

import { audioPlayer } from "/services/audioPlayer.js";
import { componentSelector } from "/services/componentSelector.js";

(async () => {

  const res             = await fetch('/components/power-switch/PowerSwitch.html');
  const textTemplate    = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

  class PowerSwitch extends HTMLElement {

    constructor() {
      
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();

      // Default off
      let on = false;

      // Setup a click listener on <power-switch>
      this.addEventListener('click', element => {
        this.init(element);
      });
    }

    // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot = this.attachShadow({mode: 'open'});
      const instance = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);
    }

    init(element) {

      // Toggle on/off
      this.on = !this.on;

      // Get volume elements
      let VolumeDisplay   = componentSelector.find('volume-display');
      let VolumeControl   = componentSelector.find('volume-control');
      let PageToggles     = componentSelector.find('page-toggle');

      // Change class of switch
      toggleClass(element, 'on');

      // When player is started
      if(this.on) {

        // Try creating the audiocontect, will fail in unsuported browsers
        let audioContext  = audioPlayer.preloadAudio();

        // Set default volume
        VolumeDisplay.value = 50;
        VolumeControl.value = 50;
        VolumeControl.toggleDisabled();
        PageToggles[0].checked = true;
        
      } 

      // When player is shut down
      else {

        // Get all pads
        let pads = componentSelector.find('pad-render');

        // Loop through padds, disable and change class
        for (var i = pads.length - 1; i >= 0; i--) {
          pads[i].toggleLoading('off');
        }

        // TODO: Close the context and buffer 
        audioContext.close();

        // Reset volume
        VolumeDisplay.value = null;
        VolumeControl.value = 50;
        VolumeControl.toggleDisabled();
      }
    }

    get powerStatus() {
      return this.on;
    }

  }

  // Define this awesome element
  customElements.define('power-switch', PowerSwitch);

})();