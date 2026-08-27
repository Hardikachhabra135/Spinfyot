const Jimp = require("jimp");
async function processImage(input, output) {
  try {
    const image = await Jimp.read(input);
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      if (r > 230 && g > 230 && b > 230) {
        this.bitmap.data[idx + 3] = 0;
      } else {
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
      }
    });
    await image.writeAsync(output);
    console.log("Done");
  } catch (err) { console.error(err); }
}
processImage(process.argv[2], process.argv[3]);
