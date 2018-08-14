"use strict";

export function getKeys(jsonObj, typeFilter) {
  let keys = [];
  for (let key in jsonObj) {
    if (!jsonObj.hasOwnProperty(key)) continue;
    if (typeFilter != null && typeFilter !== typeof jsonObj[key]) continue;
    keys.push(key);
  }
  return keys;
}

export function updatePullDown(id, keys) {
  const pullDown = document.getElementById(id);
  pullDown.innerHTML = generateListFromKeys(keys);
}

function generateListFromKeys(keys) {
  let html = "";
  for (let key of keys) {
    html += `<option>${key}</option>`;
  }
  return html;
}

export function getImageList(json) {
  let keys = getKeys(json);
  return keys;
}

export function getEncoderList(json) {
  let keys = getKeys(json);
  const lastPhoto = json[keys[keys.length - 1]];
  return getKeys(lastPhoto, "object");
}

export function getQualityList(json) {
  let keys = getKeys(json);
  const lastPhoto = json[keys[keys.length - 1]];

  keys = getKeys(lastPhoto, "object");
  const lastEncoder = lastPhoto[keys[keys.length - 1]];

  keys = getKeys(lastEncoder, "object");
  keys.sort(function(a, b) {
    let aNum = parseInt(a);
    let bNum = parseInt(b);
    if (aNum > bNum) return -1;
    if (aNum < bNum) return 1;
    return 0;
  });
  if (keys[0] === "100") {
    keys.shift();
  }
  return keys;
}

export function generateImageURL(originalURL, encoder, quality) {
  const index = originalURL.lastIndexOf("/");
  const dir = originalURL.substring(0, index);
  let fileName = originalURL.substring(index);
  if (encoder === "webp") {
    fileName = fileName.replace(/\.[^.]*$/, ".webp");
  }
  return `${dir}/${encoder}/${quality}${fileName}`;
}
