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
import {LitElement, html, property, customElement} from "../../../../../../_snowpack/pkg/lit-element.js";
export let FormGroup = class extends LitElement {
  constructor() {
    super(...arguments);
    this.validationStatus = {};
    this.isFormValid = false;
  }
  registerInput(name, initialValidity) {
    console.debug("Registering input", name, "with initial validity", initialValidity);
    this.validationStatus[name] = initialValidity;
    this.checkFormValidity();
  }
  updateValidity(name, isValid) {
    console.debug("Updating validity for", name, isValid);
    this.validationStatus[name] = isValid;
    this.checkFormValidity();
  }
  resetFormGroup() {
    console.debug("Resetting form group");
    Object.keys(this.validationStatus).forEach((key) => {
      this.validationStatus[key] = false;
    });
    this.querySelectorAll("text-input, number-input, selection-box").forEach((input) => {
      input.resetInput();
    });
    this.checkFormValidity();
  }
  checkFormValidity() {
    this.isFormValid = Object.values(this.validationStatus).every((valid) => valid);
    this.dispatchEvent(new CustomEvent("form-validity-changed", {
      detail: {isValid: this.isFormValid},
      bubbles: true,
      composed: true
    }));
  }
  render() {
    return html`<slot></slot>`;
  }
};
__decorate([
  property({type: Object})
], FormGroup.prototype, "validationStatus", 2);
__decorate([
  property({type: Boolean, reflect: true})
], FormGroup.prototype, "isFormValid", 2);
FormGroup = __decorate([
  customElement("form-group")
], FormGroup);
