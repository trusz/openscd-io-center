var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import {LitElement, property} from "../../../../_snowpack/pkg/lit-element.js";
export class IoCenterFoundation extends LitElement {
  constructor() {
    super();
    this.editCount = -1;
    this.ancestors = [];
  }
}
__decorate([
  property()
], IoCenterFoundation.prototype, "doc", 2);
__decorate([
  property({type: Number})
], IoCenterFoundation.prototype, "editCount", 2);
__decorate([
  property({attribute: false})
], IoCenterFoundation.prototype, "element", 2);
__decorate([
  property()
], IoCenterFoundation.prototype, "nsdoc", 2);
__decorate([
  property()
], IoCenterFoundation.prototype, "ancestors", 2);
