// const config = require("../ourstory-resources/doc_gen/.vuepress/config.js");
const fs = require("fs");

// config.base = "/docs/";

let config = fs.readFileSync(
  "../ourstory-resources/doc_gen/.vuepress/config.js"
);

config = config.toString().replace('base: "/"', 'base: "/docs/"');

fs.writeFileSync("../ourstory-resources/doc_gen/.vuepress/config.js", config);

console.log("Config file updated");
