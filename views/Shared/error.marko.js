function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x;

  return function render(data, out) {
    out.w("<html><head><title>" +
      escapeXml(data.status) +
      " </title></head><body><p>" +
      escapeXml(data.message) +
      " </p><p>" +
      escapeXml(data.errdetail) +
      "</p></body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
