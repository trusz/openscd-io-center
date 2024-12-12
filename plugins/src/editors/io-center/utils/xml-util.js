export function writeXMLDictToXML(xmlDict, ied, doc) {
  const iedElement = doc.querySelector(`IED[name="${ied}"]`);
  if (!iedElement) {
    console.error(`IED with name="${ied}" not found.`);
    return;
  }
  const lDeviceElement = iedElement.querySelector('LDevice[inst="LD0"]');
  if (!lDeviceElement) {
    console.error(`LDevice with inst="LD0" not found in IED "${ied}".`);
    return;
  }
  Object.keys(xmlDict).forEach((routerId) => {
    const router = xmlDict[routerId];
    removeExistingRouterLN(doc, router.type, router.inst, ied);
    const lnElement = doc.createElementNS("http://www.iec.ch/61850/2003/SCL", "LN");
    lnElement.setAttribute("lnClass", router.type);
    lnElement.setAttribute("inst", router.inst);
    lnElement.setAttribute("lnType", router.name);
    Object.keys(router.dois).forEach((doi) => {
      const doiObj = router.dois[doi];
      const lnRef = doiObj.lnRef;
      const doiElement = doc.createElementNS("http://www.iec.ch/61850/2003/SCL", "DOI");
      doiElement.setAttribute("name", doiObj.name);
      doiElement.setAttribute("desc", doiObj.desc);
      const lnRefElement = doc.createElementNS("http://www.iec.ch/61850/2003/SCL", "LNRef");
      lnRefElement.setAttribute("refLDInst", lnRef.refLDInst);
      lnRefElement.setAttribute("refLNClass", lnRef.refLNClass);
      lnRefElement.setAttribute("refLNInst", lnRef.refLNInst);
      lnRefElement.setAttribute("refDO", lnRef.refDO);
      doiElement.appendChild(lnRefElement);
      lnElement.appendChild(doiElement);
    });
    lDeviceElement.appendChild(lnElement);
  });
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
export function checkIfRouterLNExists(doc, type, inst, ied) {
  const iedElement = doc.querySelector(`IED[name="${ied}"]`);
  if (!iedElement) {
    console.error(`IED with name="${ied}" not found.`);
    return false;
  }
  const lDeviceElement = iedElement.querySelector(`LDevice[inst="LD0"]`);
  if (!lDeviceElement) {
    console.error(`LDevice with inst="LD0" not found in IED "${ied}".`);
    return false;
  }
  const existingLN = lDeviceElement.querySelector(`LN[lnClass="${type}"][inst="${inst}"]`);
  return !!existingLN;
}
export function removeExistingRouterLN(doc, type, inst, ied) {
  const iedElement = doc.querySelector(`IED[name="${ied}"]`);
  if (!iedElement) {
    console.error(`IED with name="${ied}" not found.`);
    return false;
  }
  const lDeviceElement = iedElement.querySelector('LDevice[inst="LD0"]');
  if (!lDeviceElement) {
    console.error(`LDevice with inst="LD0" not found in IED "${ied}".`);
    return false;
  }
  const existingLN = lDeviceElement.querySelector(`LN[lnClass="${type}"][inst="${inst}"]`);
  if (existingLN) {
    existingLN.remove();
    console.log(`Removed LN with lnClass="${type}" and inst="${inst}" in IED "${ied}".`);
    return true;
  } else {
    console.log(`LN with lnClass="${type}" and inst="${inst}" not found in IED "${ied}".`);
    return false;
  }
}
export function getParentLN(xmlElement) {
  if (!xmlElement) {
    console.error("Provided XML element is null or undefined.");
    return null;
  }
  const parentLN = xmlElement.closest("LN");
  if (parentLN) {
    console.log(`Found parent LN with lnClass="${parentLN.getAttribute("lnClass")}".`);
    return parentLN;
  }
  return null;
}
export function checkIfLNRefExists(doc, refLDInst, refLNClass, refLNInst, refDO, ied) {
  const iedElement = doc.querySelector(`IED[name="${ied}"]`);
  if (!iedElement) {
    console.error(`IED with name="${ied}" not found.`);
    return null;
  }
  const lDeviceElement = iedElement.querySelector(`LDevice[inst="LD0"]`);
  if (!lDeviceElement) {
    console.error(`LDevice with inst="LD0" not found in IED "${ied}".`);
    return null;
  }
  const lnRefElement = lDeviceElement.querySelector(`LN > DOI > LNRef[refLDInst="${refLDInst}"][refLNClass="${refLNClass}"][refLNInst="${refLNInst}"][refDO="${refDO}"]`);
  if (lnRefElement) {
    console.log(`LNRef element found in IED "${ied}".`);
    return lnRefElement;
  }
  console.log(`No LNRef with refLDInst="${refLDInst}", refLNClass="${refLNClass}", refLNInst="${refLNInst}", and refDO="${refDO}" found in IED "${ied}".`);
  return null;
}
export function checkIfRouterExists(doc, routerTypes, ied) {
  const iedElement = doc.querySelector(`IED[name="${ied}"]`);
  if (!iedElement) {
    console.error(`IED with name="${ied}" not found.`);
    return false;
  }
  const lDeviceElement = iedElement.querySelector(`LDevice[inst="LD0"]`);
  if (!lDeviceElement) {
    console.error(`LDevice with inst="LD0" not found in IED "${ied}".`);
    return false;
  }
  for (const routerType of routerTypes) {
    const lnElement = lDeviceElement.querySelector(`LN[lnClass="${routerType}"]`);
    if (lnElement) {
      console.log(`Router with type "${routerType}" exists in LDevice "LD0" of IED "${ied}".`);
      return true;
    }
  }
  console.log(`No routers found in LDevice "LD0" of IED "${ied}".`);
  return false;
}
export function getLPsFromIED(doc, ied) {
  const iedElement = doc.querySelector(`IED[name="${ied}"]`);
  if (!iedElement) {
    console.error(`IED with name="${ied}" not found.`);
    return [];
  }
  const lDeviceElement = iedElement.querySelector(`LDevice[inst="LD0"]`);
  if (!lDeviceElement) {
    console.error(`LDevice with inst="LD0" not found in IED "${ied}".`);
    return [];
  }
  return Array.from(lDeviceElement.querySelectorAll('LN[lnClass="LPDI"], LN[lnClass="LPDO"], LN[lnClass="LPAI"], LN[lnClass="LPAO"]'));
}
