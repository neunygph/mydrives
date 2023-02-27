function create(__helpers) {
  var loadTemplate = __helpers.l,
      Shared_content_layout = loadTemplate(require.resolve("../Shared/content-layout.marko")),
      str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      layout_use = __loadTag(require("marko/taglibs/layout/use-tag")),
      layout_put = __loadTag(require("marko/taglibs/layout/put-tag")),
      awaitTag = __loadTag(require("marko/taglibs/async/await-tag")),
      forEach = __helpers.f,
      attr = __helpers.a,
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    layout_use({
        "*": {
            currentTitle: "Instagram"
          },
        __template: Shared_content_layout,
        getContent: function getContent(__layoutHelper) {
          layout_put({
              into: "body-content",
              layout: __layoutHelper,
              renderBody: function renderBody(out) {
                awaitTag({
                    clientReorder: true,
                    _dataProvider: data.items,
                    _name: "data.items",
                    renderPlaceholder: function renderBody(out) {
                      out.w("<div class=\"loading\"></div>");
                    },
                    renderTimeout: function renderBody(out) {
                      out.w("A timeout occurred!");
                    },
                    renderError: function renderBody(out) {
                      out.w("An error occurred!");
                    },
                    renderBody: function renderBody(out, m_object) {
                      if (m_object == null) {
                        out.w("<center><div class=\"loginScreen\"><div id=\"InstagramLoginLogo2\" class=\"authlog\" title=\"instagram\"></div></div></center>");
                      } else {
                        var medias = m_object;

                        var kpath = "/instagram/k/";

                        var hasfolder = false,
                            hasphoto = false,
                            hasvideo = false;

                        out.w("<div class=\"row bhoechie-tab-content active\"><div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-content\"><span class=\"glyphicon glyphicon-th-list\" id=\"view-gallery\"></span><ul class=\"nav nav-tabs\"><li class=\"active\"><a data-toggle=\"tab\" class=\"content-tab\" href=\"#photo-tab\">Photos</a></li><li><a data-toggle=\"tab\" class=\"content-tab\" href=\"#video-tab\">Videos</a></li></ul><div id=\"photo-tab\" class=\"tab-pane fade in active\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"photo-row\" mode=\"grid\">");

                        forEach(medias.data, function(item) {
                          if (item.type === "image") {
                            hasphoto = true;

                            out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"photo-box\"><div class=\"photo\" data-slide-to=\"0\" data-toggle=\"modal\"" +
                              attr("name", item.id) +
                              attr("title", item.images.standard_resolution.url) +
                              "><img" +
                              attr("name", item.id) +
                              attr("src", item.images.low_resolution.url) +
                              "></div></div></div>");
                          }
                        });

                        out.w("</div>");

                        if (hasphoto == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-image2.jpg);\"></span>");
                        }

                        out.w("</div><div class=\"clearfix\"></div></div></div><div id=\"video-tab\" class=\"tab-pane fade\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"video-row\" mode=\"grid\">");

                        var date = "";

                        forEach(medias.data, function(item) {
                          if (item.type === "video") {
                            hasvideo = true;

                            out.w(" ");

                            date = new Date(parseInt(item.created_time)).toDateString().substring(4);

                            out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"video-box\"><div class=\"video\" data-slide-to=\"0\" data-toggle=\"modal\" data-target=\".mymodal\"" +
                              attr("name", item.id) +
                              attr("title", item.videos.low_resolution.url) +
                              "><img" +
                              attr("name", item.id) +
                              attr("src", item.images.low_resolution.url) +
                              "></div><span>Created on: " +
                              escapeXml(date) +
                              "</span><br><span>" +
                              escapeXml(item.caption) +
                              "</span></div></div>");
                          }
                        });

                        out.w("</div>");

                        if (hasvideo == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-video2.jpg);\"></span>");
                        }

                        out.w("</div><div class=\"clearfix\"></div></div></div></div></div>");
                      }
                    }
                  }, out);
              }
            }, out);
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
