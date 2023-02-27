function create(__helpers) {
  var loadTemplate = __helpers.l,
      Shared_layout = loadTemplate(require.resolve("../Shared/layout.marko")),
      str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      layout_use = __loadTag(require("marko/taglibs/layout/use-tag")),
      layout_put = __loadTag(require("marko/taglibs/layout/put-tag"));

  return function render(data, out) {
    layout_use({
        __template: Shared_layout,
        getContent: function getContent(__layoutHelper) {
          layout_put({
              into: "body",
              layout: __layoutHelper,
              renderBody: function renderBody(out) {
                out.w("<h2>Coming soon... </h2>");
              }
            }, out);
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
