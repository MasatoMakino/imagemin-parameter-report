export default class {
  constructor() {
    this.json = {};
  }

  init(json) {
    this.json = json;

    let left = document.getElementById("leftImage");
    let right = document.getElementById("rightImage");

    left.src = "img/jpg_photo/mozJpeg/30/l0134.jpg";
    right.src = "img/jpg_photo/mozJpeg/90/l0134.jpg";
  }
}
