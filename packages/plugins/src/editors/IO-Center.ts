import {css, html, LitElement, property, PropertyValues, query, state, TemplateResult} from "lit-element";
import {Nsdoc} from '@openscd/open-scd/src/foundation/nsdoc.js';
import {get} from "lit-translate";
import {compareNames, getDescriptionAttribute, getNameAttribute,} from '@openscd/open-scd/src/foundation.js';
import {SelectedItemsChangedEvent} from '@openscd/open-scd/src/oscd-filter-button.js';


import './io-center/io-center-container.js';
import {nothing} from "lit-html";
import {IIED} from "./io-center/interfaces/ied.interface";
import {IoCenterContainer} from "./io-center/io-center-container";
import {ILogicalDevice} from "./io-center/interfaces/logical-device.interface";

/** An editor [[`plugin`]] for editing the `IO Center Plugin` section. */
export default class IoCenterPlugin extends LitElement {
  /** The document being edited as provided to plugins by [[`OpenSCD`]]. */
  @property()
  doc!: XMLDocument;

  @property({type: Number})
  editCount = -1;

  /** All the nsdoc files that are being uploaded via the settings. */
  @property()
  nsdoc!: Nsdoc;

  @query('io-center-container')
  ioCenterContainer!: IoCenterContainer;

  @state()
  selectedIEDs: string[] = [];

  @state()
  selectedLNClasses: string[] = [];

  @state()
  logicalDevices: ILogicalDevice[] = [];

  @state()
  private get iedList(): Element[] {
    return this.doc
      ? Array.from(this.doc.querySelectorAll(':root > IED')).sort((a, b) =>
        compareNames(a, b)
      )
      : [];
  }

  @state()
  currentIed?: IIED = undefined;

  @state()
  private get selectedIed(): Element | undefined {
    if (this.selectedIEDs.length > 0) {
      const iedList = this.iedList;
      return iedList.find(element => {
        const iedName = getNameAttribute(element);
        return this.selectedIEDs[0] === iedName;
      });
    }

    return undefined;
  }

  @state()
  private get lnClassList(): string[][] {
    const currentIed = this.selectedIed;
    const uniqueLNClassList: string[] = [];
    if (currentIed) {
      return Array.from(currentIed.querySelectorAll('LN0, LN'))
        .filter(element => element.hasAttribute('lnClass'))
        .filter(element => {
          const lnClass = element.getAttribute('lnClass') ?? '';
          if (uniqueLNClassList.includes(lnClass)) {
            return false;
          }
          uniqueLNClassList.push(lnClass);
          return true;
        })
        .sort((a, b) => {
          const aLnClass = a.getAttribute('lnClass') ?? '';
          const bLnClass = b.getAttribute('lnClass') ?? '';

          return aLnClass.localeCompare(bLnClass);
        })
        .map(element => {
          const lnClass = element.getAttribute('lnClass');
          const label = this.nsdoc.getDataDescription(element).label;
          return [lnClass, label];
        }) as string[][];
    }
    return [];
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When the document is updated, we reset the selected IED if it no longer exists
    const isDocumentUpdated =
      _changedProperties.has('doc') ||
      _changedProperties.has('editCount') ||
      _changedProperties.has('nsdoc');

    if (isDocumentUpdated) {
      // if the IED exists, retain selection
      const iedExists = this.doc?.querySelector(
        `IED[name="${this.selectedIEDs[0]}"]`
      );

      if (iedExists) return;

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

  private calcSelectedLNClasses(): string[] {
    const somethingSelected = this.selectedLNClasses.length > 0;
    const lnClasses = this.lnClassList.map(lnClassInfo => lnClassInfo[0]);

    let selectedLNClasses = lnClasses;

    if (somethingSelected) {
      selectedLNClasses = lnClasses.filter(lnClass =>
        this.selectedLNClasses.includes(lnClass)
      );
    }

    return selectedLNClasses;
  }

  lNClassListOpenedOnce = false;

  render(): TemplateResult {
    const iedList = this.iedList;

    if (iedList.length > 0) {
      const iedName = this.selectedIEDs[0];
      if (!iedName) {
        return html`<h1>
          <span style="color: var(--base1)">${get('didoeditor.missing')}</span>
        </h1>`;
      }

      return html`
        <section class="io-center-main-container">
          <div class="header">
              <h1>${get('filters')}:</h1>
              <oscd-filter-button
                id="iedFilter"
                icon="developer_board"
                .header=${get('iededitor.iedSelector')}
                @selected-items-changed="${(e: SelectedItemsChangedEvent) => {
                  const equalArrays = <T>(first: T[], second: T[]): boolean => {
                    return (
                      first.length === second.length &&
                      first.every((val, index) => val === second[index])
                    );
                  };

                  const selectionChanged = !equalArrays(
                    this.selectedIEDs,
                    e.detail.selectedItems
                  );

                  if (!selectionChanged) {
                    return;
                  }

                  this.lNClassListOpenedOnce = false;
                  this.selectedIEDs = e.detail.selectedItems;
                  this.selectedLNClasses = [];
                  this.requestUpdate('selectedIed');
                }}"
              >
                ${iedList.map(ied => {
                  const name = getNameAttribute(ied);
                  const descr = getDescriptionAttribute(ied);
                  const type = ied.getAttribute('type');
                  const manufacturer = ied.getAttribute('manufacturer');
                  return html`
                  <mwc-radio-list-item
                    value="${name}"
                    ?twoline="${type && manufacturer}"
                    ?selected="${this.selectedIEDs.includes(name ?? '')}"
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
      `
    }
    return html`<h1>
      <span style="color: var(--base1)">${get('didoeditor.missing')}</span>
    </h1>`;
  }

  static styles = css`
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
}
