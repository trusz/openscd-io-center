# text-input

## Properties

| Property       | Attribute      | Type                                    | Default                  |
|----------------|----------------|-----------------------------------------|--------------------------|
| `error`        | `error`        | `boolean`                               | false                    |
| `errorMessage` | `errorMessage` | `string`                                | "This field is required" |
| `icon`         | `icon`         | `string`                                | ""                       |
| `label`        | `label`        | `string`                                | ""                       |
| `name`         | `name`         | `string`                                | ""                       |
| `placeholder`  | `placeholder`  | `string`                                | ""                       |
| `required`     | `required`     | `boolean`                               | false                    |
| `validators`   | `validators`   | `((value: string) => string \| null)[]` | []                       |
| `value`        |                | `string`                                |                          |

## Methods

| Method       | Type       |
|--------------|------------|
| `resetInput` | `(): void` |

## Events

| Event           | Type                  |
|-----------------|-----------------------|
| `value-changed` | `CustomEvent<string>` |
