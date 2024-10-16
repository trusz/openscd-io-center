import { LitElement, html, css, property, customElement, state } from 'lit-element';
import { SelectionItem } from "../forms/selection-box";

import '../forms/selection-box';
import '../forms/number-input';
import '../forms/form-group';
import {Connector} from "../../interfaces/connector.interface";

export interface RouterOptions extends SelectionItem {
  inst: string | number;
  inputConnectors: Connector[];
  outputConnectors: Connector[];
}


@customElement('router-selection')
export class RouterSelection extends LitElement {
  static styles = css`
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

  @property({ type: Boolean }) multiSelect: boolean = false;
  @property({ type: String }) label: string = 'Available Routers';
  @property({ type: String }) noItemsText: string = 'No options available';

  @state()
  private items: RouterOptions[] = [
    {
      label: "LRTD",
      value: "lrtd",
      inst: 1,
      inputConnectors: [
        {id: crypto.randomUUID(), text: "lnOn", position: 'right', type: 'input'},
        {id: crypto.randomUUID(), text: "lnOff", position: 'right', type: 'input'},
      ],
      outputConnectors: [
        {id: crypto.randomUUID(), text: "DpsInd", position: 'left', type: 'output'},
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

  @state()
  private isLrtiSelected: boolean = false;

  @state()
  private selectedRouter: any = '';

  @state()
  private lrtiInputs: number = 1;

  @state()
  private isFormValid: boolean = false;

  @state() routerInstance: number = 1;

  private _handleSelectionChange(event: CustomEvent) {
    const selectedItems = event.detail.selectedItems;
    if (selectedItems.length > 0 && !this.multiSelect) {
      this.selectedRouter = selectedItems[0];

      if (this.selectedRouter === 'lrti') {
        this.lrtiInputs = 1;
        this.isLrtiSelected = true;
        this.setLrtiInputConnectors(this.lrtiInputs);
      } else {
        this.isLrtiSelected = false;
      }

      this.dispatchRouterOptions();
    }
  }

  private setLrtiInputConnectors(numOfInputs: number) {
    const inputConnectors: Connector[] = Array.from({ length: numOfInputs }).map((_, i) => ({
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

  private _handleLrtiInputsChange(event: CustomEvent) {
    this.lrtiInputs = event.detail.value;
    this.setLrtiInputConnectors(this.lrtiInputs);
    this.dispatchRouterOptions();
  }

  private _handleRouterInstanceChange(event: CustomEvent) {
    this.routerInstance = event.detail.value;
    this.dispatchRouterOptions();
  }

  private _handleFormValidityChanged(event: CustomEvent) {
    this.isFormValid = event.detail.isValid;
  }

  private dispatchRouterOptions() {
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

  private renderInputForRouterInstance() {
    if (!this.selectedRouter) {
      return html``;
    }

    return html`
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

  private renderNumberInputForLrti() {
    if (!this.isLrtiSelected) {
      return html``;
    }

    return html`
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

  private renderSelectionBox() {
    return html`
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
    return html`
      <form-group @form-validity-changed="${this._handleFormValidityChanged}">
        <div class="container">
          ${this.renderSelectionBox()}

          ${this.renderInputForRouterInstance()}

          ${this.renderNumberInputForLrti()}
        </div>
      </form-group>
    `;
  }
}
