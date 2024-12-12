# io-center-container

## Properties

| Property          | Attribute    | Type              | Default |
|-------------------|--------------|-------------------|---------|
| `ancestors`       | `ancestors`  | `Element[]`       | []      |
| `currentIed`      | `currentIed` | `string`          | ""      |
| `doc`             | `doc`        | `XMLDocument`     |         |
| `editCount`       | `editCount`  | `number`          | -1      |
| `element`         |              | `Element`         |         |
| `graphicalEditor` |              | `GraphicalEditor` |         |
| `lpList`          |              | `LpList`          |         |
| `nsdoc`           | `nsdoc`      | `Nsdoc`           |         |
| `treeView`        |              | `TreeView`        |         |

## Methods

| Method                  | Type                                             |
|-------------------------|--------------------------------------------------|
| `processRouterLN`       | `(routerLN: Element, lnRefDataObject: DataObject): ConnectionObject[]` |
| `saveEditor`            | `(): void`                                       |
| `updateLpModels`        | `(): void`                                       |
| `updateTreeDataObjects` | `(): void`                                       |
