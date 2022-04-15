"use strict";

import fs from "fs";
import path from "path";
import glob from "glob";
import replaceExt from "replace-ext";
import sharp from "sharp";

const imgExtension = "+(jpg|jpeg|png|gif|svg)";

/**
 * 対象ファイルリストを取得する
 * @param extensions
 * @returns {*}
 */
const getImageList = (srcRoot, subDir, extensions) => {
  const pattern = `**/*.${extensions}`;
  const filesMatched = glob.sync(pattern, {
    cwd: srcRoot,
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
  const encoders = [{ name: "mozJpeg" }, { name: "jpeg" }, { name: "webp" }];
  await loadFiles(list, srcRoot, distRoot, subDir, encoders[0]);
  await loadFiles(list, srcRoot, distRoot, subDir, encoders[1]);
  await loadFiles(list, srcRoot, distRoot, subDir, encoders[2]);
};

const loadFiles = (list, srcRoot, distRoot, subDir, encoder) => {
  return new Promise((resolve, reject) => {
    const promiseArray = [];

    for (let filePath of list) {
      const srcPath = path.join(srcRoot, filePath);
      const outputPath = path.join(distRoot, filePath);

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
 * @param data buffer array
 * @param quality
 * @param encoder
 * @param fileName
 * @param outputPath
 * @return {Promise<null>}
 */
const onData = async (data, quality, encoder, fileName, outputPath) => {
  const outputDir = path.dirname(outputPath);
  const qualityString = quality.toString();

  const dir = outputDir + "/" + encoder.name + "/" + qualityString;
  await fs.promises.mkdir(dir, { recursive: true });

  const sharpObj = await sharp(data);
  if (encoder.name === "webp") {
    await sharpObj.webp({ quality });
  } else {
    await sharpObj.jpeg({ quality, mozjpeg: encoder.name === "mozJpeg" });
  }
  let fullPath = path.join(dir, path.basename(fileName));
  if (encoder.name === "webp") {
    fullPath = replaceExt(fullPath, ".webp");
  }
  sharpObj.toFile(fullPath).then((resolve) => {
    const fileJson = sizeData[fileName][encoder.name];
    const dataObj = (fileJson[qualityString] = {});
    dataObj.size = resolve.size;
    dataObj.rate = resolve.size / fileJson["100"].size;
    console.log(fullPath, quality);
  });
};

//メイン処理

const maxRate = 95;
const minRate = 30;
const dif = 5;

const srcDir = `${process.cwd()}/src`;
const distDir = `${process.cwd()}/dist`;

const sizeData = {};
optimize(srcDir, distDir, "/img/jpg_photo");

process.on("exit", function () {
  console.log("exiting program...");

  const sizeDataString = JSON.stringify(sizeData, null, "    ");
  fs.writeFileSync(distDir + "/report.json", sizeDataString, "utf8");
});
