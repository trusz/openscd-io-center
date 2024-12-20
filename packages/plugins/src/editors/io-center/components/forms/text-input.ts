import { LitElement, html, css, property, customElement } from 'lit-element';
import { FormGroup } from "./form-group";

import '@material/mwc-icon';

@customElement('text-input')
export class TextInput extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: String }) errorMessage = 'This field is required';
  @property({ type: Array }) validators: Array<(value: string) => string | null> = [];
  @property({ type: String }) icon = '';

  private _value = '';

  get value() {
    return this._value;
  }

  set value(val: string) {
    const oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
    this._validate();
    this._notifyValueChanged();
  }

  firstUpdated() {
    this._registerWithFormGroup();
  }

  resetInput() {
    this.value = '';
    this.error = false;
    this.errorMessage = '';
    this._registerWithFormGroup();
  }

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }

  private _validate() {
    let errorMsg = '';

    if (this.required && !this.value) {
      errorMsg = this.errorMessage;
    }

    for (const validator of this.validators) {
      const result = validator(this.value);
      if (result) {
        errorMsg = result;
        break;
      }
    }

    const previousError = this.error;
    this.error = !!errorMsg;
    this.errorMessage = errorMsg || this.errorMessage;

    if (previousError !== this.error || !this.error) {
      this._notifyFormGroup();
    }
  }

  private _notifyValueChanged() {
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: this.value
    }));
  }

  private _notifyFormGroup() {
    const formGroup = this._findFormGroup();
    if (formGroup) {
      formGroup.updateValidity(this.name, !this.error);
    }
  }

  private _registerWithFormGroup() {
    const formGroup = this._findFormGroup();
    if (formGroup) {
      const initialValidity = !this.required ||  !!this.value;
      formGroup.registerInput(this.name, initialValidity);
    }
  }

  private _findFormGroup() {
    return this.closest('form-group') as FormGroup;
  }

  render() {
    return html`
      <div class="input-container">
        ${this.label
          ? html`
            <label class="input-label">
              ${this.label}
              ${this.required ? html`<span class="required">*</span>` : ''}
            </label>
          `
          : ''}
        <div class="input-wrapper">
          <input
            type="text"
            class="input-field"
            .value="${this.value}"
            placeholder="${this.placeholder}"
            @input="${this._onInput}"
          />
          ${this.icon ? html`<mwc-icon class="input-icon">${this.icon}</mwc-icon>` : ''}
        </div>
        ${this.error ? html`<span class="error-message">${this.errorMessage}</span>` : ''}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 100%;
    }

    .input-container {
      position: relative;
      width: 100%;
      margin-bottom: 1rem;
    }

    .input-label {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: var(--input-label-color, #555);
    }

    .input-label .required {
      color: var(--input-required-color, #ff4d4d);
      margin-left: 0.25rem;
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    .input-field {
      width: 100%;
      padding: 0.75rem;
      padding-right: 2.5rem; /* Add padding for the icon */
      font-size: 1rem;
      border: 1px solid var(--input-border-color, #ccc);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      background-color: var(--input-background-color, #fff);
      color: var(--input-text-color, #333);
      box-sizing: border-box;
    }

    .input-field:focus {
      border-color: var(--input-focus-border-color, #007bff);
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
    }

    .input-field::placeholder {
      color: var(--input-placeholder-color, #aaa);
      opacity: 1;
    }

    .input-icon {
      position: absolute;
      top: 50%;
      right: 0.75rem;
      transform: translateY(-50%);
      font-size: 1.2rem;
      pointer-events: none; /* Prevent the icon from blocking input interaction */
      color: var(--input-icon-color, #aaa);
    }

    .error-message {
      color: var(--input-error-color, #ff4d4d);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: none;
    }

    :host([error]) .input-field {
      border-color: var(--input-error-color, #ff4d4d);
      box-shadow: 0 0 8px rgba(255, 77, 77, 0.25);
    }

    :host([error]) .input-label,
    :host([error]) .error-message {
      color: var(--input-error-color, #ff4d4d);
    }

    :host([error]) .error-message {
      display: block;
    }
  `;
}
