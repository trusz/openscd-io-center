# form-group

## Properties

| Property      | Attribute     | Type      | Default |
|---------------|---------------|-----------|---------|
| `isFormValid` | `isFormValid` | `boolean` | false   |

## Methods

| Method           | Type                                             |
|------------------|--------------------------------------------------|
| `registerInput`  | `(name: string, initialValidity: boolean): void` |
| `resetFormGroup` | `(): void`                                       |
| `updateValidity` | `(name: string, isValid: boolean): void`         |

## Events

| Event                   | Type                                 |
|-------------------------|--------------------------------------|
| `form-validity-changed` | `CustomEvent<{ isValid: boolean; }>` |
