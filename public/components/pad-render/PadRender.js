'use strict'

import { audioPlayer }        from "/services/audioPlayer.js";
import { componentSelector }  from "/services/componentSelector.js";
import { fileUploader }       from "/services/fileUploader.js";
import { storageHandler }     from "/services/storageHandler.js";


(async () => {

  const res             = await fetch('/components/pad-render/PadRender.html');
  const textTemplate    = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

  class PadRender extends HTMLElement {

    constructor() {
      
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();

      this.addEventListener('mousedown', e => {

        let VolumeDisplay   = componentSelector.find('volume-display');
        let volume          = VolumeDisplay.value;

        // Add active class
        toggleClass(e.target.shadowRoot.querySelector('button'), 'active');

        // Play sound with correct track and volume
        audioPlayer.playSound(e.target.dataset.id, 0, volume);
      });

      this.addEventListener('mouseup', e => {

        // Stop track on release
        audioPlayer.stopSound();

        // Remove active class
        toggleClass(e.target.shadowRoot.querySelector('button'), 'active');
      });

      // Set drop effect to move
      this.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        // Add dropover class
        addClass(e.target.shadowRoot.querySelector('button'), 'dropover')
      });

      // Remove drop effect to move
      this.addEventListener('dragleave', e => {

        // Remove dropover class
        removeClass(e.target.shadowRoot.querySelector('button'), 'dropover')
      });

      // Catch drop event and upload file
      this.addEventListener('drop', e => {
        e.preventDefault();

        // Get current power status
        let PowerSwitch   = componentSelector.find('power-switch');
        let power         = PowerSwitch.powerStatus;

        // Only upload when power is on
        if(power) {
          this.upload(e);
        } 

      });
    }

    // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot  = this.attachShadow({mode: 'open'});
      const instance    = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);
    }

    toggleLoading(mode) {

      if(mode == 'off') {
        this.shadowRoot.querySelector('button').disabled = true;

        addClass(this.shadowRoot.querySelector('button'), 'is-loading');
      } else {
        this.shadowRoot.querySelector('button').disabled = false;

        removeClass(this.shadowRoot.querySelector('button'), 'is-loading');
      }

    }

    upload(e) {

      // Add class to animate upload, remove dropover class
      addClass(this.shadowRoot.querySelector('button'), 'upload');
      removeClass(this.shadowRoot.querySelector('button'), 'dropover');

      let files   = e.dataTransfer.files;
      let pad_id  = e.target.dataset.id;

      // Check if file is smaller then 1mb, 
      // otherwise abort
      if(files[0].size > 1 * 1024 * 1024) {
        
        alert('File is to large, 10mb max.');

        // Remove upload class
        removeClass(this.shadowRoot.querySelector('button'), 'upload');

        return;
      }

      // Upload file with fileUploader
      fileUploader.uploadFile(files[0], pad_id)
      
      .then(url =>{

        // Save new url in database
        storageHandler.storeData('tracks', pad_id, url)

          .then(() =>{

            // Reload audio. TODO efficient way?
            audioPlayer.audioLoading.loadBuffer(url, pad_id);

            // Remove upload class
            removeClass(this.shadowRoot.querySelector('button'), 'upload');

            // Get list of id's, add new id and set new list (needed for propper page switching)
            let launchPad  = document.querySelector('launch-pad');
            let list       = launchPad.listOfIds; 
                list.push(pad_id);
            launchPad.listOfIds = list;

            // Activate tile
            this.toggleLoading('on');
          })

          .catch(error => {
            console.log(error);
          });

      })
      
      .catch(error => {
        console.log(error);
      });
    }

  }
  customElements.define('pad-render', PadRender);

})();