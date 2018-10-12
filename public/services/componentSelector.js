'use strict'

class ComponentSelector {

	constructor() {
		
	}

	isCustomElement(el) {
		const isAttr = el.getAttribute('is');
	
		// Check for <super-button> and <button is="super-button">.
		return el.localName.includes('-') || isAttr && isAttr.includes('-');
	}

	find(query) {

		let nodes = document.querySelectorAll('*');

		for (let i = 0, el; el = nodes[i]; ++i) {

			if (this.isCustomElement(el) && (el.tagName.toLowerCase() == query)) {
				this.allCustomElements.push(el);
				return el[0];
			}
		
			// If the element has shadow DOM, dig deeper.
			if (this.isCustomElement(el) && el.shadowRoot) {

				let els = el.shadowRoot.querySelectorAll(query);
				return (els.length == 1) ? els[0]: els;
			}
		}
		
	}
}

export let componentSelector = new ComponentSelector();