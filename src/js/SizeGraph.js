"use strict";

import Chart from "chart.js";

export default class {
  constructor() {
    this.json = {};
  }

  init(json) {
    this.json = json;
    const ctx = document.getElementById("myChart").getContext("2d");
    this.initForm();

    this.chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: this.getDataSet(json)
      },
      options: this.getOption()
    });
  }

  initForm() {
    this.scaleCheckBox = document.getElementById("scale");
    this.scaleCheckBox.addEventListener("change", e => {
      this.onChangedScale(e);
    });

    this.encorderTypeSelecter = document.getElementById("encoder");
    this.encorderTypeSelecter.addEventListener("change", e => {
      this.onChangedEncoder(e);
    });
  }

  onChangedScale(e) {
    this.chart.options = this.getOption();
    this.chart.update();
  }

  onChangedEncoder(e) {
    this.chart.data.datasets = this.getDataSet(this.json);
    this.chart.update();
  }

  getEncorderType() {
    switch (this.encorderTypeSelecter.value) {
      case "All":
        return ["mozJpeg", "webp"];
      case "mozJpeg":
        return ["mozJpeg"];
      case "webp":
        return ["webp"];
      default:
        return ["mozJpeg", "webp"];
    }
  }

  getOption() {
    const yAxesScaleType = this.scaleCheckBox.checked
      ? "logarithmic"
      : "linear";

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            type: yAxesScaleType
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

  getDataSet(json) {
    const dataSet = [];
    const encoderTypes = this.getEncorderType();

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
