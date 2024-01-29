module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:testing-library/react",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["jest", "testing-library", "@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2], // İki boşluk girinti
    "no-unused-vars": "off", // TypeScript ile kullanılmayan değişkenleri denetlemeyi devre dışı bırakın
    "no-console": "warn", // console.log kullanımını uyarı olarak işaretler
    "no-undef": "error", // Tanımlanmamış değişkenleri hata olarak işaretler
    camelcase: "error", // camelCase kullanımını zorunlu kılar
    "no-trailing-spaces": "error", // Satır sonlarındaki boşlukları hata olarak işaretler
    "@typescript-eslint/no-unused-vars": ["error"], // Kullanılmayan değişkenleri TypeScript ile denetleyin
  },
};
