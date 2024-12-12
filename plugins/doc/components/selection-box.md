# selection-box

## Properties

| Property        | Attribute       | Type              | Default                  |
|-----------------|-----------------|-------------------|--------------------------|
| `dropdownOpen`  | `dropdownOpen`  | `boolean`         | false                    |
| `error`         | `error`         | `boolean`         | false                    |
| `errorMessage`  | `errorMessage`  | `string`          | "This field is required" |
| `items`         | `items`         | `SelectionItem[]` | []                       |
| `label`         | `label`         | `string`          | ""                       |
| `multiSelect`   | `multiSelect`   | `boolean`         | false                    |
| `noItemsText`   | `noItemsText`   | `string`          | "No options available"   |
| `required`      | `required`      | `boolean`         | false                    |
| `selectedItems` | `selectedItems` | `array`           | []                       |

## Methods

| Method       | Type       |
|--------------|------------|
| `resetInput` | `(): void` |

## Events

| Event               | Type                                     |
|---------------------|------------------------------------------|
| `selection-changed` | `CustomEvent<{ selectedItems: any[]; }>` |
