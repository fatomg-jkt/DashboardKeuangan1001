import { mkdir, rm, cp, readFile, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/src/vendor", { recursive: true });
await cp("src/vendor", "dist/src/vendor", { recursive: true });
await cp("src/App.jsx", "dist/src/App.js");
await cp("src/styles.css", "dist/src/styles.css");

const main = await readFile("src/main.jsx", "utf8");
const browserMain = main
  .replace('import React from "react";', 'import React from "./vendor/react.js";')
  .replace('import ReactDOM from "react-dom/client";', 'import { createRoot } from "./vendor/react-dom-client.js";')
  .replace('import "./styles.css";\n', "")
  .replace('import App from "./App.jsx";', 'import App from "./App.js";')
  .replace("ReactDOM.createRoot", "createRoot");
await writeFile("dist/src/main.jsx", browserMain);

const html = await readFile("index.html", "utf8");
const browserHtml = html.replace(
  "</head>",
  '    <link rel="stylesheet" href="/src/styles.css" />\n  </head>'
);
await writeFile("dist/index.html", browserHtml);
