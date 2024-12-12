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
import {css, html, LitElement, property, query, state} from "../../../_snowpack/pkg/lit-element.js";
import {get} from "../../../_snowpack/pkg/lit-translate.js";
import {compareNames, getDescriptionAttribute, getNameAttribute} from "../../../openscd/src/foundation.js";
import "./io-center/io-center-container.js";
import {nothing} from "../../../_snowpack/pkg/lit-html.js";
export default class IoCenterPlugin extends LitElement {
  constructor() {
    super(...arguments);
    this.editCount = -1;
    this.selectedIEDs = [];
    this.selectedLNClasses = [];
    this.logicalDevices = [];
    this.currentIed = void 0;
    this.lNClassListOpenedOnce = false;
  }
  get iedList() {
    return this.doc ? Array.from(this.doc.querySelectorAll(":root > IED")).sort((a, b) => compareNames(a, b)) : [];
  }
  get selectedIed() {
    if (this.selectedIEDs.length > 0) {
      const iedList = this.iedList;
      return iedList.find((element) => {
        const iedName = getNameAttribute(element);
        return this.selectedIEDs[0] === iedName;
      });
    }
    return void 0;
  }
  get lnClassList() {
    const currentIed = this.selectedIed;
    const uniqueLNClassList = [];
    if (currentIed) {
      return Array.from(currentIed.querySelectorAll("LN0, LN")).filter((element) => element.hasAttribute("lnClass")).filter((element) => {
        const lnClass = element.getAttribute("lnClass") ?? "";
        if (uniqueLNClassList.includes(lnClass)) {
          return false;
        }
        uniqueLNClassList.push(lnClass);
        return true;
      }).sort((a, b) => {
        const aLnClass = a.getAttribute("lnClass") ?? "";
        const bLnClass = b.getAttribute("lnClass") ?? "";
        return aLnClass.localeCompare(bLnClass);
      }).map((element) => {
        const lnClass = element.getAttribute("lnClass");
        const label = this.nsdoc.getDataDescription(element).label;
        return [lnClass, label];
      });
    }
    return [];
  }
  updated(_changedProperties) {
    super.updated(_changedProperties);
    const isDocumentUpdated = _changedProperties.has("doc") || _changedProperties.has("editCount") || _changedProperties.has("nsdoc");
    if (isDocumentUpdated) {
      const iedExists = this.doc?.querySelector(`IED[name="${this.selectedIEDs[0]}"]`);
      if (iedExists)
        return;
      this.selectedIEDs = [];
      this.selectedLNClasses = [];
      this.lNClassListOpenedOnce = false;
      const iedList = this.iedList;
      if (iedList.length > 0) {
        const iedName = getNameAttribute(iedList[0]);
        if (iedName) {
          this.selectedIEDs = [iedName];
        }
      }
    }
  }
  calcSelectedLNClasses() {
    const somethingSelected = this.selectedLNClasses.length > 0;
    const lnClasses = this.lnClassList.map((lnClassInfo) => lnClassInfo[0]);
    let selectedLNClasses = lnClasses;
    if (somethingSelected) {
      selectedLNClasses = lnClasses.filter((lnClass) => this.selectedLNClasses.includes(lnClass));
    }
    return selectedLNClasses;
  }
  render() {
    const iedList = this.iedList;
    if (iedList.length > 0) {
      const iedName = this.selectedIEDs[0];
      if (!iedName) {
        return html`<h1>
          <span style="color: var(--base1)">${get("didoeditor.missing")}</span>
        </h1>`;
      }
      return html`
        <section class="io-center-main-container">
          <div class="header">
              <h1>${get("filters")}:</h1>
              <oscd-filter-button
                id="iedFilter"
                icon="developer_board"
                .header=${get("iededitor.iedSelector")}
                @selected-items-changed="${(e) => {
        const equalArrays = (first, second) => {
          return first.length === second.length && first.every((val, index) => val === second[index]);
        };
        const selectionChanged = !equalArrays(this.selectedIEDs, e.detail.selectedItems);
        if (!selectionChanged) {
          return;
        }
        this.lNClassListOpenedOnce = false;
        this.selectedIEDs = e.detail.selectedItems;
        this.selectedLNClasses = [];
        this.requestUpdate("selectedIed");
      }}"
              >
                ${iedList.map((ied) => {
        const name = getNameAttribute(ied);
        const descr = getDescriptionAttribute(ied);
        const type = ied.getAttribute("type");
        const manufacturer = ied.getAttribute("manufacturer");
        return html`
                  <mwc-radio-list-item
                    value="${name}"
                    ?twoline="${type && manufacturer}"
                    ?selected="${this.selectedIEDs.includes(name ?? "")}"
                  >
                    ${name} ${descr ? html` (${descr})` : html``}
                    <span slot="secondary">
                  ${type} ${type && manufacturer ? html`&mdash;` : nothing}
                  ${manufacturer}
                </span>
                  </mwc-radio-list-item>`;
      })}
              </oscd-filter-button>
          </div>

          <io-center-container
            .currentIed=${iedName}
            .editCount=${this.editCount}
            .doc=${this.doc}
            .element=${this.selectedIed}
            .selectedLNClasses=${this.calcSelectedLNClasses()}
            .nsdoc=${this.nsdoc}
          ></io-center-container>
        </section>
      `;
    }
    return html`<h1>
      <span style="color: var(--base1)">${get("didoeditor.missing")}</span>
    </h1>`;
  }
}
IoCenterPlugin.styles = css`
    :host {
      width: 100vw;
      height: 100vh;
    }

    .io-center-main-container {
      height: calc(100vh - 190px);
      width: auto;
      padding: 8px 12px 16px;
    }

    .header {
      display: flex;
    }

    h1 {
      color: var(--mdc-theme-on-surface);
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px;
      line-height: 48px;
      padding-left: 0.3em;
    }

    .elementPath {
      margin-left: auto;
      padding-right: 12px;
    }
  `;
__decorate([
  property()
], IoCenterPlugin.prototype, "doc", 2);
__decorate([
  property({type: Number})
], IoCenterPlugin.prototype, "editCount", 2);
__decorate([
  property()
], IoCenterPlugin.prototype, "nsdoc", 2);
__decorate([
  query("io-center-container")
], IoCenterPlugin.prototype, "ioCenterContainer", 2);
__decorate([
  state()
], IoCenterPlugin.prototype, "selectedIEDs", 2);
__decorate([
  state()
], IoCenterPlugin.prototype, "selectedLNClasses", 2);
__decorate([
  state()
], IoCenterPlugin.prototype, "logicalDevices", 2);
__decorate([
  state()
], IoCenterPlugin.prototype, "iedList", 1);
__decorate([
  state()
], IoCenterPlugin.prototype, "currentIed", 2);
__decorate([
  state()
], IoCenterPlugin.prototype, "selectedIed", 1);
__decorate([
  state()
], IoCenterPlugin.prototype, "lnClassList", 1);
