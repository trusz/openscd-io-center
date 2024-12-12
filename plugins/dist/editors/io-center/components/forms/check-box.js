import { __decorate } from "../../../../../../_snowpack/pkg/tslib.js";
import { LitElement, html, css, property, customElement } from '../../../../../../_snowpack/pkg/lit-element.js';
let CheckBox = class CheckBox extends LitElement {
    constructor() {
        super(...arguments);
        this.checked = false;
        this.label = '';
        this.required = false;
        this.error = false;
        this.errorMessage = 'This field is required';
    }
    firstUpdated() {
        this._registerWithFormGroup();
    }
    resetInput() {
        this.checked = false;
        this.error = false;
        this.errorMessage = '';
        this._notifyFormGroup();
    }
    _onCheckboxChange() {
        this.checked = !this.checked;
        this._validate();
        this._notifySelectionChange();
    }
    _validate() {
        let errorMsg = '';
        if (this.required && !this.checked) {
            errorMsg = this.errorMessage;
        }
        const previousError = this.error;
        this.error = !!errorMsg;
        this.errorMessage = errorMsg || this.errorMessage;
        if (previousError !== this.error || !this.error) {
            this._notifyFormGroup(!this.error);
        }
    }
    _notifySelectionChange() {
        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: this.checked,
        }));
    }
    _notifyFormGroup(isValid = true) {
        const formGroup = this._findFormGroup();
        if (formGroup) {
            formGroup.updateValidity(this.label, isValid);
        }
    }
    _registerWithFormGroup() {
        const formGroup = this._findFormGroup();
        if (formGroup) {
            const initialValidity = !this.required || this.checked;
            formGroup.registerInput(this.label, initialValidity);
        }
    }
    _findFormGroup() {
        return this.closest('form-group');
    }
    render() {
        return html `
      <div class="input-container">
        <div class="label-container">
          <input
            type="checkbox"
            .checked=${this.checked}
            @change="${this._onCheckboxChange}"
          />
          ${this.label
            ? html `
              <label class="label">
                ${this.label}
                ${this.required ? html `<span class="required">*</span>` : ''}
              </label>
            `
            : ''}
        </div>
        ${this.error ? html `<span class="error-message">${this.errorMessage}</span>` : ''}
      </div>
    `;
    }
};
CheckBox.styles = css `
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 100%;
    }

    .label-container {
      display: flex;
      align-items: center;
    }

    .label {
      font-size: 1rem;
      margin-left: 0.5rem;
      color: #555;
    }

    .label .required {
      color: var(--input-required-color, #ff4d4d);
      margin-left: 0.25rem;
    }

    input[type='checkbox'] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .error-message {
      color: var(--input-error-color, #ff4d4d);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: none;
    }

    :host([error]) .label,
    :host([error]) .error-message {
      color: var(--input-error-color, #ff4d4d);
    }

    :host([error]) .error-message {
      display: block;
    }
  `;
__decorate([
    property({ type: Boolean })
], CheckBox.prototype, "checked", void 0);
__decorate([
    property({ type: String })
], CheckBox.prototype, "label", void 0);
__decorate([
    property({ type: Boolean })
], CheckBox.prototype, "required", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], CheckBox.prototype, "error", void 0);
__decorate([
    property({ type: String })
], CheckBox.prototype, "errorMessage", void 0);
CheckBox = __decorate([
    customElement('check-box')
], CheckBox);
export { CheckBox };
//# sourceMappingURL=check-box.js.map