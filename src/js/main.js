"use strict";

import SizeGraph from "./SizeGraph.js";
import ImageSlider from "./ImageSlider.js";

const loadJson = () => {
  fetch("report.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      onJson(json);
    });
};

let sizeJson = {};
const onJson = json => {
  sizeJson = json;
  let graph = new SizeGraph();
  graph.init(json);
  let imageSlider = new ImageSlider();
  imageSlider.init(json);
};

loadJson();
