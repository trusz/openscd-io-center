import { __decorate } from "../../../../../_snowpack/pkg/tslib.js";
import { LitElement, html, css } from '../../../../../_snowpack/pkg/lit.js';
import { customElement, property, state } from '../../../../../_snowpack/pkg/lit-element.js';
import '../../../../../_snowpack/pkg/@material/mwc-icon.js';
import { ElementManagerService } from "../element-manager/element-manager.service.js";
import { TreeviewService } from "./treeview.service.js";
import { ConnectionManagerService } from "../connection-manager/connection-manager.service.js";
let TreeNode = class TreeNode extends LitElement {
    constructor() {
        super();
        this.path = '';
        this.node = undefined;
        this.expanded = false;
        this.level = 0;
        this.addedToEditor = false;
        this.searchTerm = '';
        this.isSelected = false;
        this.subList = [];
        this.elementManager = ElementManagerService.getInstance();
        this.treeviewService = TreeviewService.getInstance();
        this.connectionManager = ConnectionManagerService.getInstance();
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.expanded = false;
        this.subList.push(this.treeviewService.selectedDataObject$.subscribe((node) => {
            this.currentSelectedNode = node;
            this.elementManager.clearDataObjects();
            this.connectionManager.clearConnections();
            if (!node) {
                this.isSelected = false;
            }
            else {
                this.isSelected = node.id === this.node.dataObject?.id;
            }
        }));
    }
    shouldUpdate(changedProperties) {
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
    matchesSearch() {
        if (!this.searchTerm) {
            return false;
        }
        const isMatch = this.node.name.toLowerCase().includes(this.searchTerm);
        const childMatches = this.node.children?.some(child => child.name.toLowerCase().includes(this.searchTerm) || this.childHasMatch(child));
        return isMatch || !!childMatches;
    }
    childHasMatch(child) {
        return child.children?.some(grandChild => grandChild.name.toLowerCase().includes(this.searchTerm) || this.childHasMatch(grandChild)) || false;
    }
    selectNode(node) {
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
    renderCaretIcon(isLeaf) {
        if (isLeaf)
            return null;
        return html `
      <mwc-icon class="caret">
        ${this.expanded ? 'expand_more' : 'chevron_right'}
      </mwc-icon>
    `;
    }
    renderChildren(isLeaf) {
        if (!isLeaf && this.expanded) {
            return html `
        <div class="children">
          ${this.node.children
                .filter(child => !!child)
                .map(child => html `
            <tree-node
              .node="${child}"
              .searchTerm="${this.searchTerm}"
              .expanded="${child.expanded || this.matchesSearch()}"
            ></tree-node>`)}
        </div>
      `;
        }
        return null;
    }
    renderText(isLeaf) {
        if (isLeaf) {
            return html `
        <span class="leafText isLeaf" @click="${() => this.selectNode(this.node)}">
        ${this.node.name}
      </span>`;
        }
        return html `
      <span class="leafText" @click="${() => this.toggleExpand()}">
        ${this.node.name}
      </span>
    `;
    }
    render() {
        if (!this.node) {
            return html `<div>No data available</div>`;
        }
        const isLeaf = !this.node?.children || this.node?.children.length === 0;
        const lastSelectedDataObject = this.treeviewService.lastSelectedDataObject;
        if (lastSelectedDataObject) {
            this.isSelected = this.node.dataObject?.id === lastSelectedDataObject.id;
        }
        return html `
      <div
        class="node ${isLeaf ? 'leaf' : ''} ${this.isSelected ? 'highlight' : ''}"
        @click="${this.toggleExpand}">
        ${this.renderCaretIcon(isLeaf)}
        ${this.renderText(isLeaf)}
      </div>
      ${this.renderChildren(isLeaf)}
    `;
    }
};
TreeNode.styles = css `
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
__decorate([
    property({ type: String })
], TreeNode.prototype, "path", void 0);
__decorate([
    property({ type: Object })
], TreeNode.prototype, "node", void 0);
__decorate([
    property({ type: Boolean })
], TreeNode.prototype, "expanded", void 0);
__decorate([
    property({ type: Number })
], TreeNode.prototype, "level", void 0);
__decorate([
    property({ type: Boolean })
], TreeNode.prototype, "addedToEditor", void 0);
__decorate([
    property({ type: String })
], TreeNode.prototype, "searchTerm", void 0);
__decorate([
    state()
], TreeNode.prototype, "isSelected", void 0);
__decorate([
    state()
], TreeNode.prototype, "currentSelectedNode", void 0);
TreeNode = __decorate([
    customElement('tree-node')
], TreeNode);
export { TreeNode };
//# sourceMappingURL=treenode.js.map