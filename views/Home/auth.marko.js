function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w("<html><head><link rel=\"shortcut icon\" href=\"data:image/x-icon;,\" type=\"image/x-icon\"></head><body></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
