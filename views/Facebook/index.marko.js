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
      escapeXmlAttr = __helpers.xa,
      attr = __helpers.a,
      classAttr = __helpers.ca;

  return function render(data, out) {
    layout_use({
        "*": {
            currentTitle: "Facebook"
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
                        out.w("<center><div class=\"loginScreen\"><div id=\"FacebookLoginLogo\" class=\"authlog\" title=\"facebook\"></div></div></center>");
                      } else {
                        var user = m_object;

                        var kpath = "/facebook/k/";

                        var hasalbums = false,
                            hasphoto = false,
                            hasvideo = false;

                        out.w("<div class=\"row bhoechie-tab-content active\"><div class=\"col-lg-1 col-md-1 col-sm-12 col-xs-12 folder-container\"><div class=\"row folder-box-row\">");

                        if ((user.albums !== undefined) && (user.albums.data !== undefined)) {
                          if (user.albums.data.length > 0) {
                            var date = "";

                            hasalbum = true;

                            forEach(user.albums.data, function(item) {
                              date = new Date(item.created_time).toDateString().substring(4);

                              if ((item.picture !== undefined) && (item.picture.data !== undefined)) {
                                out.w("<div class=\"col-lg-12 col-md-12 col-sm-3 col-xs-6 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\" style=\"background-image: url(" +
                                  escapeXmlAttr(item.picture.data.url) +
                                  ");\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"album-box\"><a class=\"album\"" +
                                  attr("name", item.id) +
                                  attr("href", kpath + item.id) +
                                  attr("id", item.id) +
                                  "><div class=\"img-thumbnail\" style=\"background-image: url(" +
                                  escapeXmlAttr(item.picture.data.url) +
                                  ");\"></div></a><div class=\"folder-dt name\">" +
                                  escapeXml(item.name) +
                                  "</div> <div class=\"folder-dt date\">" +
                                  escapeXml(new Date(item.created_time).toDateString().substring(4)) +
                                  "</div> </div></div>");
                              }
                            });
                          }
                        }

                        out.w("</div></div><div" +
                          classAttr(hasalbum ? "col-lg-10 col-md-10 col-sm-12 col-xs-12 tab-content" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-content") +
                          "><div class=\"opt-session\"><span class=\"glyphicon glyphicon-th-list\" id=\"view-gallery\"></span><span class=\"glyphicon glyphicon-option-vertical\" id=\"options\"></span></div><ul class=\"nav nav-tabs\"><li class=\"active\"><a data-toggle=\"tab\" href=\"#photo-tab\">Photos</a></li><li><a data-toggle=\"tab\" href=\"#video-tab\">Videos</a></li></ul><div id=\"photo-tab\" class=\"tab-pane fade in active\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"photo-row\" mode=\"grid\">");

                        if ((user.photos !== undefined) && (user.photos.data !== undefined)) {
                          forEach(user.photos.data, function(item) {
                            if ((item.images !== undefined) && (item.images.length > 0)) {
                              var image = item.images[0].source;

                              var thumbnail = item.images[0].source;

                              forEach(item.images, function(image) {
                                if (image.source.includes("p480x480")) {
                                  thumbnail = image.source;
                                }
                              });

                              hasphoto = true;

                              out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"photo-box\"><div class=\"photo\" data-slide-to=\"0\" data-toggle=\"modal\"" +
                                attr("name", item.id) +
                                attr("title", image) +
                                "><img" +
                                attr("name", item.id) +
                                attr("src", thumbnail) +
                                "></div></div></div>");
                            }
                          });
                        }

                        out.w("</div>");

                        if (hasphoto == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-image2.jpg);\"></span>");
                        }

                        out.w("</div><div class=\"clearfix\"></div></div></div><div id=\"video-tab\" class=\"tab-pane fade\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"video-row\" mode=\"grid\">");

                        if ((user.videos !== undefined) && (user.videos.data !== undefined)) {
                          var date = "";

                          var source = "";

                          forEach(user.videos.data, function(item) {
                            if (item.embed_html !== undefined) {
                              hasvideo = true;

                              out.w(" ");

                              date = new Date(item.created_time).toDateString().substring(4);

                              source = item.embed_html.substring(item.embed_html.indexOf("http"), item.embed_html.indexOf("\" "));

                              out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"video-box\"><div class=\"video\" data-slide-to=\"0\" data-toggle=\"modal\" data-target=\".mymodal\"" +
                                attr("name", item.id) +
                                attr("title", source) +
                                "><img" +
                                attr("name", item.id) +
                                attr("src", item.picture) +
                                "></div><span>Created on: " +
                                escapeXml(date) +
                                "</span><br><span>" +
                                escapeXml(item.description) +
                                "</span></div></div>");
                            }
                          });
                        }

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
