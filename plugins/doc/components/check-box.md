# check-box

## Properties

| Property       | Attribute      | Type      | Default                  |
|----------------|----------------|-----------|--------------------------|
| `checked`      | `checked`      | `boolean` | false                    |
| `error`        | `error`        | `boolean` | false                    |
| `errorMessage` | `errorMessage` | `string`  | "This field is required" |
| `label`        | `label`        | `string`  | ""                       |
| `required`     | `required`     | `boolean` | false                    |

## Methods

| Method       | Type       |
|--------------|------------|
| `resetInput` | `(): void` |

## Events

| Event           | Type                   |
|-----------------|------------------------|
| `value-changed` | `CustomEvent<boolean>` |
