import { __decorate } from "../../../../../_snowpack/pkg/tslib.js";
import { css, customElement, html, LitElement, property } from "../../../../../_snowpack/pkg/lit-element.js";
let IoCenterModal = class IoCenterModal extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.title = 'Modal Title';
        this.confirmText = 'Confirm';
        this.disabled = false;
        this.modalWidth = '40%';
        this.modalHeight = 'auto';
    }
    close() {
        this.open = false;
    }
    _handleConfirmClick() {
        if (!this.disabled) {
            this.close();
            this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true, detail: true }));
        }
    }
    _handleCloseClick() {
        this.close();
        this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true, detail: false }));
    }
    render() {
        return html `
      <div class="modal-content" style="width: ${this.modalWidth}; height: ${this.modalHeight};">
        <div class="modal-header">
          <slot name="header">
            <span>${this.title}</span>
            <button class="close-button" @click="${this._handleCloseClick}">&times;</button>
          </slot>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="${this._handleCloseClick}">Cancel</button>
          <button class="confirm-button" ?disabled="${this.disabled}" @click="${this._handleConfirmClick}">
            ${this.confirmText}
          </button>
        </div>
      </div>
    `;
    }
};
IoCenterModal.styles = css `
    :host {
      display: none;
      position: fixed;
      z-index: 5;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
    }

    :host([open]) {
      display: flex;
    }

    .modal-content {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
      gap: 0px 0px;
      grid-auto-flow: row;
      grid-template-areas:
        "modal-header"
        "modal-body"
        "modal-footer";

      background-color: #fefefe;
      margin: auto;
      padding: 0;
      border: 1px solid #888;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      max-width: 100%;
      max-height: 100%;
    }

    .modal-header {
      grid-area: modal-header;
      background-color: #29a198;
      padding: 10px 20px;
      color: white;
      font-size: 1.25em;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
    }

    .modal-body {
      grid-area: modal-body;
      padding: 20px;
      font-size: 1em;
      color: #333;
      display: flex;
      flex-direction: column;
      overflow: auto;
      justify-content: flex-start;
    }

    .modal-footer {
      grid-area: modal-footer;
      padding: 10px 20px;
      background-color: #f1f1f1;
      border-top: 1px solid #ccc;
      text-align: right;
    }

    .close-button {
      font-size: 24px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }

    .close-button:hover {
      color: #ff4d4d;
    }

    .modal-footer button {
      padding: 8px 16px;
      margin-left: 8px;
      border: none;
      background-color: #29a198;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s ease;
    }

    .modal-footer button:disabled {
      background-color: #ccc;
      color: #777;
      cursor: not-allowed;
    }

    .modal-footer button.cancel-button {
      background-color: #ff4d4d;
    }

    .modal-footer button.cancel-button:hover {
      background-color: #ff6666;
    }

    .modal-footer button.confirm-button:hover:not(:disabled) {
      background-color: #1a7f7b;
    }
  `;
__decorate([
    property({ type: Boolean, reflect: true })
], IoCenterModal.prototype, "open", void 0);
__decorate([
    property({ type: String })
], IoCenterModal.prototype, "title", void 0);
__decorate([
    property({ type: String })
], IoCenterModal.prototype, "confirmText", void 0);
__decorate([
    property({ type: Boolean })
], IoCenterModal.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], IoCenterModal.prototype, "modalWidth", void 0);
__decorate([
    property({ type: String })
], IoCenterModal.prototype, "modalHeight", void 0);
IoCenterModal = __decorate([
    customElement('io-center-modal')
], IoCenterModal);
export { IoCenterModal };
//# sourceMappingURL=io-center-modal.js.map