import { customElement, LitElement, html, css, property } from "lit-element";
import '@material/mwc-icon';

@customElement("icon-button")
export class IconButton extends LitElement {
  @property({ type: Function }) onClick = () => {};
  @property({ type: String }) tooltipPosition: 'top' | 'right' | 'bottom' | 'left' = 'top';

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .icon {
      cursor: pointer;
      font-size: 24px;
      --mdc-icon-size: 24px;
    }

    .tooltip {
      visibility: hidden;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      text-align: center;
      border-radius: 4px;
      padding: 0.3rem;
      margin: 0 0.5rem;
      font-size: 12px;
      position: absolute;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      white-space: nowrap; /* Prevent wrapping */
    }

    /* Tooltip positions */
    .tooltip.top {
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%) translateY(0);
    }

    .tooltip.right {
      left: 125%;
      top: 50%;
      transform: translateY(-50%);
    }

    .tooltip.bottom {
      top: 125%;
      left: 50%;
      transform: translateX(-50%);
    }

    .tooltip.left {
      right: 125%;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Arrow positions */
    .tooltip::after {
      content: "";
      position: absolute;
      border-width: 5px;
      border-style: solid;
    }

    .tooltip.top::after {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    }

    .tooltip.right::after {
      left: -5px;
      top: 50%;
      transform: translateY(-50%);
      border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
    }

    .tooltip.bottom::after {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
    }

    .tooltip.left::after {
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      border-color: transparent transparent transparent rgba(0, 0, 0, 0.8);
    }

    :host(:hover) .tooltip {
      visibility: visible;
      opacity: 1;
    }
  `;

  _handleClick() {
    if (typeof this.onClick === 'function') {
      this.onClick();
    }
  }

  render() {
    return html`
      <div class="icon" @click="${this._handleClick}">
        <slot name="icon">
          <mwc-icon>info</mwc-icon>
        </slot>
        <div class="tooltip ${this.tooltipPosition}">
          <slot name="tooltip">This is the tooltip text</slot>
        </div>
      </div>
    `;
  }
}
