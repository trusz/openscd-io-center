import {css, customElement, html, LitElement, property, query, state} from "lit-element";
import '@material/mwc-icon';
import '../components/icon-button';
import '../components/forms/text-input';
import '../components/forms/selection-box';
import '../components/data-attributes-editor/data-attributes-editor';
import '../components/io-center-modal';
import '../components/forms/form-group';
import '../components/forms/openscd-button';
import {maxLengthValidator, minLengthOrEmptyValidator, requiredValidator} from "../validators/validators";
import {FormGroup} from "../components/forms/form-group";
import {SelectionItem} from "../components/forms/selection-box";
import {DataAttributesEditor} from "../components/data-attributes-editor/data-attributes-editor";
import {LpDataService} from "./lp-data.service";
import {DataObject} from "../element-manager/data-object";

@customElement("lp-editor")
export class LpEditor extends LitElement {
  @query('form-group') private formGroup!: FormGroup;
  @query('data-attributes-editor') private dataAttributesEditor!: DataAttributesEditor;

  @property({type: Boolean}) private showModal = false;
  @property({type: Object}) private doc: XMLDocument | undefined = undefined;

  @state() private isFormValid = false;
  @state() lpName: string = '';
  @state() lpDesc: string = '';
  @state() lpType: string = '';
  @state() lpInst: string = '0';
  @state() attributeValues: { [doName: string]: { [daName: string]: any } } = {};

  
  private lpDataService = LpDataService.getInstance();

  constructor() {
    super();
  }

  private _handleClick() {
    this.showModal = true;
  }

  private _handleModalClose(event: CustomEvent) {
    this.showModal = false;

    if (event.detail) {
      const data = event.detail;
      if (!data) {
        console.error('No data received from modal');
        return;
      }

      this.saveToXml();
      this.showModal = false;

      const logicalNode: DataObject = {
        id: crypto.randomUUID(),
        name: this.lpName,
        desc: this.lpDesc,
        type: "LP",
        lnInst: this.lpInst,
        lnClass: this.lpType,
        ldRef: 'LD0',
        connectors: [
          { id: crypto.randomUUID(), name: 'Ind', type: 'output' },
        ],
      };

      this.lpDataService.addLpData(logicalNode);

      this.resetAll();
    }

  }

  private _handleFormValidityChanged(event: CustomEvent) {
    this.isFormValid = event.detail.isValid;
  }

  private getLogicalNodes(): SelectionItem[] {
    const logicalNodes = this.doc?.querySelectorAll('LNodeType');
    if (!logicalNodes) {
      return [];
    }

    const lpTypes = Array.from(logicalNodes).filter((ln) => {
      return this.lpTypes.includes(ln.getAttribute('lnClass') || '');
    });

    return lpTypes.map((ln) => {
      return {
        label: ln.getAttribute('lnClass') || '',
        value: ln.getAttribute('lnClass') || ''
      };
    });
  }

  private dataChanged(event: CustomEvent) {
    this.attributeValues = event.detail
  }

  private resetAll() {
    this.lpName = '';
    this.lpDesc = '';
    this.lpType = '';
    this.lpInst = '1';
    this.formGroup.resetFormGroup();
    this.dataAttributesEditor.resetAttributeValues();
    this.dataAttributesEditor.clearComponent();
    this.requestUpdate();
  }

  private _handleSelectionChange(event: CustomEvent) {
    this.lpType = event.detail.selectedItems[0];

    if (this.dataAttributesEditor) {
      this.dataAttributesEditor.resetAttributeValues();
      this.dataAttributesEditor.lnClass = '';
      this.requestUpdate();
      this.dataAttributesEditor.lnClass = this.lpType;
    }
  }

  private saveToXml() {
    if (!this.doc) {
      console.error('No XML document available');
      return;
    }

    const lDevice = this.doc.querySelector(`IED > AccessPoint > Server > LDevice[inst="LD0"]`);

    if (!lDevice) {
      console.error('LDevice with inst="LD0" not found');
      return;
    }

    let lnElement = lDevice.querySelector(`LN[lnClass="${this.lpType}"][inst="${this.lpName}"]`);

    if (!lnElement) {
      lnElement = this.doc.createElementNS('http://www.iec.ch/61850/2003/SCL', 'LN');
      lnElement.setAttribute('lnClass', this.lpType);
      lnElement.setAttribute('inst', this.lpInst);
      lnElement.setAttribute('lnType', this.lpName);
      lDevice.appendChild(lnElement);
    }

    for (const [doName, attributes] of Object.entries(this.attributeValues)) {
      let doiElement = lnElement.querySelector(`DOI[name="${doName}"]`);
      if (!doiElement) {
        doiElement = this.doc.createElementNS('http://www.iec.ch/61850/2003/SCL', 'DOI');
        doiElement.setAttribute('name', doName);
        lnElement.appendChild(doiElement);
      }

      if (this.lpDesc) {
        doiElement.setAttribute('desc', this.lpDesc);
      }

      for (const [daName, value] of Object.entries(attributes)) {
        let daiElement = doiElement.querySelector(`DAI[name="${daName}"]`);
        if (!daiElement) {
          daiElement = this.doc.createElementNS('http://www.iec.ch/61850/2003/SCL', 'DAI');
          daiElement.setAttribute('name', daName);
          doiElement.appendChild(daiElement);
        }

        let valElement = daiElement.querySelector('Val');
        if (!valElement) {
          valElement = this.doc.createElementNS('http://www.iec.ch/61850/2003/SCL', 'Val');
          daiElement.appendChild(valElement);
        }

        valElement.textContent = value;
      }
    }

    return lnElement;
  }

  render() {
    return html`
      <div class="lp-editor">
        <openscd-button
          icon="add_circle"
          label="Add LP"
          @button-click="${() => this._handleClick()}">
        </openscd-button>
      </div>

      <io-center-modal
        .open="${this.showModal}"
        @close="${this._handleModalClose}"
        confirmText="Save"
        modalHeight="80%"
        title="Edit LP"
        .disabled="${!this.isFormValid}">
        <div class="lp-editor-content">
          <form-group id="formGroup" @form-validity-changed="${this._handleFormValidityChanged}">

            <text-input
              name="lpName"
              .value=${this.lpName}
              .required=${true}
              .validators=${[requiredValidator, maxLengthValidator(10)]}
              @value-changed="${(e: CustomEvent) => this.lpName = e.detail}"
              label="LP Name">
            </text-input>

            <text-input
              name="lpInst"
              .value=${this.lpInst}
              .required=${true}
              .validators=${[requiredValidator]}
              @value-changed="${(e: CustomEvent) => this.lpInst = e.detail}"
              label="LP Instance">
            </text-input>

            <text-input
              name="lpDesc"
              .value=${this.lpDesc}
              .validators=${[maxLengthValidator(100), minLengthOrEmptyValidator(10)]}
              @value-changed="${(e: CustomEvent) => this.lpDesc = e.detail}"
              label="LP Description">
            </text-input>

            <selection-box
              label="LP Type Selection"
              .required=${true}
              .validators=${[requiredValidator]}
              .items=${this.getLogicalNodes()}
              @selection-changed="${this._handleSelectionChange}">
            </selection-box>

            <data-attributes-editor
              .doc=${this.doc}
              .lnClass="${this.lpType}"
              .formGroup=${this.formGroup}
              @data-changed="${this.dataChanged}">
            </data-attributes-editor>

          </form-group>
        </div>
      </io-center-modal>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .lp-editor {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 0.5rem;
    }

    .lp-editor-content {
      width: 100%;
      height: 100%;
    }
  `;

}
