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
import {css, customElement, html, property, state} from "../../../../../_snowpack/pkg/lit-element.js";
import {IoCenterFoundation} from "../foundation.js";
import "./lp-editor.js";
import "../components/forms/text-input.js";
import {ElementManagerService} from "../element-manager/element-manager.service.js";
import {LpDataService} from "./lp-data.service.js";
export let LpList = class extends IoCenterFoundation {
  constructor() {
    super();
    this.searchTerm = "";
    this.selectedItems = new Set();
    this.lpItems = [];
    this.subList = [];
    this.elementManager = ElementManagerService.getInstance();
    this.lpDataService = LpDataService.getInstance();
    this.subList.push(this.lpDataService.lpData$.subscribe((dataObjects) => {
      this.lpItems = dataObjects;
      this.requestUpdate();
    }));
    this.subList.push(this.elementManager.dataObjectDeleted$.subscribe((dataObject) => {
      this.selectedItems.delete(dataObject);
      this.requestUpdate();
    }));
    this.subList.push(this.elementManager.dataObjectAdded$.subscribe((dataObject) => {
      if (dataObject.type === "LP") {
        this.selectedItems.add(dataObject);
        this.requestUpdate();
      }
    }));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.subList.forEach((sub) => sub.unsubscribe());
  }
  _onSearchInput(event) {
    const input = event.target;
    this.searchTerm = input.value.toLowerCase();
    this.requestUpdate();
  }
  handleItemClick(item) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
      this.elementManager.deleteDataObjectById(item.id);
    } else {
      this.selectedItems.add(item);
      this.elementManager.addDataObject(item);
    }
    this.requestUpdate();
  }
  clear() {
    this.selectedItems.clear();
    this.requestUpdate();
  }
  renderList() {
    const filteredItems = this.lpItems.filter((item) => {
      const searchLower = this.searchTerm.toLowerCase();
      return item.name.toLowerCase().includes(searchLower) || item.lnInst.toLowerCase().includes(searchLower);
    });
    if (filteredItems.length === 0) {
      return html`<p>No items found</p>`;
    }
    return html`
      <ul class="lp-list">
        ${filteredItems.map((item) => html`
          <li
            class="lp-list-item ${this.selectedItems.has(item) ? "selected" : ""}"
            @click="${() => this.handleItemClick(item)}"
          >
            <mwc-icon>
              ${this.selectedItems.has(item) ? "check_circle" : "link"}
            </mwc-icon>
            <span>${item.name}-${item.lnInst}</span>
          </li>
        `)}
      </ul>
    `;
  }
  renderSearchInputField() {
    return html`
      <text-input
        .placeholder="${"Search LP"}"
        .value="${this.searchTerm}"
        icon="search"
        @value-changed=${this._onSearchInput}
      ></text-input>
    `;
  }
  render() {
    return html`
      <div class="lp-list-container">
        <div class="lp-list-actions">
          ${this.renderSearchInputField()}
        </div>
        <div class="lp-list-content">
          ${this.renderList()}
        </div>
      </div>
    `;
  }
};
LpList.styles = css`
    .lp-list-container {
      width: auto;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 250px);
      border-left: 1px solid #e1e1e1;
      background-color: #faf4e6;
      align-items: center;
      padding: 0.5rem 0.5rem;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .lp-list-actions {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 0.5rem;
    }

    .lp-list-content {
      width: 100%;
      overflow-y: auto;
      height: 100%;
      padding: 0 0.5rem;
    }

    .lp-list {
      width: 100%;
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    .lp-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      cursor: pointer;
      background-color: #f8f6ee;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 8px;
      font-family: 'Arial', sans-serif;
      color: #333;
      transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }

    .lp-list-item:hover {
      background-color: #f0e9d2;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .lp-list-item.selected {
      background-color: #c3dff0;
      border-color: #a1c7e4;
    }

    mwc-icon {
      font-size: 1rem;
      margin-right: 8px;
      color: #6b6b6b;
    }

    .lp-list-item span {
      flex-grow: 1;
      text-align: left;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    li {
      list-style: none;
    }

    text-input {
      width: 100%;
    }

    .search-field {
      background-color: white;
      border-radius: 20px;
      padding: 0 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      color: #333;
      width: 100%;
    }

    .search-field::placeholder {
      color: #888;
    }
  `;
__decorate([
  property({type: String})
], LpList.prototype, "searchTerm", 2);
__decorate([
  state()
], LpList.prototype, "selectedItems", 2);
__decorate([
  state()
], LpList.prototype, "lpItems", 2);
LpList = __decorate([
  customElement("lp-list")
], LpList);
