export default class {
  constructor() {
    this.json = {};
  }

  init(json) {
    this.json = json;

    this.initSrcPullDown(json);
    this.initEncoderPullDown(json);
    this.initQualityPullDown(json);

    this.updateImage();
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

  updateImage() {
    let left = document.getElementById("leftImage");
    let right = document.getElementById("rightImage");

    left.src = this.getImageURL("left");
    right.src = this.getImageURL("right");
  }

  /**
   * メニューに応じた画像のURLを取得する
   * @param side{string} left or right
   * @returns {string} 相対URL
   */
  getImageURL(side) {
    const originalURL = this.getOriginalURL();
    const quality = this.getQuality(side);
    const encoder = this.getEncoder(side);

    const index = originalURL.lastIndexOf("/");
    const dir = originalURL.substring(0, index);
    let fileName = originalURL.substring(index);
    if (encoder === "webp") {
      fileName = fileName.replace(/\.[^.]*$/, ".webp");
    }

    const url = `${dir}/${encoder}/${quality}${fileName}`;
    console.log(url);
    return url;
  }

  getOriginalURL() {
    const pullDown = document.getElementById("srcImg");
    return pullDown.value;
  }

  getQuality(side) {
    const pullDown = document.getElementById(side + "Quality");
    return pullDown.value;
  }

  getEncoder(side) {
    const pullDown = document.getElementById(side + "Encoder");
    return pullDown.value;
  }
}
