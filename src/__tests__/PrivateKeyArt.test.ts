import PrivateKeyArt from '../PrivateKeyArt';

describe('PrivateKeyArt', () => {
  let privateKeyArt: PrivateKeyArt;

  beforeEach(() => {
    privateKeyArt = new PrivateKeyArt();
  });

  test('setPixel and getPixel', () => {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        privateKeyArt.setPixel(x, y, true);
        expect(privateKeyArt.getPixel(x, y)).toBe(true);
        privateKeyArt.setPixel(x, y, false);
        expect(privateKeyArt.getPixel(x, y)).toBe(false);
      }
    }
  });

  test('toPrivateKey and fromPrivateKey', () => {
    const privateKey = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    privateKeyArt.fromPrivateKey(privateKey);
    expect(privateKeyArt.toPrivateKey()).toBe(privateKey);
  });

  test('getData', () => {
    const data = privateKeyArt.getData();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBe(16);
    data.forEach(row => {
      expect(row).toBeInstanceOf(Array);
      expect(row.length).toBe(16);
    });
  });
});
