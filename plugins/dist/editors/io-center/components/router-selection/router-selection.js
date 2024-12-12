import { __decorate } from "../../../../../../_snowpack/pkg/tslib.js";
import { LitElement, html, css, property, customElement, state } from '../../../../../../_snowpack/pkg/lit-element.js';
import '../forms/selection-box.js';
import '../forms/number-input.js';
import '../forms/form-group.js';
let RouterSelection = class RouterSelection extends LitElement {
    constructor() {
        super(...arguments);
        this.multiSelect = false;
        this.label = 'Available Routers';
        this.noItemsText = 'No options available';
        this.items = [
            {
                label: "LRTD",
                value: "lrtd",
                inst: 1,
                inputConnectors: [
                    { id: crypto.randomUUID(), text: "lnOn", position: 'right', type: 'input' },
                    { id: crypto.randomUUID(), text: "lnOff", position: 'right', type: 'input' },
                ],
                outputConnectors: [
                    { id: crypto.randomUUID(), text: "DpsInd", position: 'left', type: 'output' },
                ]
            },
            {
                label: "LRTI",
                value: "lrti",
                inst: 1,
                inputConnectors: [],
                outputConnectors: [{
                        id: crypto.randomUUID(),
                        text: 'IntInd',
                        position: 'left',
                        type: 'output',
                    }]
            },
            {
                label: "LRTB",
                value: "lrtb",
                inst: 1,
                inputConnectors: [{
                        id: crypto.randomUUID(),
                        text: 'in',
                        position: 'right',
                        type: 'input',
                    }],
                outputConnectors: [{
                        id: crypto.randomUUID(),
                        text: 'SPSInd',
                        position: 'left',
                        type: 'output',
                    }]
            }
        ];
        this.isLrtiSelected = false;
        this.selectedRouter = '';
        this.lrtiInputs = 1;
        this.isFormValid = false;
        this.routerInstance = 1;
    }
    _handleSelectionChange(event) {
        const selectedItems = event.detail.selectedItems;
        if (selectedItems.length > 0 && !this.multiSelect) {
            this.selectedRouter = selectedItems[0];
            if (this.selectedRouter === 'lrti') {
                this.lrtiInputs = 1;
                this.isLrtiSelected = true;
                this.setLrtiInputConnectors(this.lrtiInputs);
            }
            else {
                this.isLrtiSelected = false;
            }
            this.dispatchRouterOptions();
        }
    }
    setLrtiInputConnectors(numOfInputs) {
        const inputConnectors = Array.from({ length: numOfInputs }).map((_, i) => ({
            id: crypto.randomUUID(),
            text: `in${i + 1}`,
            position: 'right',
            type: 'input'
        }));
        const index = this.items.findIndex(item => item.value === 'lrti');
        if (index !== -1) {
            this.items[index].inputConnectors = inputConnectors;
        }
    }
    _handleLrtiInputsChange(event) {
        this.lrtiInputs = event.detail.value;
        this.setLrtiInputConnectors(this.lrtiInputs);
        this.dispatchRouterOptions();
    }
    _handleRouterInstanceChange(event) {
        this.routerInstance = event.detail.value;
        this.dispatchRouterOptions();
    }
    _handleFormValidityChanged(event) {
        this.isFormValid = event.detail.isValid;
    }
    dispatchRouterOptions() {
        const routerOptions = this.items.find(item => item.value === this.selectedRouter);
        if (!routerOptions) {
            return;
        }
        routerOptions.inst = this.routerInstance;
        if (this.isFormValid) {
            this.dispatchEvent(new CustomEvent('router-changed', {
                detail: routerOptions,
                bubbles: true,
                composed: true
            }));
        }
    }
    renderInputForRouterInstance() {
        if (!this.selectedRouter) {
            return html ``;
        }
        return html `
      <number-input
        style="margin-top: 1rem;"
        label="Router Instance"
        .placeholder="${'Enter a number'}"
        .value="${this.routerInstance}"
        .min="${1}"
        .required="${true}"
        @value-changed="${this._handleRouterInstanceChange}">
      </number-input>
    `;
    }
    renderNumberInputForLrti() {
        if (!this.isLrtiSelected) {
            return html ``;
        }
        return html `
      <number-input
        style="margin-top: 1rem;"
        label="Number of LRTI Inputs"
        .placeholder="${'Enter a number'}"
        .value="${this.lrtiInputs}"
        .min="${1}"
        .max="${10}"
        .required="${true}"
        @value-changed="${this._handleLrtiInputsChange}">
      </number-input>
    `;
    }
    renderSelectionBox() {
        return html `
      <selection-box
        .items="${this.items}"
        .label="${this.label}"
        .noItemsText="${this.noItemsText}"
        .multiSelect="${this.multiSelect}"
        .required="${true}"
        .errorMessage="${'Please select a router'}"
        @selection-changed="${this._handleSelectionChange}">
      </selection-box>
    `;
    }
    render() {
        return html `
      <form-group @form-validity-changed="${this._handleFormValidityChanged}">
        <div class="container">
          ${this.renderSelectionBox()}

          ${this.renderInputForRouterInstance()}

          ${this.renderNumberInputForLrti()}
        </div>
      </form-group>
    `;
    }
};
RouterSelection.styles = css `
    :host {
      display: block;
      font-family: Arial, sans-serif;
      width: 100%;
    }

    .label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: #555;
      display: block;
    }

    .container {
      width: 100%;
    }
  `;
__decorate([
    property({ type: Boolean })
], RouterSelection.prototype, "multiSelect", void 0);
__decorate([
    property({ type: String })
], RouterSelection.prototype, "label", void 0);
__decorate([
    property({ type: String })
], RouterSelection.prototype, "noItemsText", void 0);
__decorate([
    state()
], RouterSelection.prototype, "items", void 0);
__decorate([
    state()
], RouterSelection.prototype, "isLrtiSelected", void 0);
__decorate([
    state()
], RouterSelection.prototype, "selectedRouter", void 0);
__decorate([
    state()
], RouterSelection.prototype, "lrtiInputs", void 0);
__decorate([
    state()
], RouterSelection.prototype, "isFormValid", void 0);
__decorate([
    state()
], RouterSelection.prototype, "routerInstance", void 0);
RouterSelection = __decorate([
    customElement('router-selection')
], RouterSelection);
export { RouterSelection };
//# sourceMappingURL=router-selection.js.map