import {css, html, LitElement} from 'lit';
import {customElement, property, state} from 'lit-element';
import {TreeNode} from './treenode';


import './treenode';
import '../components/forms/text-input';

import {TreeviewService} from "./treeview.service";
import {Subscription} from "rxjs";
import {ITreeNode} from "./treenode.interface";
import {DataObject} from "../element-manager/data-object";

@customElement('tree-view')
export class TreeView extends LitElement {
  @state() private rootNode: ITreeNode | undefined = undefined;
  @state() searchTerm: string = '';
  @state() private selectedNodeId: string | null = null;


  private treeviewService = TreeviewService.getInstance();
  private subList: Subscription[] = [];

  constructor() {
    super();
    this.subList.push(
      this.treeviewService.treeDataObjects$.subscribe((dataObjects) => {
        if (dataObjects && dataObjects.length > 0) {
          this.rootNode = this.createTreeView(dataObjects);
          this.requestUpdate();
        } else {
          console.warn('No dataObjects found');
        }
      })
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subList.forEach(sub => sub.unsubscribe());
  }

  createTreeView(dataObjects: DataObject[]): ITreeNode {
    const tree: ITreeNode[] = [];

    // Group by ldRef
    const ldRefGroups = this.groupBy(dataObjects, 'ldRef');
    for (const [ldRef, ldRefDataObjects] of Object.entries(ldRefGroups)) {
      const ldNode: ITreeNode = {
        name: ldRef,
        children: [],
        expanded: true
      };

      // Group by lnType-lnInst within each ldRef
      const lnTypeInstGroups = this.groupBy(ldRefDataObjects, (obj) => `${obj.lnClass}-${obj.lnInst}`);
      for (const [lnTypeInst, lnTypeInstDataObjects] of Object.entries(lnTypeInstGroups)) {
        const lnNode: ITreeNode = {
          name: lnTypeInst,
          children: [],
          expanded: true
        };

        // Add leaf nodes (names)
        lnNode.children = lnTypeInstDataObjects.map((dataObject) => ({
          name: dataObject.name,
          dataObject: dataObject,
          children: [],
          expanded: false
        }));

        // Add to ldNode's children
        ldNode.children!.push(lnNode);
      }

      // Add to the tree
      tree.push(ldNode);
    }

    // Return the root node without a name, but include its children
    return {
      name: "",
      children: tree,
      expanded: true
    };
  }

  private groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
    return array.reduce((result, currentValue) => {
      const groupKey = typeof key === 'function' ? key(currentValue) : String(currentValue[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(currentValue);
      return result;
    }, {} as Record<string, T[]>);
  }

  filterNodes(node: ITreeNode, searchTerm: string): ITreeNode | null {
    const isMatch = node.name.toLowerCase().includes(searchTerm);

    const filteredChildren = node.children
      ?.map((child) => this.filterNodes(child, searchTerm))
      .filter((child) => child !== null) as ITreeNode[];

    if (isMatch || filteredChildren.length > 0) {
      return {
        ...node,
        expanded: true,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      };
    }

    return null;
  }

  private getTreeViewError(msg: string) {
    return html`
      <span class="treeview-error">${msg}</span>
    `;
  }

  getFilteredTreeView() {
    if (!this.rootNode) {
      return this.getTreeViewError('No root node found');
    }

    if (this.rootNode.children?.length === 0) {
      return this.getTreeViewError('No suitable options found');
    }

    const filteredRootNode = this.filterNodes(this.rootNode, this.searchTerm);

    if (!filteredRootNode || !filteredRootNode.children) {
      return this.getTreeViewError('No matching nodes found');
    }

    return html`
      ${filteredRootNode.children.map(child => html`
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
    const firstTreeNode = this.shadowRoot?.querySelector('tree-node') as TreeNode;

    if (firstTreeNode) {
      this.clearNode(firstTreeNode, true);
    }
  }

  clearNode(node: TreeNode, isRoot = false) {
    if (!isRoot) {
      node.expanded = false;
    }

    const childNodes = node.shadowRoot?.querySelectorAll('tree-node') as NodeListOf<TreeNode>;
    childNodes.forEach((childNode) => {
      this.clearNode(childNode);
    });
  }

  private renderSearchInput() {
    return html`
      <text-input
        .placeholder="${'Search LN'}"
        .value="${this.searchTerm}"
        icon="search"
        @value-changed=${(e: CustomEvent) => this.handleSearch(e.detail)}
      ></text-input>
    `;
  }

  private handleSearch(searchTerm: string) {
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

  static styles = css`
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
}
