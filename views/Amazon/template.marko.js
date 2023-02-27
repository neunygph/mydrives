function create(__helpers) {
  var loadTemplate = __helpers.l,
      Shared_layout = loadTemplate(require.resolve("../Shared/layout.marko")),
      __widgetType = {
          name: "/MyDrives$1.0.0/views/Amazon/main-widget",
          def: function() {
            return require("./main-widget");
          }
        },
      __markoWidgets = require("marko-widgets"),
      __widgetAttrs = __markoWidgets.attrs,
      str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      layout_use = __loadTag(require("marko/taglibs/layout/use-tag")),
      layout_put = __loadTag(require("marko/taglibs/layout/put-tag")),
      awaitTag = __loadTag(require("marko/taglibs/async/await-tag")),
      w_widget = __loadTag(require("marko-widgets/taglib/widget-tag")),
      attr = __helpers.a,
      attrs = __helpers.as,
      init_widgets = __loadTag(require("marko-widgets/taglib/init-widgets-tag"));

  return function render(data, out) {
    layout_use({
        __template: Shared_layout,
        getContent: function getContent(__layoutHelper) {
          layout_put({
              into: "body",
              layout: __layoutHelper,
              renderBody: function renderBody(out) {
                awaitTag({
                    clientReorder: true,
                    timeout: 5000,
                    _dataProvider: data.items,
                    _name: "data.items",
                    arg: {
                        delay: 3000
                      },
                    renderBody: function renderBody(out, user) {
                      w_widget({
                          type: __widgetType,
                          _cfg: data.widgetConfig,
                          _state: data.widgetState,
                          _props: data.widgetProps,
                          _body: data.widgetBody,
                          renderBody: function renderBody(out, widget) {
                            out.w("<main" +
                              attr("id", widget.id) +
                              attrs(__widgetAttrs(widget)) +
                              "><h2>3) Main</h2><span" +
                              attr("id", widget.elId("message")) +
                              ">&nbsp;</span></main>");
                          }
                        }, out);
                    }
                  }, out);

                init_widgets({}, out);
              }
            }, out);
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
