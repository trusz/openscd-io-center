import {LitElement, html, css} from 'lit';
import {customElement, property, PropertyValues, state} from 'lit-element';
import '@material/mwc-icon';
import {ElementManagerService} from "../element-manager/element-manager.service";
import {DataObject} from "../element-manager/data-object";
import {Subscription} from "rxjs";
import {TreeviewService} from "./treeview.service";
import {ITreeNode} from "./treenode.interface";
import {ConnectionManagerService} from "../connection-manager/connection-manager.service";

@customElement('tree-node')
export class TreeNode extends LitElement {
  @property({type: String}) path: string = '';
  @property({type: Object}) node: ITreeNode = undefined!;
  @property({type: Boolean}) expanded: boolean = false;
  @property({type: Number}) level: number = 0;
  @property({type: Boolean}) addedToEditor: boolean = false;
  @property({type: String}) searchTerm: string = '';

  @state() isSelected: boolean = false;
  @state() currentSelectedNode: DataObject | undefined;

  private subList: Subscription[] = [];

  private elementManager = ElementManagerService.getInstance();
  private treeviewService = TreeviewService.getInstance();
  private connectionManager = ConnectionManagerService.getInstance();

  constructor() {
    super();
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.expanded = false;
    this.subList.push(this.treeviewService.selectedDataObject$.subscribe((node: DataObject) => {
      this.currentSelectedNode = node;
      this.elementManager.clearDataObjects();
      this.connectionManager.clearConnections();

      if (!node) {
        this.isSelected = false;
      } else {
        this.isSelected = node.id === this.node.dataObject?.id;
      }
    }));
  }

  protected shouldUpdate(changedProperties: PropertyValues) {
    return changedProperties.has('node') || changedProperties.has('expanded') || changedProperties.has('isSelected');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subList.forEach(sub => sub.unsubscribe());
  }

  toggleExpand() {
    if (this.node?.children && this.node?.children.length > 0) {
      this.expanded = !this.expanded;
      this.requestUpdate();
    }
  }

  private matchesSearch(): boolean {
    if (!this.searchTerm) {
      return false;
    }

    const isMatch = this.node.name.toLowerCase().includes(this.searchTerm);
    const childMatches = this.node.children?.some(child =>
      child.name.toLowerCase().includes(this.searchTerm) || this.childHasMatch(child)
    );

    return isMatch || !!childMatches;
  }

  private childHasMatch(child: ITreeNode): boolean {
    return child.children?.some(grandChild =>
      grandChild.name.toLowerCase().includes(this.searchTerm) || this.childHasMatch(grandChild)
    ) || false;
  }

  selectNode(node: ITreeNode) {
    if (this.isSelected) {
      return;
    }

    const dataObject = node.dataObject;
    if (!dataObject) {
      console.error('Data Object not found! Node:', node);
      return;
    }

    const previousSelectedNode = this.currentSelectedNode;
    if (previousSelectedNode) {
      this.elementManager.deleteDataObjectById(previousSelectedNode.id);
    }

    this.treeviewService.setSelectedDataObject(dataObject);
    this.elementManager.addDataObject(dataObject);
  }

  private renderCaretIcon(isLeaf: boolean) {
    if (isLeaf) return null;
    return html`
      <mwc-icon class="caret">
        ${this.expanded ? 'expand_more' : 'chevron_right'}
      </mwc-icon>
    `;
  }

  private renderChildren(isLeaf: boolean) {
    if (!isLeaf && this.expanded) {
      return html`
        <div class="children">
          ${this.node.children
            .filter(child => !!child)
            .map(child => html`
            <tree-node
              .node="${child}"
              .searchTerm="${this.searchTerm}"
              .expanded="${child.expanded || this.matchesSearch()}"
            ></tree-node>`
            )}
        </div>
      `;
    }
    return null;
  }

  private renderText(isLeaf: boolean) {
    if (isLeaf) {
      return html`
        <span class="leafText isLeaf" @click="${() => this.selectNode(this.node)}">
        ${this.node.name}
      </span>`
    }

    return html`
      <span class="leafText" @click="${() => this.toggleExpand()}">
        ${this.node.name}
      </span>
    `;
  }

  render() {
    if (!this.node) {
      return html`<div>No data available</div>`;
    }

    const isLeaf = !this.node?.children || this.node?.children.length === 0;
    const lastSelectedDataObject = this.treeviewService.lastSelectedDataObject;

    if (lastSelectedDataObject) {
      this.isSelected = this.node.dataObject?.id === lastSelectedDataObject.id;
    }

    return html`
      <div
        class="node ${isLeaf ? 'leaf' : ''} ${this.isSelected ? 'highlight' : ''}"
        @click="${this.toggleExpand}">
        ${this.renderCaretIcon(isLeaf)}
        ${this.renderText(isLeaf)}
      </div>
      ${this.renderChildren(isLeaf)}
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Arial', sans-serif;
    }

    .node {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .highlight {
      background-color: #e0e0e0;
      color: #000;
    }

    .caret {
      margin-right: 8px;
      font-size: 16px;
      color: #555;
      transition: transform 0.2s ease;
    }

    .caret.collapsed {
      transform: rotate(0deg);
    }

    .caret.expanded {
      transform: rotate(90deg);
    }

    .leafText {
      font-size: 14px;
      color: #333;
      transition: color 0.3s ease;
    }

    .leafText:hover {
      color: #0073e6;
      font-weight: bold;
    }

    .children {
      padding-left: 16px;
      border-left: 1px solid #d0d0d0;
      margin-left: 8px;
    }

    .children.expanded {
      max-height: 1000px;
      opacity: 1;
      transition: max-height 0.3s ease, opacity 0.3s ease;
    }

    .children.collapsed {
      max-height: 0;
      opacity: 0;
      pointer-events: none;
    }
  `;
}
