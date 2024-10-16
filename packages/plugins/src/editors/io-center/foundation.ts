import {LitElement, property} from "lit-element";
import { Nsdoc } from '@openscd/open-scd/src/foundation/nsdoc.js';

export class IoCenterFoundation extends LitElement {
  @property()
  doc!: XMLDocument;
  @property({ type: Number })
  editCount = -1;

  @property({ attribute: false })
  element!: Element;

  @property()
  nsdoc!: Nsdoc;

  @property()
  ancestors: Element[] = [];

  constructor() {
    super();
  }
}
