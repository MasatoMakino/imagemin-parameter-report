"use strict";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const makeDir = require("make-dir");
const replaceExt = require("replace-ext");

const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminWebP = require("imagemin-webp");

const imgExtension = "+(jpg|jpeg|png|gif|svg)";

/**
 * 対象ファイルリストを取得する
 * @param extensions
 * @returns {*}
 */
const getImageList = (srcRoot, subDir, extensions) => {
  const pattern = `**/*.${extensions}`;
  const filesMatched = glob.sync(pattern, {
    cwd: srcRoot
  });
  return filesMatched;
};

/**
 * ディレクトリに対して更新対象ファイルの抽出、画像最適化と保存の一連の処理を実行する
 * @param targetDir 保存先ディレクトリ
 */
const optimize = async (srcRoot, distRoot, subDir) => {
  let extension = imgExtension;
  const list = getImageList(srcRoot, subDir, extension);

  console.log(list);
  const encoders = [
    { enc: imageminMozjpeg, name: "mozJpeg" },
    { enc: imageminWebP, name: "webp" }
  ];
  await loadFiles(list, srcRoot, distRoot, subDir, encoders[0]);
  await loadFiles(list, srcRoot, distRoot, subDir, encoders[1]);
};

const loadFiles = (list, srcRoot, distRoot, subDir, encoder) => {
  return new Promise((resolve, reject) => {
    const promiseArray = [];

    for (let filePath of list) {
      const srcPath = srcRoot + "/" + filePath;
      const outputPath = distRoot + "/" + filePath;

      const data = fs.readFileSync(srcPath);

      if (sizeData[filePath] == null) sizeData[filePath] = {};
      sizeData[filePath]["URL"] = filePath;
      sizeData[filePath][encoder.name] = {};
      sizeData[filePath][encoder.name]["100"] = {};
      sizeData[filePath][encoder.name]["100"].size = data.byteLength;
      sizeData[filePath][encoder.name]["100"].rate = 1.0;

      for (let i = minRate; i <= maxRate; i += dif) {
        promiseArray.push(onData(data, i, encoder, filePath, outputPath));
      }
    }

    Promise.all(promiseArray).then(() => {
      resolve("done!");
    });
  });
};

/**
 * ファイルが読み込まれた後の処理。最適化を行う。
 * @param data
 * @param outputDir
 * @param outputPath
 */
const onData = (data, quality, encoder, fileName, outputPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(outputPath);
    const qualityString = quality.toString();

    const pluginConfig = {
      use: [
        encoder.enc({
          quality: quality
        })
      ]
    };

    imagemin.buffer(data, pluginConfig).then(buffer => {
      makeDir(outputDir + "/" + encoder.name + "/" + qualityString).then(
        dirPath => {
          const size = buffer.byteLength;
          const fileJson = sizeData[fileName][encoder.name];

          const dataObj = (fileJson[qualityString] = {});
          dataObj.size = size;
          dataObj.rate = size / fileJson["100"].size;

          let fullPath = dirPath + "/" + path.basename(fileName);
          if (encoder.enc === imageminWebP) {
            fullPath = replaceExt(fullPath, ".webp");
          }

          fs.writeFile(fullPath, buffer, err => {
            // 書き出しに失敗した場合
            if (err) {
              console.log("エラーが発生しました。" + err);
              throw err;
            }
            // 書き出しに成功した場合
            else {
              console.log(fullPath, quality);
              resolve();
            }
          });
        }
      );
    });
  });
};

//メイン処理

const maxRate = 90;
const minRate = 30;
const dif = 5;

const srcDir = `${process.cwd()}/src`;
const distDir = `${process.cwd()}/dist`;

const sizeData = {};
optimize(srcDir, distDir, "/img/jpg_photo");

process.on("exit", function() {
  console.log("exiting program...");
  console.log(sizeData);
  fs.writeFileSync(
    distDir + "/report.json",
    JSON.stringify(sizeData, null, "    ")
  );
});
