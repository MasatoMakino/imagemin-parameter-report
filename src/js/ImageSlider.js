export default class {
  constructor() {
    this.json = {};
  }

  init(json) {
    this.json = json;

    let left = document.getElementById("leftImage");
    let right = document.getElementById("rightImage");

    left.src = "img/jpg_photo/mozJpeg/30/l0134.jpg";
    right.src = "img/jpg_photo/mozJpeg/90/l0134.jpg";

    this.initSrcPullDown(json);
    this.initEncoderPullDown(json);
    this.initQualityPullDown(json);
  }

  initSrcPullDown(json) {
    let keys = this.getKeys(json);
    this.updatePullDown("srcImg", keys);
  }

  initEncoderPullDown(json) {
    let keys = this.getKeys(json);
    const lastPhoto = json[keys[keys.length - 1]];

    keys = this.getKeys(lastPhoto, "object");
    this.updatePullDown("leftEncoder", keys);
    this.updatePullDown("rightEncoder", keys);
  }

  initQualityPullDown(json) {
    let keys = this.getKeys(json);
    const lastPhoto = json[keys[keys.length - 1]];

    keys = this.getKeys(lastPhoto, "object");
    const lastEncoder = lastPhoto[keys[keys.length - 1]];

    keys = this.getKeys(lastEncoder, "object");
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
    this.updatePullDown("leftQuality", keys);
    this.updatePullDown("rightQuality", keys);
  }

  getKeys(jsonObj, typeFilter) {
    let keys = [];
    for (let key in jsonObj) {
      if (!jsonObj.hasOwnProperty(key)) continue;
      if (typeFilter != null && typeFilter !== typeof jsonObj[key]) continue;
      keys.push(key);
    }
    return keys;
  }

  generateListFromKeys(keys) {
    let html = "";
    for (let key of keys) {
      html += `<option>${key}</option>`;
    }
    return html;
  }

  updatePullDown(id, keys) {
    const pullDown = document.getElementById(id);
    pullDown.innerHTML = this.generateListFromKeys(keys);
  }
}
