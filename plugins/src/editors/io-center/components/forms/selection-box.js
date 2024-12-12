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
export let SelectionBox = class extends LitElement {
  constructor() {
    super(...arguments);
    this.items = [];
    this.selectedItems = [];
    this.multiSelect = false;
    this.label = "";
    this.noItemsText = "No options available";
    this.required = false;
    this.error = false;
    this.errorMessage = "This field is required";
    this.dropdownOpen = false;
  }
  firstUpdated() {
    this._registerWithFormGroup();
  }
  resetInput() {
    this.selectedItems = [];
    this.error = false;
    this.errorMessage = "";
    this.dropdownOpen = false;
    this._notifyFormGroup();
  }
  _toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  _onSelectionChange(item) {
    if (this.multiSelect) {
      this._toggleMultiSelection(item);
    } else {
      this._toggleSingleSelection(item);
    }
    this.dropdownOpen = false;
  }
  _toggleSingleSelection(item) {
    this.selectedItems = this.selectedItems.includes(item.value) ? [] : [item.value];
    this._validate();
    this._notifySelectionChange();
  }
  _toggleMultiSelection(item) {
    if (this.selectedItems.includes(item.value)) {
      this.selectedItems = this.selectedItems.filter((i) => i !== item.value);
    } else {
      this.selectedItems = [...this.selectedItems, item.value];
    }
    this._validate();
    this._notifySelectionChange();
  }
  _validate() {
    let errorMsg = "";
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
  _notifySelectionChange() {
    this.dispatchEvent(new CustomEvent("selection-changed", {
      detail: {selectedItems: this.selectedItems}
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
      const initialValidity = !this.required || this.selectedItems.length > 0;
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
        <div class="select-box" @click="${this._toggleDropdown}">
          ${this.selectedItems.length > 0 ? this.items.find((item) => item.value === this.selectedItems[0])?.label || "Select an option" : "Select an option"}
        </div>
        <div class="dropdown ${this.dropdownOpen ? "open" : ""}">
          ${this.items.length > 0 ? this.items.map((item) => html`
                <div
                  class="dropdown-item ${this.selectedItems.includes(item.value) ? "selected" : ""}"
                  @click="${() => this._onSelectionChange(item)}">
                  ${item.label}
                </div>
              `) : html`<div class="placeholder">${this.noItemsText}</div>`}
        </div>
        ${this.error ? html`<span class="error-message">${this.errorMessage}</span>` : ""}
      </div>
    `;
  }
};
SelectionBox.styles = css`
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
__decorate([
  property({type: Array})
], SelectionBox.prototype, "items", 2);
__decorate([
  property({type: Array})
], SelectionBox.prototype, "selectedItems", 2);
__decorate([
  property({type: Boolean})
], SelectionBox.prototype, "multiSelect", 2);
__decorate([
  property({type: String})
], SelectionBox.prototype, "label", 2);
__decorate([
  property({type: String})
], SelectionBox.prototype, "noItemsText", 2);
__decorate([
  property({type: Boolean})
], SelectionBox.prototype, "required", 2);
__decorate([
  property({type: Boolean, reflect: true})
], SelectionBox.prototype, "error", 2);
__decorate([
  property({type: String})
], SelectionBox.prototype, "errorMessage", 2);
__decorate([
  property({type: Boolean})
], SelectionBox.prototype, "dropdownOpen", 2);
SelectionBox = __decorate([
  customElement("selection-box")
], SelectionBox);
