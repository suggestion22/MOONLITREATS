const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const partials = {
  "site-header": fs.readFileSync(path.join(root, "partials", "site-header.html"), "utf8").trim(),
  "site-footer": fs.readFileSync(path.join(root, "partials", "site-footer.html"), "utf8").trim()
};

const pageFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
const activePages = new Set([
  "index.html",
  "about.html",
  "characters.html",
  "episode.html",
  "gallery.html",
  "gacha.html",
  "goods-preview.html"
]);

const indent = (content, spaces = 2) => {
  const pad = " ".repeat(spaces);
  return content.split("\n").map((line) => `${pad}${line}`).join("\n");
};

const activateCurrentPage = (header, file) => {
  if (!activePages.has(file)) return header;
  const navLinkPattern = new RegExp(`(<nav class="site-nav"[\\s\\S]*?)<a href="${file}"`, "u");
  return header.replace(navLinkPattern, `$1<a href="${file}" aria-current="page"`);
};

const block = (name, content) => {
  return `<!-- partial:${name} -->\n${content}\n<!-- /partial:${name} -->`;
};

const injectMarkedBlock = (html, name, content, fallbackPattern) => {
  const markerPattern = new RegExp(`\\s*<!-- partial:${name} -->[\\s\\S]*?<!-- /partial:${name} -->`, "u");
  const nextBlock = `\n${indent(block(name, content))}`;
  if (markerPattern.test(html)) {
    return html.replace(markerPattern, nextBlock);
  }
  return html.replace(fallbackPattern, nextBlock);
};

for (const file of pageFiles) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
  const header = activateCurrentPage(partials["site-header"], file);

  html = injectMarkedBlock(html, "site-header", header, /\s*<header class="site-header">[\s\S]*?<\/header>/u);
  html = injectMarkedBlock(html, "site-footer", partials["site-footer"], /\s*<footer class="site-footer">[\s\S]*?<\/footer>/u);
  fs.writeFileSync(filePath, html.replace(/\s+$/u, "\n"), "utf8");
}

console.log(`Applied shared header/footer partials to ${pageFiles.length} HTML files.`);
