class PrivateKeyArt {
  size = 16;
  private data: boolean[][];

  constructor(privateKey?: string) {
    this.data = Array.from({ length: this.size }, () => Array(this.size).fill(false));
    if (privateKey) {
      this.fromPrivateKey(privateKey);
    }
  }

  setPixel(x: number, y: number, value: boolean) {
    if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
      this.data[y][x] = value;
    }
  }

  getPixel(x: number, y: number): boolean {
    return this.data[y][x];
  }

  invert() {
    this.data = this.data.map(row => row.map(pixel => !pixel));
  }

  toPrivateKey(): string {
    // Convert this.data to a binary string and then to a private key
    let binaryString = '';
    this.data.forEach(row => {
      row.forEach(pixel => {
        binaryString += pixel ? '1' : '0';
      });
    });
    // Convert binary string to hexadecimal (private key)
    let privateKey = '';
    for (let i = 0; i < binaryString.length; i += 4) {
      privateKey += parseInt(binaryString.substring(i, i + 4), 2).toString(16);
    }
    return privateKey;
  }

  fromPrivateKey(privateKey: string) {
    // Convert the private key to a binary string
    let binaryString = '';
    for (let i = 0; i < privateKey.length; i++) {
      binaryString += ('0000' + parseInt(privateKey[i], 16).toString(2)).slice(-4);
    }
    // Convert the binary string to this.data
    let index = 0;
    this.data = Array.from({ length: 16 }, () =>
      Array.from({ length: 16 }, () => {
        if (index < binaryString.length) {
          const pixel = binaryString[index] === '1';
          index++;
          return pixel;
        }
        return false;
      })
    );
  }

  getData(): boolean[][] {
    return this.data;
  }
}

export default PrivateKeyArt;
