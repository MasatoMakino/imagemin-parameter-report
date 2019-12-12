"use strict";
import {
  getImageList,
  getEncoderList,
  getQualityList,
  generateImageURL
} from "./JsonController.js";

export default class {
  constructor(json) {
    this.json = json;
    this.init(json);
  }

  init(json) {
    const banner = document.getElementById("bannerContainer");
    const originalURL = getImageList(json)[0];
    const encoder = getEncoderList(json)[0];
    let qualityList = getQualityList(json);
    let quality = qualityList[0];
    if (qualityList.indexOf("75") !== -1) {
      quality = "75";
    }

    const imageURL = generateImageURL(originalURL, encoder, quality);
    const styleString = `url(${imageURL})`;
    banner.style.backgroundImage = styleString;
  }
}
