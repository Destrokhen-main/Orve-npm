module.exports = {
    root: true,
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "semi": ["warn", "always"],
        "quotes": ["warn", "double"]
    }
}
