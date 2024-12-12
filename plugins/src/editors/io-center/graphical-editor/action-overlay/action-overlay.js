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
import {css, customElement, html, LitElement, property} from "../../../../../../_snowpack/pkg/lit-element.js";
export let ActionOverlay = class extends LitElement {
  constructor() {
    super();
    this.actions = [];
    this.direction = "vertical";
    this.rectangleWidth = 100;
  }
  createAction(action) {
    return html`
      <icon-button .onClick="${action.action}">
        <span slot="icon">
          <mwc-icon>${action.icon}</mwc-icon>
        </span>
        <span slot="tooltip">${action.name || ""}</span>
      </icon-button>
    `;
  }
  render() {
    return html`
      <div class="action-overlay-container ${this.direction}" style="width: ${this.rectangleWidth}px;">
        ${this.actions.map((action) => this.createAction(action))}
      </div>
    `;
  }
};
ActionOverlay.styles = css`
    .action-overlay-container {
      background-color: #faf4e6; /* Soft cream background */
      border: 1px solid #ccc; /* Lighter border for consistency */
      padding: 8px;
      border-radius: 6px; /* Slightly rounded corners */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for elevation */
      z-index: 1000;
      position: absolute;
      display: flex;
      align-items: center;
      transition: width 0.2s ease, box-shadow 0.2s ease;
    }

    .action-overlay-container.vertical {
      flex-direction: column;
    }

    .action-overlay-container.horizontal {
      flex-direction: row;
      padding: 8px 12px; /* More padding for horizontal layout */
    }

    /* Styling for the icon buttons */
    icon-button {
      margin: 4px 0; /* Increased margin for vertical layout */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff; /* Background to match the cream aesthetic */
      border-radius: 50%; /* Make icon buttons circular */
      width: 32px;
      height: 32px;
      border: 1px solid #ccc; /* Subtle border */
      transition: background-color 0.2s ease, box-shadow 0.2s ease;
    }

    /* Horizontal layout adjustments */
    .horizontal icon-button {
      margin: 0 4px; /* Horizontal spacing */
    }

    /* Hover and active effects */
    icon-button:hover {
      background-color: #f0e9d2; /* Light hover effect */
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* Slight shadow on hover */
    }

    mwc-icon {
      font-size: 18px; /* Smaller, consistent icon size */
      color: #333; /* Dark gray for icon */
      transition: color 0.2s ease;
    }

    /* Icon color on hover */
    icon-button:hover mwc-icon {
      color: #000; /* Slightly darker on hover */
    }

    .icon-delete {
      color: #d9534f; /* Red for the delete action */
    }
  `;
__decorate([
  property({type: Array})
], ActionOverlay.prototype, "actions", 2);
__decorate([
  property({type: String})
], ActionOverlay.prototype, "direction", 2);
__decorate([
  property({type: Number})
], ActionOverlay.prototype, "rectangleWidth", 2);
ActionOverlay = __decorate([
  customElement("action-overlay")
], ActionOverlay);
