import { LitElement, html, css, property, customElement } from 'lit-element';
import { FormGroup } from './form-group';

@customElement('check-box')
export class CheckBox extends LitElement {
  static styles = css`
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

  @property({ type: Boolean }) checked: boolean = false;
  @property({ type: String }) label: string = '';
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) error: boolean = false;
  @property({ type: String }) errorMessage: string = 'This field is required';

  firstUpdated() {
    this._registerWithFormGroup();
  }

  resetInput() {
    this.checked = false;
    this.error = false;
    this.errorMessage = '';
    this._notifyFormGroup();
  }

  private _onCheckboxChange() {
    this.checked = !this.checked;
    this._validate();
    this._notifySelectionChange();
  }

  private _validate() {
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

  private _notifySelectionChange() {
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: this.checked,
    }));
  }

  private _notifyFormGroup(isValid: boolean = true) {
    const formGroup = this._findFormGroup();
    if (formGroup) {
      formGroup.updateValidity(this.label, isValid);
    }
  }

  private _registerWithFormGroup() {
    const formGroup = this._findFormGroup();
    if (formGroup) {
      const initialValidity = !this.required || this.checked;
      formGroup.registerInput(this.label, initialValidity);
    }
  }

  private _findFormGroup() {
    return this.closest('form-group') as FormGroup;
  }

  render() {
    return html`
      <div class="input-container">
        <div class="label-container">
          <input
            type="checkbox"
            .checked=${this.checked}
            @change="${this._onCheckboxChange}"
          />
          ${this.label
      ? html`
              <label class="label">
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ''}
              </label>
            `
      : ''}
        </div>
        ${this.error ? html`<span class="error-message">${this.errorMessage}</span>` : ''}
      </div>
    `;
  }
}
