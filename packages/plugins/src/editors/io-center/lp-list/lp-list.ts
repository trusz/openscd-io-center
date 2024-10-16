import {css, customElement, html, property, state} from "lit-element";
import {IoCenterFoundation} from "../foundation";
import {Subscription} from "rxjs";

import './lp-editor';
import '../components/forms/text-input';

import {ElementManagerService} from "../element-manager/element-manager.service";
import {DataObject} from "../element-manager/data-object";
import {LpDataService} from "./lp-data.service";

@customElement('lp-list')
export class LpList extends IoCenterFoundation {
  @property({type: String}) searchTerm: string = '';

  @state() selectedItems: Set<DataObject> = new Set();
  @state() lpItems: DataObject[] = [];

  private subList: Subscription[] = [];

  private elementManager = ElementManagerService.getInstance();
  private lpDataService = LpDataService.getInstance();

  constructor() {
    super();
    this.subList.push(this.lpDataService.lpData$.subscribe((dataObjects) => {
      this.lpItems = dataObjects;
      this.requestUpdate();
    }));

    this.subList.push(this.elementManager.dataObjectDeleted$.subscribe((dataObject: DataObject) => {
      this.selectedItems.delete(dataObject);
      this.requestUpdate();
    }));

    this.subList.push(this.elementManager.dataObjectAdded$.subscribe((dataObject: DataObject) => {
      if (dataObject.type === 'LP') {
        this.selectedItems.add(dataObject);
        this.requestUpdate();
      }
    }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subList.forEach(sub => sub.unsubscribe());
  }

  _onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.requestUpdate();
  }

  handleItemClick(item: DataObject) {
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

  private renderList() {
    // Filter lpItems based on the searchTerm
    const filteredItems = this.lpItems.filter((item: DataObject) => {
      const searchLower = this.searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.lnInst.toLowerCase().includes(searchLower)
      );
    });

    if (filteredItems.length === 0) {
      return html`<p>No items found</p>`;
    }

    return html`
      <ul class="lp-list">
        ${filteredItems.map((item: DataObject) => html`
          <li
            class="lp-list-item ${this.selectedItems.has(item) ? 'selected' : ''}"
            @click="${() => this.handleItemClick(item)}"
          >
            <mwc-icon>
              ${this.selectedItems.has(item) ? 'check_circle' : 'link'}
            </mwc-icon>
            <span>${item.name}-${item.lnInst}</span>
          </li>
        `)}
      </ul>
    `;
  }

  private renderSearchInputField() {
    return html`
      <text-input
        .placeholder="${'Search LP'}"
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

  static styles = css`
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
}
