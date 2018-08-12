"use strict";

import Chart from "chart.js";

const loadJson = () => {
  fetch("report.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json);
      onJson(json);
    });
};

let sizeJson = {};
const onJson = json => {
  sizeJson = json;
  initChart(json);
};

const initChart = json => {
  const ctx = document.getElementById("myChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          lineTension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
};

window.onbeforeprint = () => {
  beforePrintHandler();
};
const beforePrintHandler = () => {
  for (let id in Chart.instances) {
    Chart.instances[id].resize();
  }
};

const updateChart = () => {};

loadJson();
