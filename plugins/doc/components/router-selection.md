# router-selection

## Properties

| Property         | Attribute     | Type      | Default                |
|------------------|---------------|-----------|------------------------|
| `label`          | `label`       | `string`  | "Available Routers"    |
| `multiSelect`    | `multiSelect` | `boolean` | false                  |
| `noItemsText`    | `noItemsText` | `string`  | "No options available" |
| `routerInstance` |               | `number`  | 1                      |

## Events

| Event            | Type                         |
|------------------|------------------------------|
| `router-changed` | `CustomEvent<RouterOptions>` |
