"use strict";

import {
  Chart,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement,
  ScatterController,
  SubTitle,
  Title,
  Tooltip
} from "chart.js";
import { getEncoderList, updatePullDown } from "./JsonController.js";

export default class {
  constructor() {
    Chart.register(
      LineElement,
      PointElement,
      ScatterController,
      LinearScale,
      LogarithmicScale,
      Legend,
      Title,
      Tooltip,
      SubTitle
    );
    this.json = {};
  }

  init(json) {
    this.json = json;
    const ctx = document.getElementById("myChart").getContext("2d");
    this.initForm(json);

    const config = {
      type: "scatter",
      data: {
        datasets: this.getDataSet(json),
      },
      options: this.getOption(),
    };

    this.chart = new Chart(ctx, config);
  }

  initForm(json) {
    this.scaleCheckBox = document.getElementById("scale");
    this.scaleCheckBox.addEventListener("change", (e) => {
      this.onChangedScale(e);
    });

    this.encoderTypeSelecter = document.getElementById("encoder");

    const encodeKeys = getEncoderList(json);
    encodeKeys.unshift("All");
    updatePullDown("encoder", encodeKeys);

    this.encoderTypeSelecter.addEventListener("change", (e) => {
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

  getEncoderType(json) {
    const encodeKeys = getEncoderList(json);
    if (this.encoderTypeSelecter.value === "All") {
      return encodeKeys;
    }
    return [this.encoderTypeSelecter.value];
  }

  getOption() {
    const yAxesScaleType = this.scaleCheckBox.checked
      ? "logarithmic"
      : "linear";

    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          type: yAxesScaleType,
          position: "left",
        },
        x: {
          reverse: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label =
                context.dataset.label + " - " + context.parsed.y.toFixed(3) ||
                "";
              return label;
            },
            labelColor: function (tooltipItem) {
              return {
                backgroundColor: tooltipItem.dataset.labelColor,
              };
            },
          },
        },
      },
    };
  }

  getDataSet(json) {
    const dataSet = [];
    const encoderTypes = this.getEncoderType(json);

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

    dataObj.label =
      imgObj.URL.match(".+/(.+?).[a-z]+([?#;].*)?$")[1] + " : " + encoderType;
    dataObj.fill = false;
    dataObj.lineTension = 0;
    dataObj.showLine = true;
    dataObj.borderColor = this.getColor(encoderType);
    dataObj.labelColor = this.getLabelColor(encoderType, 0.5);
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
    const encodeKeys = getEncoderList(this.json);
    const index = encodeKeys.indexOf(encoderType);

    const colors = [
      "rgba(255, 0, 0, 0.1)",
      "rgba(0, 255, 0, 0.1)",
      "rgba(0, 0, 255, 0.1)",
      "rgba(255, 0, 255, 0.1)",
      "rgba(0, 255, 255, 0.1)",
      "rgba(255, 255, 0, 0.1)",
    ];
    return colors[index];
  }
  getLabelColor(encoderType, alpha) {
    const color = this.getColor(encoderType);
    return color.replace(
      /rgba\(([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*[0-9.]+\)/g,
      "rgba($1,$2,$3," + alpha + ")"
    );
  }
}
