function create(__helpers) {
  var __markoWidgets = require("marko-widgets"),
      __widgetAttrs = __markoWidgets.attrs,
      str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      w_widget = __loadTag(require("marko-widgets/taglib/widget-tag")),
      escapeXmlAttr = __helpers.xa,
      attr = __helpers.a,
      attrs = __helpers.as;

  return function render(data, out) {
    w_widget({
        _cfg: data.widgetConfig,
        _state: data.widgetState,
        _props: data.widgetProps,
        _body: data.widgetBody,
        renderBody: function renderBody(out, widget) {
          out.w("<div style=\"background-color: " +
            escapeXmlAttr(data.color) +
            "\"" +
            attr("id", widget.id) +
            " data-w-onclick=\"handleClick|" +
            escapeXmlAttr(widget.id) +
            "\"" +
            attrs(__widgetAttrs(widget)) +
            ">Hello " +
            escapeXml(data.name) +
            "!</div>");
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
