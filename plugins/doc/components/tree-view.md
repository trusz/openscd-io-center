# tree-view

## Properties

| Property     | Type     | Default |
|--------------|----------|---------|
| `searchTerm` | `string` | ""      |

## Methods

| Method                | Type                                             |
|-----------------------|--------------------------------------------------|
| `clear`               | `(): void`                                       |
| `clearNode`           | `(node: TreeNode, isRoot?: boolean): void`       |
| `createTreeView`      | `(dataObjects: DataObject[]): ITreeNode`         |
| `filterNodes`         | `(node: ITreeNode, searchTerm: string): ITreeNode \| null` |
| `getFilteredTreeView` | `(): TemplateResult<1>`                          |
