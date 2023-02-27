function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      awaitTag = __loadTag(require("marko/taglibs/async/await-tag")),
      forEach = __helpers.f,
      escapeXmlAttr = __helpers.xa,
      attr = __helpers.a;

  return function render(data, out) {
    awaitTag({
        clientReorder: true,
        _dataProvider: data.items,
        _name: "data.items",
        renderBody: function renderBody(out, user) {
          if (user == null) {
            out.w("<div class=\"loginScreen\"><div id=\"AmazonLoginLogo\" class=\"authlog\" title=\"amazon\"></div></div>");
          } else {
            out.w("<div class=\"folderContainer\">");

            var folders = user;

            var kpath = "/amazon/k/";

            forEach(folders.data, function(item) {
              if (item.kind == "FOLDER") {
                out.w("<div class=\"folder-box\"><a href=\"javascript:void(0)\"><div class=\"folder\" style=\"background-image: url(" +
                  escapeXmlAttr(out.global.app.locals.staticdir) +
                  "/themes/images/folder-gray.png);\"></div></a><div>" +
                  escapeXml(item.name) +
                  "</div> </div>");
              } else {
                if (item.contentProperties.image != null) {
                  out.w("<div class=\"photo-box\"><a" +
                    attr("href", item.tempLink) +
                    "><div class=\"photo\" style=\"opacity: 1;background-image: url(" +
                    escapeXmlAttr(item.tempLink) +
                    "?viewBox=400);\"></div></a><div class=\"photo-overlay\"></div><div class=\"photo-check-icon\"></div><div class=\"photo-status\"></div></div>");
                } else if (item.contentProperties.video != null) {
                  out.w("<div class=\"video-box\"><a" +
                    attr("href", item.tempLink) +
                    "><img src=\"" +
                    escapeXmlAttr(item.tempLink) +
                    "/alt/thumb?viewBox=180&amp;fit=clip\"></a><div>" +
                    escapeXml(item.name) +
                    "</div></div>");
                } else {
                  out.w("<div class=\"doc-box\"><a" +
                    attr("href", item.tempLink) +
                    "><img" +
                    attr("src", item.tempLink) +
                    "></a><div>" +
                    escapeXml(item.name) +
                    "</div></div>");
                }
              }
            });

            out.w("</div>");
          }
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
