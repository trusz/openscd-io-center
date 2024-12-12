# number-input

## Properties

| Property       | Attribute      | Type             | Default                  |
|----------------|----------------|------------------|--------------------------|
| `error`        | `error`        | `boolean`        | false                    |
| `errorMessage` | `errorMessage` | `string`         | "This field is required" |
| `label`        | `label`        | `string`         | ""                       |
| `max`          | `max`          | `number \| null` | null                     |
| `min`          | `min`          | `number \| null` | null                     |
| `placeholder`  | `placeholder`  | `string`         | ""                       |
| `required`     | `required`     | `boolean`        | false                    |
| `value`        | `value`        | `number \| null` | null                     |

## Methods

| Method       | Type       |
|--------------|------------|
| `resetInput` | `(): void` |

## Events

| Event           | Type                                      |
|-----------------|-------------------------------------------|
| `value-changed` | `CustomEvent<{ value: number \| null; }>` |
