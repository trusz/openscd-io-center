import { LitElement, html, css, property, customElement } from "lit-element";

import '@material/mwc-icon';

@customElement("openscd-button")
export class OpenscdButton extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) icon = "";
  @property({ type: String }) variant: 'primary' | 'secondary' | 'outline' | 'round' = 'primary';
  @property({ type: Boolean }) disabled = false;

  // Button click handler
  private _handleClick(e: Event) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent("button-click", { detail: e }));
    }
  }

  render() {
    return html`
      <button
        class="button ${this.variant}"
        ?disabled="${this.disabled}"
        @click="${this._handleClick}"
      >
        ${this.icon ? html`<mwc-icon class="button-icon">${this.icon}</mwc-icon>` : ''}
        ${this.label ? html`<span class="button-label">${this.label}</span>` : ''}
      </button>
    `;
  }

  static styles = css`
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
}
