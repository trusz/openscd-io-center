import { __decorate } from "../../../../../../_snowpack/pkg/tslib.js";
import { css, customElement, html, LitElement, property } from "../../../../../../_snowpack/pkg/lit-element.js";
import '../forms/check-box.js';
import '../forms/number-input.js';
import '../forms/text-input.js';
import '../forms/selection-box.js';
import '../forms/form-group.js';
import '../hint-box/hint-box.js';
let DataAttributesEditor = class DataAttributesEditor extends LitElement {
    constructor() {
        super(...arguments);
        this.doc = undefined;
        this.lnClass = '';
        this.filteredDataObjects = [];
        this.showOnlyModified = false;
        this.attributeValues = {};
    }
    resetAttributeValues() {
        this.attributeValues = {};
    }
    clearComponent() {
        this.resetAttributeValues();
        this.formGroup.resetFormGroup();
        this.requestUpdate();
    }
    getLnClass() {
        return this.doc?.querySelectorAll(`LNodeType[lnClass="${this.lnClass}"]`);
    }
    getLnNodeType() {
        const lnClass = this.getLnClass();
        if (lnClass && lnClass.length > 0) {
            const lnodeType = lnClass[0];
            return lnodeType.querySelectorAll('DO');
        }
        return null;
    }
    getDataObjects() {
        const doElements = this.getLnNodeType();
        if (doElements) {
            return Array.from(doElements).map(doElement => {
                const doTypeId = doElement.getAttribute('type');
                const doType = this.doc?.querySelector(`DOType[id="${doTypeId}"]`);
                const daElements = doType?.querySelectorAll('DA');
                return {
                    name: doElement.getAttribute('name'),
                    dataAttributes: Array.from(daElements || []).map(da => ({
                        name: da.getAttribute('name'),
                        fc: da.getAttribute('fc'),
                        bType: da.getAttribute('bType'),
                        values: Array.from(da.querySelectorAll('Val') || []).map(val => val.textContent)
                    }))
                };
            });
        }
        return [];
    }
    handleInputChange(dataObjectName, attributeName, value) {
        if (!this.attributeValues[dataObjectName]) {
            this.attributeValues[dataObjectName] = {};
        }
        if (value === '' || value === null || value === undefined) {
            delete this.attributeValues[dataObjectName][attributeName];
        }
        else {
            this.attributeValues[dataObjectName][attributeName] = value;
        }
        if (Object.keys(this.attributeValues[dataObjectName]).length === 0) {
            delete this.attributeValues[dataObjectName];
        }
        const hintBox = this.shadowRoot?.querySelector(`hint-box[data-object-name="${dataObjectName}"]`);
        if (hintBox) {
            hintBox.isMarked = Object.keys(this.attributeValues[dataObjectName] || {}).length > 0;
        }
        this._dispatchData();
        this.requestUpdate();
    }
    renderInputField(dataObjectName, attributeName, bType) {
        if (!attributeName || !bType) {
            return html `<span>No data attribute provided</span>`;
        }
        const onInputChange = (e) => this.handleInputChange(dataObjectName, attributeName, e.target.value);
        switch (bType.toUpperCase()) { // Ensure bType is case insensitive
            case 'BOOLEAN':
                return html `
        <checkbox-input
          name="${attributeName}"
          label="${attributeName} (type: ${bType})"
          .checked=${this.attributeValues[dataObjectName]?.[attributeName] || false}
          @input="${(e) => onInputChange(!!e.target.checked)}">
        </checkbox-input>
      `;
            case 'INT':
            case 'INT32':
            case 'FLOAT':
            case 'FLOAT32':
                return html `
        <number-input
          name="${attributeName}"
          label="${attributeName} (type: ${bType})"
          .value="${this.attributeValues[dataObjectName]?.[attributeName] || ''}"
          @input="${onInputChange}">
        </number-input>
      `;
            case 'STRING':
            case 'VISSTRING255':
            case 'ENUM':
            case 'QUALITY':
            case 'TIMESTAMP':
                return html `
        <text-input
          name="${attributeName}"
          label="${attributeName} (type: ${bType})"
          .value="${this.attributeValues[dataObjectName]?.[attributeName] || ''}"
          @input="${onInputChange}">
        </text-input>
      `;
            default:
                return html `
        <text-input
          name="${attributeName}"
          label="${attributeName} (type: ${bType})"
          .value="${this.attributeValues[dataObjectName]?.[attributeName] || ''}"
          @input="${onInputChange}">
        </text-input>
      `;
        }
    }
    renderNoLogicalNode() {
        return html `
      <span>No logical node selected. Please select a logical node to view its data attributes.</span>
    `;
    }
    renderUndefinedXmlDoc() {
        return html `
      <span>No XML Document provided. Please provide a valid XML document to view data attributes.</span>
    `;
    }
    _onSearchChange(event) {
        const searchValue = event.detail.toLowerCase();
        const allDataObjects = this.getDataObjects();
        this.filteredDataObjects = allDataObjects.filter(doObj => doObj.name?.toLowerCase().includes(searchValue) ||
            doObj.dataAttributes.some(da => da.name?.toLowerCase().includes(searchValue) ||
                da.fc?.toLowerCase().includes(searchValue) ||
                da.bType?.toLowerCase().includes(searchValue)));
    }
    _onFilterChange(event) {
        this.showOnlyModified = event.detail;
        this.requestUpdate();
    }
    _dispatchData() {
        this.dispatchEvent(new CustomEvent('data-changed', {
            detail: this.attributeValues,
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.lnClass) {
            return this.renderNoLogicalNode();
        }
        if (!this.doc) {
            return this.renderUndefinedXmlDoc();
        }
        const allDataObjects = this.getDataObjects();
        const dataObjects = this.filteredDataObjects.length > 0 ? this.filteredDataObjects : allDataObjects;
        const displayedDataObjects = this.showOnlyModified
            ? dataObjects.filter(doObj => Object.keys(this.attributeValues[doObj.name] || {}).length > 0)
            : dataObjects;
        if (displayedDataObjects.length === 0 && !this.showOnlyModified) {
            return html `<span>No data objects found</span>`;
        }
        return html `
      <div class="search-input">
        <text-input
          label="Search"
          @value-changed="${this._onSearchChange}"
          placeholder="Search data objects (DO)">
        </text-input>
      </div>

      <div class="filter-modified">
        <check-box
          label="Show only modified"
          @value-changed="${this._onFilterChange}"
        ></check-box>
      </div>

      <div class="data-object-content">
        <div class="data-object-header">
          <h4>Data Objects</h4>
        </div>
        <div class="data-object-list">
          ${displayedDataObjects.map(doObj => {
            const isMarked = !!Object.keys(this.attributeValues[doObj.name] || {}).length;
            return html `
          <hint-box title="${doObj.name}" .isMarked="${isMarked}" data-object-name="${doObj.name}">
            ${doObj.dataAttributes.map((da) => html `
              <div>
                <h4>${da.name} (type: ${da.bType})</h4>
                <ul>
                  ${da.values.map((value) => html `<li>${value}</li>`)}
                </ul>
                ${this.renderInputField(doObj.name, da.name, da.bType)}
              </div>
            `)}
          </hint-box>
        `;
        })}
        </div>
      </div>

    `;
    }
};
DataAttributesEditor.styles = css `
    :host {
      display: block;
    }

    .search-input {
      margin-top: 1rem;
    }

    .save-button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .save-button:hover {
      background-color: #0056b3;
    }

    .filter-modified {
      margin: 1rem 0;
      display: flex;
      align-items: center;
    }
  `;
__decorate([
    property({ type: XMLDocument })
], DataAttributesEditor.prototype, "doc", void 0);
__decorate([
    property({ type: String })
], DataAttributesEditor.prototype, "lnClass", void 0);
__decorate([
    property({ type: Object })
], DataAttributesEditor.prototype, "formGroup", void 0);
__decorate([
    property({ type: Array })
], DataAttributesEditor.prototype, "filteredDataObjects", void 0);
__decorate([
    property({ type: Boolean })
], DataAttributesEditor.prototype, "showOnlyModified", void 0);
DataAttributesEditor = __decorate([
    customElement("data-attributes-editor")
], DataAttributesEditor);
export { DataAttributesEditor };
//# sourceMappingURL=data-attributes-editor.js.map