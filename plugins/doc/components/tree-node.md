# tree-node

## Properties

| Property              | Attribute       | Type                      | Default      |
|-----------------------|-----------------|---------------------------|--------------|
| `addedToEditor`       | `addedToEditor` | `boolean`                 | false        |
| `currentSelectedNode` |                 | `DataObject \| undefined` |              |
| `expanded`            | `expanded`      | `boolean`                 | false        |
| `isSelected`          |                 | `boolean`                 | false        |
| `level`               | `level`         | `number`                  | 0            |
| `node`                | `node`          | `ITreeNode`               | "undefined!" |
| `path`                | `path`          | `string`                  | ""           |
| `searchTerm`          | `searchTerm`    | `string`                  | ""           |

## Methods

| Method         | Type                      |
|----------------|---------------------------|
| `selectNode`   | `(node: ITreeNode): void` |
| `toggleExpand` | `(): void`                |
