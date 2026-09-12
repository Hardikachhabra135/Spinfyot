const Jimp = require("jimp");
async function makeTransparent(input, output) {
  try {
    const image = await Jimp.read(input);
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    await image.writeAsync(output);
    console.log("Done");
  } catch (err) { console.error(err); }
}
makeTransparent(process.argv[2], process.argv[3]);
