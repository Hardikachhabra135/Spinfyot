const Jimp = require('jimp');

async function check() {
  const img = await Jimp.read('C:\\Users\\iamri\\.gemini\\antigravity\\brain\\cfce0d6f-7749-4ae0-8002-d0e236687f64\\.user_uploaded\\media_1787676267305.png');
  const color = Jimp.intToRGBA(img.getPixelColor(0, 0));
  console.log('Top-left pixel: ', color);
}
check().catch(console.error);
