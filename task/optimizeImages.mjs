"use strict";

import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

/**
 * 指定されたファイルリストを読み込み、エンコーダを適用し、その結果を出力パスに保存します。
 * 各ファイルのサイズデータも収集し、それを`sizeData`オブジェクトに保存します。
 *
 * @param {Array} list - 処理するファイルのリスト
 * @param {string} srcRoot - 入力ファイルのルートディレクトリ
 * @param {string} distRoot - 出力ファイルのルートディレクトリ
 * @param {string} subDir - サブディレクトリ（現在は使用されていません）
 * @param {Object} encoder - 使用するエンコーダ
 * @returns {Promise} - 全てのエンコードが完了したら解決するPromise
 */
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
        promiseArray.push(
          optimizeAndSaveFile(data, i, encoder, filePath, outputPath)
        );
      }
    }

    Promise.all(promiseArray).then(() => {
      resolve("done!");
    });
  });
};

/**
 * 読み込まれたファイルデータに対して最適化を行い、その結果を保存します。
 * エンコードは指定された品質とエンコーダを使用して行われます。
 * エンコードされたファイルのサイズデータも収集し、それを`sizeData`オブジェクトに保存します。
 *
 * @param {Buffer} data - ファイルデータ
 * @param {number} quality - エンコードの品質
 * @param {Object} encoder - 使用するエンコーダ
 * @param {string} fileName - ファイル名
 * @param {string} outputPath - 出力パス
 * @returns {Promise<null>} - エンコードとデータ保存が完了したら解決するPromise
 */
const optimizeAndSaveFile = async (
  data,
  quality,
  encoder,
  fileName,
  outputPath
) => {
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
  } else if (encoder.name === "jpeg" || encoder.name === "mozJpeg") {
    fullPath = replaceExt(fullPath, ".jpg");
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const srcDir = `${projectRoot}/src`;
const distDir = `${projectRoot}/dist`;

console.log(srcDir, distDir);

const sizeData = {};
optimize(srcDir, distDir, "/img/jpg_photo");

process.on("exit", function () {
  console.log("exiting program...");

  const sizeDataString = JSON.stringify(sizeData, null, "    ");
  fs.writeFileSync(distDir + "/report.json", sizeDataString, "utf8");
});
