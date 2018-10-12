'use strict'

import { componentSelector } from "/services/componentSelector.js";

(async () => {

  const res             = await fetch('/components/LaunchPad.html');
  const textTemplate    = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

  class LaunchPad extends HTMLElement {

    constructor() {
      
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();

      this.current_page = 1;
      this.list_of_ids  = new Array();

    }

      // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot  = this.attachShadow({mode: 'open'});
      const instance    = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);

      document.addEventListener("finishedLoadingEvent", e => {
        
        // Get a list of pads
        let pads          = componentSelector.find('pad-render');
        let launchPad     = document.querySelector('launch-pad');
        let current_page  = launchPad.currentPage;

        let listOfIds = new Array();

        if(e.detail.listOfIds) {
          listOfIds           = e.detail.listOfIds;
          launchPad.listOfIds = e.detail.listOfIds;
        } else {
          listOfIds = launchPad.listOfIds;
        }

        // Activate all loaded pads/tracks
        for (var i = pads.length - 1; i >= 0; i--) {

          // Change data id of HTML object to ease operations
          var id = current_page + pads[i].dataset.id.substring(1);
          pads[i].dataset.id = id;

          // Check if new data id is present in the list 
          // of ids received from the buffer loader
          if(listOfIds.includes(pads[i].dataset.id)) {
            pads[i].toggleLoading('on');
          } else {
            pads[i].toggleLoading('off');
          }

        }

      });
    }

    set currentPage(value) {
      this.current_page = value;
    }

    get currentPage() {
      return this.current_page;
    }

    set listOfIds(value) {
      this.list_of_ids = value;
    }

    get listOfIds() {
      return this.list_of_ids;
    }

  }

  customElements.define('launch-pad', LaunchPad);

})();