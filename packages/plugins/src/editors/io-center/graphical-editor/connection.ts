import {Rectangle} from "./rectangle";

export class Connection {
  constructor(
    private readonly _id: string,
    private readonly _from: Rectangle,
    private readonly _to: Rectangle,
  ) {
  }
}
