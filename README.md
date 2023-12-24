# imagemin-parameter-report

> Report tool to assist in refining the quality settings of jpeg images for website.

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=MasatoMakino&repo=imagemin-parameter-report)](https://github.com/MasatoMakino/imagemin-parameter-report)

## Demo

[Demo Page](https://makino-design-staging.s3.amazonaws.com/imagemin-reporter-demo/index.html)

![](https://www.evernote.com/l/AAnpE1c90QdMsqrpvRJXCceuOhqkw2WvRnYB/image.jpg)

## What is this?

### What is the tool for?

This tool is used to form a consensus on jpeg quality settings within the development team.

### When to use?

Early stages of front-end development.

### Can it be integrated into CI?

No. This tool does not provide a quantitative assessment of image quality. Users decide on the jpeg quality by looking at the report.

### Why did I build this tool?

I need a tool to discuss reasonable jpeg quality settings with my team members in the early stages of front-end development.

Quality settings in jpeg have a large impact on the display speed of a website. In the early stages of front-end development, members do not have time to decide that configuration. It will be difficult to change this setting after development has progressed.

## How to use

This tool requires [node.js](https://nodejs.org/).

### Collect images

Collect images to be posted on your website.

### Install

Copy the files in this repository to your PC.

![](https://www.evernote.com/l/AAmmLPMN73NLWpQC1Js7z80fjTJvtLeMhpcB/image.png)

In the unzipped directory, run this command.

```shell
npm ci
```

### Copy images

Copy your collected images into this directory.

```
src/img/jpg_photo/
```

### Publish report

```shell
npm run publish
```

This tool recompresses images and outputs a report.

Please access the report at this URL.

http://localhost:3000

### Discussion

![](https://www.evernote.com/l/AAnjXLyjcS1JOo_cv_mCVWn-9ib-t2ON-lkB/image.jpg)

`CHART` shows the compression ratio of images and size of images.

![](https://www.evernote.com/l/AAkNDsgJX4JGnaly36_Gcqp8QxrWNowoCpYB/image.png)

`COMPARE` displays the results of recompression of the same image.

Pick up one random image and refine the quality by following the steps below.

- Display the highest quality image on one side and the lowest quality image on the other.
- Increase the quality of the lowest quality image and stop when no difference can be seen compared to the highest quality side.

![](https://www.evernote.com/l/AAlZE5VUrOFKv6jwKIWfhBslPzGAhu151QkB/image.png)

Images with a lot of gradients are vulnerable to jpeg compression, and lowering the quality setting will ruin the gradients. Change the compression ratio and find out at which quality the gradation fails.

Please fill in the checklist below.
It will provide a basis for setting image quality that all parties involved can share an awareness of the problem.

- All lossy compressed images should be set to image quality [n] or lower, since the file size jumps when the image quality [n] or higher is used. (e.g. 80)
- Use image library ( jpegOptim | mozjpeg | others ).
- The image quality that does not fail for average images is [n]. ( e.g. 60 )
- The image quality that does not fail for compression-sensitive images is [n]. ( e.g. 75 )
- The overall image compression setting is [n]. This reduces the display time and has a positive effect on the conversion rate.
- The effect of transfer reduction by webP is about [n] % compared to jpeg.
- The number of users benefiting from webP is [n] % of the total.
- Use webP (yes | no).
