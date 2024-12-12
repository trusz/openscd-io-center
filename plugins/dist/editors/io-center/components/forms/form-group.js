import { __decorate } from "../../../../../../_snowpack/pkg/tslib.js";
import { LitElement, html, property, customElement } from '../../../../../../_snowpack/pkg/lit-element.js';
let FormGroup = class FormGroup extends LitElement {
    constructor() {
        super(...arguments);
        this.validationStatus = {};
        this.isFormValid = false;
    }
    registerInput(name, initialValidity) {
        console.debug('Registering input', name, 'with initial validity', initialValidity);
        this.validationStatus[name] = initialValidity;
        this.checkFormValidity();
    }
    updateValidity(name, isValid) {
        console.debug('Updating validity for', name, isValid);
        this.validationStatus[name] = isValid;
        this.checkFormValidity();
    }
    resetFormGroup() {
        console.debug('Resetting form group');
        Object.keys(this.validationStatus).forEach(key => {
            this.validationStatus[key] = false;
        });
        this.querySelectorAll('text-input, number-input, selection-box').forEach(input => {
            input.resetInput();
        });
        this.checkFormValidity();
    }
    checkFormValidity() {
        this.isFormValid = Object.values(this.validationStatus).every(valid => valid);
        this.dispatchEvent(new CustomEvent('form-validity-changed', {
            detail: { isValid: this.isFormValid },
            bubbles: true,
            composed: true
        }));
    }
    render() {
        return html `<slot></slot>`;
    }
};
__decorate([
    property({ type: Object })
], FormGroup.prototype, "validationStatus", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], FormGroup.prototype, "isFormValid", void 0);
FormGroup = __decorate([
    customElement('form-group')
], FormGroup);
export { FormGroup };
//# sourceMappingURL=form-group.js.map