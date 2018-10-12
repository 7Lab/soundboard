'use strict';

import { componentSelector } from "/services/componentSelector.js";

let page;

(async () => {

  const res             = await fetch('/components/page-toggle/PageToggle.html');
  const textTemplate    = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

  class PadsRender extends HTMLElement {

    constructor() {
      
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();
  
      this.addEventListener('click', e => this._toggleChecked(e.target.dataset.id));
    }

    // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot  = this.attachShadow({mode: 'open'});
      const instance    = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);

      this.element = this.shadowRoot.querySelector('input');
    }

    set checked(value) {
      if (value) {
        this.element.setAttribute('checked', '');
      }
      else {
        this.element.removeAttribute('checked');
      }
    }

    get checked() {
      return this.element.getAttribute('checked');
    }

    set page(page_id) {
      page = page_id;

      // Create custom event
      var pageChangeEvent = new CustomEvent('finishedLoadingEvent', {
        detail: {
          page_id: page
        },
        bubbles: false
      });

      // Dispatch the event
      document.dispatchEvent(pageChangeEvent);

    }

    get page() {
      return page;
    }

    _toggleChecked(page_id) {

      // Set current page
      let launchPad         = document.querySelector('launch-pad');
      launchPad.currentPage = page_id;

      // Switch checkbox
      this.checked = !this.checked;

      // Change page ID
      this.page = page_id;

      // Get all page toggles
      let toggles = componentSelector.find('page-toggle');

      // Loop through toggles, check page_id and disable
      for (var i = toggles.length - 1; i >= 0; i--) {

        if(toggles[i].dataset.id != page_id) {
          toggles[i].shadowRoot.querySelector('input').checked = false;
        }

      }

    }

  }

  customElements.define('page-toggle', PadsRender);

})();