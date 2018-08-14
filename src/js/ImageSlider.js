"use strict";
import {
  getKeys,
  updatePullDown,
  getEncoderList,
  getQualityList
} from "./JsonController.js";

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
    let keys = getKeys(json);
    updatePullDown("srcImg", keys);
    this.initPullDownEventListener("srcImg");
  }

  initEncoderPullDown(json) {
    let keys = getEncoderList(json);
    updatePullDown("leftEncoder", keys);
    updatePullDown("rightEncoder", keys);
    this.initPullDownEventListener("leftEncoder");
    this.initPullDownEventListener("rightEncoder");
  }

  initQualityPullDown(json) {
    let keys = getQualityList(json);
    updatePullDown("leftQuality", keys);
    updatePullDown("rightQuality", keys);
    this.initPullDownEventListener("leftQuality");
    this.initPullDownEventListener("rightQuality");
  }

  initPullDownEventListener(id) {
    const pullDown = document.getElementById(id);
    pullDown.addEventListener("change", e => {
      this.updateImage();
    });
  }

  updateImage() {
    let left = document.getElementById("leftImage");
    let right = document.getElementById("rightImage");

    left.src = this.getImageURL("left");
    right.src = this.getImageURL("right");

    let leftSize = document.getElementById("leftSize");
    let rightSize = document.getElementById("rightSize");

    leftSize.innerText = `size : ${this.getImageKB("left")}KB`;
    rightSize.innerText = `size : ${this.getImageKB("right")}KB`;
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

  getImageSize(side) {
    return this.json[this.getOriginalURL()][this.getEncoder(side)][
      this.getQuality(side)
    ].size;
  }

  getImageKB(side) {
    return (this.getImageSize(side) / 1024).toFixed(1);
  }
}
