var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import {LitElement, html, css, property, customElement} from "../../../../../../_snowpack/pkg/lit-element.js";
import "../../../../../../_snowpack/pkg/@material/mwc-icon.js";
export let OpenscdButton = class extends LitElement {
  constructor() {
    super(...arguments);
    this.label = "";
    this.icon = "";
    this.variant = "primary";
    this.disabled = false;
  }
  _handleClick(e) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent("button-click", {detail: e}));
    }
  }
  render() {
    return html`
      <button
        class="button ${this.variant}"
        ?disabled="${this.disabled}"
        @click="${this._handleClick}"
      >
        ${this.icon ? html`<mwc-icon class="button-icon">${this.icon}</mwc-icon>` : ""}
        ${this.label ? html`<span class="button-label">${this.label}</span>` : ""}
      </button>
    `;
  }
};
OpenscdButton.styles = css`
    :host {
      display: inline-block;
    }

    /* General button styling */
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 1rem;
      font-size: 0.875rem;
      border: 1px solid var(--button-border-color, #ccc);
      border-radius: 999px; /* Fully rounded corners */
      background-color: var(--button-background-color, #fdfdfd);
      color: var(--button-text-color, #333);
      cursor: pointer;
      outline: none;
      transition: background-color 0.3s ease, border-color 0.3s ease;
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    /* Icon styling */
    .button-icon {
      font-size: 1rem;
      margin-right: 0.5rem;
      display: inline-flex;
    }

    /* If the icon is on the right, adjust the margin */
    .button .button-icon:last-child {
      margin-right: 0;
      margin-left: 0.5rem;
    }

    /* Hover effect */
    .button:hover {
      background-color: var(--button-hover-bg-color, #f0f0f0);
      border-color: var(--button-hover-border-color, #b3b3b3);
    }

    /* Disabled state */
    .button[disabled] {
      background-color: var(--button-disabled-bg-color, #f8f8f8);
      color: var(--button-disabled-text-color, #999);
      border-color: var(--button-disabled-border-color, #e0e0e0);
      cursor: not-allowed;
    }

    /* Outlined variant */
    :host([variant="outline"]) .button {
      background-color: transparent;
      border: 1px solid var(--button-outline-border-color, #007bff);
      color: var(--button-outline-text-color, #007bff);
    }

    :host([variant="outline"]) .button:hover {
      background-color: var(--button-outline-hover-bg-color, rgba(0, 123, 255, 0.1));
    }

    /* Round variant */
    :host([variant="round"]) .button {
      padding: 0.5rem;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      justify-content: center;
    }

    /* Custom padding for buttons with only an icon and no label */
    :host([icon-only]) .button {
      padding: 0.5rem;
    }
  `;
__decorate([
  property({type: String})
], OpenscdButton.prototype, "label", 2);
__decorate([
  property({type: String})
], OpenscdButton.prototype, "icon", 2);
__decorate([
  property({type: String})
], OpenscdButton.prototype, "variant", 2);
__decorate([
  property({type: Boolean})
], OpenscdButton.prototype, "disabled", 2);
OpenscdButton = __decorate([
  customElement("openscd-button")
], OpenscdButton);
