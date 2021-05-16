class Config {
  required(param) {
    throw new Error(`${param} is required`);
  }
  marvel() {
    return {
      API_URL: process.env.MARVEL_API_URL || this.required('MARVEL_API_URL'),
      PUBLIC_KEY: process.env.MARVEL_PUBLIC_KEY || this.required('MARVEL_PUBLIC_KEY'),
      PRIVATE_KEY: process.env.MARVEL_PRIVATE_KEY || this.required('MARVEL_PRIVATE_KEY'),
    };
  }
}

module.exports = new Config();
