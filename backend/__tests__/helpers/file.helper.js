const fs = require('fs');
const path = require('path');

const createTestImage = () => {
  const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
  if (!fs.existsSync(testImagePath)) {
    // Crear una imagen de prueba simple
    const imageData = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    fs.writeFileSync(testImagePath, imageData);
  }
  return testImagePath;
};

module.exports = {
  createTestImage
}; 