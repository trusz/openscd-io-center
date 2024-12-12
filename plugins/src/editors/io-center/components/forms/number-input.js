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
export let NumberInput = class extends LitElement {
  constructor() {
    super(...arguments);
    this.label = "";
    this.value = null;
    this.placeholder = "";
    this.min = null;
    this.max = null;
    this.required = false;
    this.error = false;
    this.errorMessage = "This field is required";
  }
  firstUpdated() {
    this._registerWithFormGroup();
  }
  resetInput() {
    this.value = null;
    this.error = false;
    this.errorMessage = "";
    this._notifyFormGroup();
  }
  _handleInput(e) {
    const input = e.target;
    const value = input.valueAsNumber;
    this.value = isNaN(value) ? null : value;
    this._validate();
    this._notifyValueChange();
  }
  _validate() {
    let errorMsg = "";
    if (this.required && (this.value === null || this.value === void 0)) {
      errorMsg = "This field is required";
    }
    if (this.min !== null && this.value !== null && this.value < this.min) {
      errorMsg = `Value must be greater than or equal to ${this.min}`;
    }
    if (this.max !== null && this.value !== null && this.value > this.max) {
      errorMsg = `Value must be less than or equal to ${this.max}`;
    }
    const previousError = this.error;
    this.error = !!errorMsg;
    this.errorMessage = errorMsg || this.errorMessage;
    if (previousError !== this.error || !this.error) {
      this._notifyFormGroup(!this.error);
    }
  }
  _notifyValueChange() {
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: {value: this.value},
      bubbles: true,
      composed: true
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
      const initialValidity = !this.required || this.value !== null;
      formGroup.registerInput(this.label, initialValidity);
    }
  }
  _findFormGroup() {
    return this.closest("form-group");
  }
  render() {
    return html`
      <div class="input-container">
        ${this.label ? html`
              <label class="label">
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ""}
              </label>
            ` : ""}
        <input
          type="number"
          .value="${this.value !== null ? this.value : ""}"
          placeholder="${this.placeholder}"
          @input="${this._handleInput}"
          .min="${this.min !== null ? this.min : ""}"
          .max="${this.max !== null ? this.max : ""}"
        />
        ${this.error ? html`<span class="error-message">${this.errorMessage}</span>` : ""}
      </div>
    `;
  }
};
NumberInput.styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 100%;
    }

    .label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: #555;
      display: flex;
      align-items: center;
    }

    .label .required {
      color: var(--input-required-color, #ff4d4d);
      margin-left: 0.25rem;
    }

    .input-container {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
    }

    input {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    input:focus {
      border-color: #007bff;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
    }

    .error-message {
      color: var(--input-error-color, #ff4d4d);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: none;
    }

    :host([error]) input {
      border-color: var(--input-error-color, #ff4d4d);
      box-shadow: 0 0 8px rgba(255, 77, 77, 0.25);
    }

    :host([error]) .error-message {
      display: block;
    }

    :host([error]) .label {
      color: var(--input-error-color, #ff4d4d);
    }
  `;
__decorate([
  property({type: String})
], NumberInput.prototype, "label", 2);
__decorate([
  property({type: Number})
], NumberInput.prototype, "value", 2);
__decorate([
  property({type: String})
], NumberInput.prototype, "placeholder", 2);
__decorate([
  property({type: Number})
], NumberInput.prototype, "min", 2);
__decorate([
  property({type: Number})
], NumberInput.prototype, "max", 2);
__decorate([
  property({type: Boolean})
], NumberInput.prototype, "required", 2);
__decorate([
  property({type: Boolean, reflect: true})
], NumberInput.prototype, "error", 2);
__decorate([
  property({type: String})
], NumberInput.prototype, "errorMessage", 2);
NumberInput = __decorate([
  customElement("number-input")
], NumberInput);
