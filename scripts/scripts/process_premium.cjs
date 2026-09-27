const Jimp = require('jimp');

async function processImage() {
  console.log('Loading image...');
  const image = await Jimp.read('C:\\Users\\iamri\\.gemini\\antigravity\\brain\\cfce0d6f-7749-4ae0-8002-d0e236687f64\\premium_female_traveler_1787675097049.jpg');
  
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  // Crop the bottom 12% to remove the pavement
  image.crop(0, 0, width, Math.floor(height * 0.88));
  
  const newHeight = image.bitmap.height;

  image.scan(0, 0, width, newHeight, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Background is bright neon green
    if (g > 140 && r < 130 && b < 130) {
      this.bitmap.data[idx + 3] = 0; // Make transparent
    }
  });

  const outPath = 'c:\\Users\\iamri\\OneDrive\\Desktop\\spinfyot\\public\\assets\\images\\female-traveler.png';
  await image.writeAsync(outPath);
  console.log('Saved transparent premium traveler to ' + outPath);
}

processImage().catch(console.error);
