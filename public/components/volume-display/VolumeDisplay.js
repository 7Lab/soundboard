(async () => {

  const res             = await fetch('/components/volume-display/VolumeDisplay.html');
  const textTemplate    = await res.text();

  // Parse and select the template tag here instead 
  // of adding it using innerHTML to avoid repeated parsing
  // and searching whenever a new instance of the component is added.
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, 'text/html').querySelector('template');

  class VolumeDisplay extends HTMLElement {

    constructor() {
      // If you define a constructor, always call super() first as it is required by the CE spec.
      super();
    }

    // Called when element is inserted in DOM
    connectedCallback() {
      const shadowRoot  = this.attachShadow({mode: 'open'});
      const instance    = HTMLTemplate.content.cloneNode(true);
            shadowRoot.appendChild(instance);

      this.element      = this.shadowRoot.querySelector('#volume');
    }

    // Setter user by power switch
    set value(value) {
      this.element.setAttribute('value', value);
    }

    get value() {
      return this.element.getAttribute('value');
    }

  }

  // Define this awesome element
  customElements.define('volume-display', VolumeDisplay);

})();