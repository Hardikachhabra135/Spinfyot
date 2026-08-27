const Jimp = require('jimp');

async function check() {
  const img = await Jimp.read('C:\\Users\\iamri\\.gemini\\antigravity\\brain\\cfce0d6f-7749-4ae0-8002-d0e236687f64\\.user_uploaded\\media_1787676267305.png');
  let hasAlpha = false;
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] < 255) hasAlpha = true;
  });
  console.log('Has transparency: ' + hasAlpha);
}
check().catch(console.error);
