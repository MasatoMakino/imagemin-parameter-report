"use strict";

import SizeChart from "./SizeChart.js";
import ImageComparison from "./ImageComparison.js";
import HeaderController from "./HeaderController";

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
  let graph = new SizeChart();
  graph.init(json);
  let imageComparison = new ImageComparison();
  imageComparison.init(json);

  let headerController = new HeaderController(json);
};

loadJson();
