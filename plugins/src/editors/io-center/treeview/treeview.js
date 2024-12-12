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
import {css, html, LitElement} from "../../../../../_snowpack/pkg/lit.js";
import {customElement, state} from "../../../../../_snowpack/pkg/lit-element.js";
import "./treenode.js";
import "../components/forms/text-input.js";
import {TreeviewService} from "./treeview.service.js";
export let TreeView = class extends LitElement {
  constructor() {
    super();
    this.rootNode = void 0;
    this.searchTerm = "";
    this.selectedNodeId = null;
    this.treeviewService = TreeviewService.getInstance();
    this.subList = [];
    this.subList.push(this.treeviewService.treeDataObjects$.subscribe((dataObjects) => {
      if (dataObjects && dataObjects.length > 0) {
        this.rootNode = this.createTreeView(dataObjects);
        this.requestUpdate();
      } else {
        console.warn("No dataObjects found");
      }
    }));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.subList.forEach((sub) => sub.unsubscribe());
  }
  createTreeView(dataObjects) {
    const tree = [];
    const ldRefGroups = this.groupBy(dataObjects, "ldRef");
    for (const [ldRef, ldRefDataObjects] of Object.entries(ldRefGroups)) {
      const ldNode = {
        name: ldRef,
        children: [],
        expanded: true
      };
      const lnTypeInstGroups = this.groupBy(ldRefDataObjects, (obj) => `${obj.lnClass}-${obj.lnInst}`);
      for (const [lnTypeInst, lnTypeInstDataObjects] of Object.entries(lnTypeInstGroups)) {
        const lnNode = {
          name: lnTypeInst,
          children: [],
          expanded: true
        };
        lnNode.children = lnTypeInstDataObjects.map((dataObject) => ({
          name: dataObject.name,
          dataObject,
          children: [],
          expanded: false
        }));
        ldNode.children.push(lnNode);
      }
      tree.push(ldNode);
    }
    return {
      name: "",
      children: tree,
      expanded: true
    };
  }
  groupBy(array, key) {
    return array.reduce((result, currentValue) => {
      const groupKey = typeof key === "function" ? key(currentValue) : String(currentValue[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {});
  }
  filterNodes(node, searchTerm) {
    const isMatch = node.name.toLowerCase().includes(searchTerm);
    const filteredChildren = node.children?.map((child) => this.filterNodes(child, searchTerm)).filter((child) => child !== null);
    if (isMatch || filteredChildren.length > 0) {
      return {
        ...node,
        expanded: true,
        children: filteredChildren.length > 0 ? filteredChildren : node.children
      };
    }
    return null;
  }
  getTreeViewError(msg) {
    return html`
      <span class="treeview-error">${msg}</span>
    `;
  }
  getFilteredTreeView() {
    if (!this.rootNode) {
      return this.getTreeViewError("No root node found");
    }
    if (this.rootNode.children?.length === 0) {
      return this.getTreeViewError("No suitable options found");
    }
    const filteredRootNode = this.filterNodes(this.rootNode, this.searchTerm);
    if (!filteredRootNode || !filteredRootNode.children) {
      return this.getTreeViewError("No matching nodes found");
    }
    return html`
      ${filteredRootNode.children.map((child) => html`
      <tree-node
        .level="${0}"
        .node="${child}"
        .expanded="${true}"
        .searchTerm="${this.searchTerm}">
      </tree-node>
    `)}
    `;
  }
  clear() {
    const firstTreeNode = this.shadowRoot?.querySelector("tree-node");
    if (firstTreeNode) {
      this.clearNode(firstTreeNode, true);
    }
  }
  clearNode(node, isRoot = false) {
    if (!isRoot) {
      node.expanded = false;
    }
    const childNodes = node.shadowRoot?.querySelectorAll("tree-node");
    childNodes.forEach((childNode) => {
      this.clearNode(childNode);
    });
  }
  renderSearchInput() {
    return html`
      <text-input
        .placeholder="${"Search LN"}"
        .value="${this.searchTerm}"
        icon="search"
        @value-changed=${(e) => this.handleSearch(e.detail)}
      ></text-input>
    `;
  }
  handleSearch(searchTerm) {
    this.searchTerm = searchTerm.toLowerCase();
    this.requestUpdate();
  }
  render() {
    return html`
      <div class="treeview-container">
        <div class="treeview-header">
          ${this.renderSearchInput()}
        </div>
        <div class="treeview-content">
          ${this.getFilteredTreeView()}
        </div>
      </div>
    `;
  }
};
TreeView.styles = css`
    .treeview-container {
      height: calc(100vh - 250px);
      width: 100%;
      background-color: #fdf5e3;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .treeview-header {
      width: 95%;
      padding: 0 0.5rem;
    }

    .treeview-content {
      width: 100%;
      overflow-y: auto;
      height: 100%;
    }

    .treeview-container .treeview-error {
      color: red;
      width: 100%;
      display: flex;
      justify-content: center;
      padding-top: 1rem;
    }
  `;
__decorate([
  state()
], TreeView.prototype, "rootNode", 2);
__decorate([
  state()
], TreeView.prototype, "searchTerm", 2);
__decorate([
  state()
], TreeView.prototype, "selectedNodeId", 2);
TreeView = __decorate([
  customElement("tree-view")
], TreeView);
