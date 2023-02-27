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
      escapeXmlAttr = __helpers.xa,
      classAttr = __helpers.ca;

  return function render(data, out) {
    layout_use({
        "*": {
            currentTitle: "OneDrive"
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
                    renderBody: function renderBody(out, user) {
                      if (user == null) {
                        out.w("<center><div class=\"loginScreen\"><div id=\"OneLoginLogo\" class=\"authlog\" title=\"one\"></div></div></center>");
                      } else {
                        var folders = user;

                        var kpath = "/one/k/";

                        var hasfolder = false,
                            hasphoto = false,
                            hasvideo = false,
                            hasother = false;

                        out.w("<div class=\"row bhoechie-tab-content active\"><div class=\"col-lg-1 col-md-1 col-sm-12 col-xs-12 folder-container\"><div class=\"row folder-box-row\">");

                        forEach(folders.value, function(item) {
                          if (item.folder != undefined) {
                            hasfolder = true;

                            out.w("<div class=\"col-lg-12 col-md-12 col-sm-3 col-xs-6 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"folder-box\"><a class=\"folder\"" +
                              attr("name", item.id) +
                              attr("href", kpath + item.id) +
                              attr("id", item.id) +
                              "><img" +
                              attr("name", item.id) +
                              " src=\"" +
                              escapeXmlAttr(out.global.app.locals.staticdir) +
                              "/themes/images/folder.png\"></a><div class=\"folder-dt name\">" +
                              escapeXml(item.name) +
                              "</div> <div class=\"folder-dt date\">" +
                              escapeXml(new Date(item.createdDateTime).toDateString().substring(4)) +
                              "</div> </div></div>");
                          }
                        });

                        out.w("</div></div><div" +
                          classAttr(hasfolder ? "col-lg-10 col-md-10 col-sm-12 col-xs-12 tab-content" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-content") +
                          "><div class=\"opt-session\"><span class=\"glyphicon glyphicon-th-list\" id=\"view-gallery\"></span><span class=\"glyphicon glyphicon-option-vertical\" id=\"options\"></span></div><ul class=\"nav nav-tabs\"><li class=\"active\"><a data-toggle=\"tab\" href=\"#photo-tab\">Photos</a></li><li><a data-toggle=\"tab\" href=\"#video-tab\">Videos</a></li><li><a data-toggle=\"tab\" href=\"#others-tab\">Others</a></li></ul><div id=\"photo-tab\" class=\"tab-pane fade in active\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"photo-row\" mode=\"grid\">");

                        forEach(folders.value, function(item) {
                          if ((item.file != undefined) && (item.image != undefined)) {
                            hasphoto = true;

                            out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"photo-box\"><div class=\"photo\" data-slide-to=\"0\" data-toggle=\"modal\"" +
                              attr("name", item.id) +
                              attr("title", item.webUrl) +
                              "><img" +
                              attr("name", item.id) +
                              attr("src", item.thumbnails[0].c400x400.url) +
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

                        forEach(folders.value, function(item) {
                          if ((item.file != undefined) && (item.video != undefined)) {
                            hasvideo = true;

                            out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"video-box\"><a class=\"video\"" +
                              attr("name", item.id) +
                              attr("href", item.webUrl) +
                              " target=\"_blank\"><img" +
                              attr("name", item.id) +
                              attr("src", item.thumbnails[0].c400x400.url) +
                              "></a></div></div>");
                          }
                        });

                        out.w("</div>");

                        if (hasvideo == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-video2.jpg);\"></span>");
                        }

                        out.w("</div><div class=\"clearfix\"></div></div></div><div id=\"others-tab\" class=\"tab-pane fade\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\">");

                        forEach(folders.value, function(item) {
                          if ((item.file != undefined) && (item.audio != undefined)) {
                            hasother = true;

                            out.w("<div class=\"col-sm-12 col-xs-12\"><div class=\"audio-box\"><a class=\"audio glyphicon glyphicon-play-circle\"" +
                              attr("href", item.webUrl) +
                              " target=\"_blank\"" +
                              attr("name", item.id) +
                              "></a><span>" +
                              escapeXml(item.name) +
                              "</span></div></div>");
                          }

                          if ((((((item.file != undefined) && (item.image == undefined)) && (item.video == undefined)) && (item.audio == undefined)) && (item.file.mimeType != undefined)) && (item.file.mimeType.includes("application") || item.file.mimeType.includes("text"))) {
                            hasother = true;

                            out.w("<div class=\"col-sm-12\"><div class=\"audio-box\"><a class=\"doc glyphicon glyphicon-file\"" +
                              attr("href", item.webUrl) +
                              " target=\"_blank\"></a><span>" +
                              escapeXml(item.name) +
                              "</span></div></div>");
                          }
                        });

                        out.w("</div>");

                        if (hasother == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-item.jpg);\"></span>");
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
