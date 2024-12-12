# graphical-editor

## Properties

| Property        | Attribute   | Type                                   | Default     |
|-----------------|-------------|----------------------------------------|-------------|
| `ancestors`     | `ancestors` | `Element[]`                            | []          |
| `connectionMap` |             | `Map<string, Connection \| undefined>` | "new Map()" |
| `doc`           | `doc`       | `XMLDocument`                          |             |
| `editCount`     | `editCount` | `number`                               | -1          |
| `element`       |             | `Element`                              |             |
| `nsdoc`         | `nsdoc`     | `Nsdoc`                                |             |
| `rectangles`    |             | `Rectangle[]`                          | []          |

## Methods

| Method                     | Type                                         |
|----------------------------|----------------------------------------------|
| `addRectangle`             | `(options: RectangleOptions): void`          |
| `clearAllRectangles`       | `(): void`                                   |
| `correctInitialPositions`  | `(): void`                                   |
| `handleRectangleMouseDown` | `(event: MouseEvent, rect: Rectangle): void` |
| `removeLine`               | `(id: string): void`                         |
| `removeRectangle`          | `(rectangle: Rectangle): void`               |
| `removeRectangleById`      | `(id: string): void`                         |
| `selectRectangle`          | `(rect: Rectangle): void`                    |
| `updateConnections`        | `(): void`                                   |
