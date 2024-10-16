import { LitElement, html, property, customElement } from 'lit-element';

@customElement('form-group')
export class FormGroup extends LitElement {
  @property({ type: Object }) private validationStatus: { [key: string]: boolean } = {};
  @property({ type: Boolean, reflect: true }) isFormValid: boolean = false;

  registerInput(name: string, initialValidity: boolean) {
    console.debug('Registering input', name, 'with initial validity', initialValidity);
    this.validationStatus[name] = initialValidity;
    this.checkFormValidity();
  }

  updateValidity(name: string, isValid: boolean) {
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
      (input as any).resetInput();
    });

    this.checkFormValidity();
  }

  private checkFormValidity() {
    this.isFormValid = Object.values(this.validationStatus).every(valid => valid);
    this.dispatchEvent(new CustomEvent('form-validity-changed', {
      detail: { isValid: this.isFormValid },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`<slot></slot>`;
  }
}
