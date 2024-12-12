import { __decorate } from "../../../../../../_snowpack/pkg/tslib.js";
import { LitElement, html, css, property, customElement } from '../../../../../../_snowpack/pkg/lit-element.js';
let HintBox = class HintBox extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.title = 'Hint';
        this.headerColor = '#007bff';
        this.textColor = 'white';
        this.isMarked = false;
    }
    toggleOpen() {
        this.open = !this.open;
    }
    render() {
        return html `
      <div class="hint-header" @click="${this.toggleOpen}">
        <span class="hint-title">${this.title}</span>
        <span class="toggle-icon">▲</span>
      </div>
      <div class="hint-content">
        <slot></slot>
      </div>
    `;
    }
};
HintBox.styles = css `
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin: 1rem 0;
      background-color: #f9f9f9;
    }

    .hint-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 6px 6px 0 0;
      transition: background-color 0.3s ease;
      background-color: var(--header-bg-color, #007bff);
      color: var(--header-text-color, white);
    }

    .hint-title {
      margin: 0;
      font-size: 1rem;
      font-weight: bold;
    }

    .toggle-icon {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
      display: inline-block;
    }

    .hint-content {
      padding: 10px 12px;
      border-top: 1px solid #ccc;
      display: none;
      background-color: white;
      border-radius: 0 0 6px 6px;
    }

    :host([open]) .hint-content {
      display: block;
    }

    :host([open]) .toggle-icon {
      transform: rotate(180deg);
    }

    :host([isMarked]) .hint-header {
      background-color: #28a745;
    }

    :host([isMarked]):hover .hint-header {
      background-color: #218838;
    }

    :host(:not([isMarked])):hover .hint-header {
      background-color: #0056b3;
    }
  `;
__decorate([
    property({ type: Boolean, reflect: true })
], HintBox.prototype, "open", void 0);
__decorate([
    property({ type: String })
], HintBox.prototype, "title", void 0);
__decorate([
    property({ type: String })
], HintBox.prototype, "headerColor", void 0);
__decorate([
    property({ type: String })
], HintBox.prototype, "textColor", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], HintBox.prototype, "isMarked", void 0);
HintBox = __decorate([
    customElement('hint-box')
], HintBox);
export { HintBox };
//# sourceMappingURL=hint-box.js.map