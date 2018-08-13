"use strict";

import Chart from "chart.js";
import SizeGraph from "./SizeGraph.js";

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
};

loadJson();
