# data-attributes-editor

## Properties

| Property              | Attribute             | Type                       | Default     |
|-----------------------|-----------------------|----------------------------|-------------|
| `doc`                 | `doc`                 | `XMLDocument \| undefined` | "undefined" |
| `filteredDataObjects` | `filteredDataObjects` | `array`                    | []          |
| `formGroup`           | `formGroup`           | `FormGroup`                |             |
| `lnClass`             | `lnClass`             | `string`                   | ""          |
| `showOnlyModified`    | `showOnlyModified`    | `boolean`                  | false       |

## Methods

| Method                 | Type       |
|------------------------|------------|
| `clearComponent`       | `(): void` |
| `resetAttributeValues` | `(): void` |

## Events

| Event          | Type                                             |
|----------------|--------------------------------------------------|
| `data-changed` | `CustomEvent<{ [dataObjectName: string]: { [attributeName: string]: any; }; }>` |
