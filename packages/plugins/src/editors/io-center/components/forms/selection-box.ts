import { LitElement, html, css, property, customElement } from 'lit-element';
import { FormGroup } from './form-group';

export interface SelectionItem {
  label: string;
  value: any;
}

@customElement('selection-box')
export class SelectionBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 100%;
      position: relative;
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

    .select-box {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      color: #333;
      box-sizing: border-box;
      outline: none;
      cursor: pointer;
    }

    .select-box:focus {
      border-color: #007bff;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: 0;
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 6px 6px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: max-height 0.3s ease, opacity 0.3s ease;
      opacity: 0;
      z-index: 1;
    }

    .dropdown.open {
      max-height: 200px; /* Adjust this value as needed */
      opacity: 1;
    }

    .dropdown-item {
      padding: 10px;
      font-size: 1rem;
      color: #333;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .dropdown-item:hover {
      background-color: #e6f7ff;
    }

    .dropdown-item.selected {
      background-color: #1890ff;
      color: white;
    }

    .placeholder {
      color: #999;
      padding: 10px;
    }

    .error-message {
      color: var(--input-error-color, #ff4d4d);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: none;
    }

    :host([error]) .select-box {
      border-color: var(--input-error-color, #ff4d4d);
      box-shadow: 0 0 8px rgba(255, 77, 77, 0.25);
    }

    :host([error]) .label,
    :host([error]) .error-message {
      color: var(--input-error-color, #ff4d4d);
    }

    :host([error]) .error-message {
      display: block;
    }
  `;

  @property({ type: Array }) items: SelectionItem[] = [];
  @property({ type: Array }) selectedItems: any[] = [];
  @property({ type: Boolean }) multiSelect: boolean = false;
  @property({ type: String }) label: string = '';
  @property({ type: String }) noItemsText: string = 'No options available';
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) error: boolean = false;
  @property({ type: String }) errorMessage: string = 'This field is required';
  @property({ type: Boolean }) dropdownOpen: boolean = false;

  firstUpdated() {
    this._registerWithFormGroup();
  }

  resetInput() {
    this.selectedItems = [];
    this.error = false;
    this.errorMessage = '';
    this.dropdownOpen = false;
    this._notifyFormGroup();
  }

  private _toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  private _onSelectionChange(item: SelectionItem) {
    if (this.multiSelect) {
      this._toggleMultiSelection(item);
    } else {
      this._toggleSingleSelection(item);
    }
    this.dropdownOpen = false; // Close dropdown after selection
  }

  private _toggleSingleSelection(item: SelectionItem) {
    this.selectedItems = this.selectedItems.includes(item.value) ? [] : [item.value];
    this._validate();
    this._notifySelectionChange();
  }

  private _toggleMultiSelection(item: SelectionItem) {
    if (this.selectedItems.includes(item.value)) {
      this.selectedItems = this.selectedItems.filter(i => i !== item.value);
    } else {
      this.selectedItems = [...this.selectedItems, item.value];
    }
    this._validate();
    this._notifySelectionChange();
  }

  private _validate() {
    let errorMsg = '';

    if (this.required && this.selectedItems.length === 0) {
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
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: { selectedItems: this.selectedItems },
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
      const initialValidity = !this.required || this.selectedItems.length > 0;
      formGroup.registerInput(this.label, initialValidity);
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
              <label class="label">
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ''}
              </label>
            `
      : ''}
        <div class="select-box" @click="${this._toggleDropdown}">
          ${this.selectedItems.length > 0
      ? this.items.find(item => item.value === this.selectedItems[0])?.label || 'Select an option'
      : 'Select an option'}
        </div>
        <div class="dropdown ${this.dropdownOpen ? 'open' : ''}">
          ${this.items.length > 0
      ? this.items.map(item => html`
                <div
                  class="dropdown-item ${this.selectedItems.includes(item.value) ? 'selected' : ''}"
                  @click="${() => this._onSelectionChange(item)}">
                  ${item.label}
                </div>
              `)
      : html`<div class="placeholder">${this.noItemsText}</div>`}
        </div>
        ${this.error ? html`<span class="error-message">${this.errorMessage}</span>` : ''}
      </div>
    `;
  }
}
