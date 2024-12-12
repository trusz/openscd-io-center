# lp-list

## Properties

| Property        | Attribute    | Type              | Default     |
|-----------------|--------------|-------------------|-------------|
| `ancestors`     | `ancestors`  | `Element[]`       | []          |
| `doc`           | `doc`        | `XMLDocument`     |             |
| `editCount`     | `editCount`  | `number`          | -1          |
| `element`       |              | `Element`         |             |
| `lpItems`       |              | `DataObject[]`    | []          |
| `nsdoc`         | `nsdoc`      | `Nsdoc`           |             |
| `searchTerm`    | `searchTerm` | `string`          | ""          |
| `selectedItems` |              | `Set<DataObject>` | "new Set()" |

## Methods

| Method            | Type                       |
|-------------------|----------------------------|
| `clear`           | `(): void`                 |
| `handleItemClick` | `(item: DataObject): void` |
