"use strict";

import Chart from "chart.js";

export default class {
  constructor() {
    this.json = {};
  }

  init(json) {
    this.json = json;
    const ctx = document.getElementById("myChart").getContext("2d");

    this.chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: this.getDataSet(json, ["mozJpeg", "webp"])
      },
      options: this.getOption()
    });
  }

  update() {}

  getOption() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
            // type:"logarithmic"
          }
        ],
        xAxes: [
          {
            ticks: {
              reverse: true
            }
          }
        ]
      }
    };
  }

  getDataSet(json, encoderTypes) {
    const dataSet = [];

    for (let key in json) {
      if (!json.hasOwnProperty(key)) continue;
      for (let type of encoderTypes) {
        const data = this.getData(json[key], type);
        dataSet.push(data);
      }
    }
    return dataSet;
  }

  getData(imgObj, encoderType) {
    const dataObj = {};

    dataObj.label = imgObj.URL;
    dataObj.fill = false;
    dataObj.lineTension = 0;
    dataObj.showLine = true;
    dataObj.borderColor = this.getColor(encoderType);
    dataObj.data = [];

    const encoderObj = imgObj[encoderType];

    for (let key in encoderObj) {
      if (!encoderObj.hasOwnProperty(key)) continue;

      const point = {};
      point.x = parseInt(key);
      point.y = encoderObj[key].rate;
      dataObj.data.push(point);
    }

    return dataObj;
  }

  getColor(encoderType) {
    switch (encoderType) {
      case "mozJpeg":
        return "rgba(255, 0, 0, 0.1)";
      case "webp":
        return "rgba(0, 255, 0, 0.1)";
      default:
        return "rgba(0, 0, 0, 0.1)";
    }
  }
}
