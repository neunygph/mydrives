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
            currentTitle: data.title,
            prePath: data.path
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
                        out.w("<center><div class=\"loginScreen\"><div id=\"AmazonLoginLogo\" class=\"authlog\" title=\"amazon\"></div></div></center>");
                      } else {
                        var folders = user;

                        var kpath = "/amazon/k/";

                        var hasfolder = false,
                            hasphoto = false,
                            hasvideo = false,
                            hasother = false;

                        out.w("<div class=\"row bhoechie-tab-content active\"><div class=\"col-lg-1 col-md-1 col-sm-12 col-xs-12 folder-container\"><div class=\"row folder-box-row\">");

                        forEach(folders.data, function(item) {
                          if (item.kind == "FOLDER") {
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
                              escapeXml(new Date(item.createdDate).toDateString().substring(4)) +
                              "</div> </div></div>");
                          }
                        });

                        out.w("</div></div><div" +
                          classAttr(hasfolder ? "col-lg-10 col-md-10 col-sm-12 col-xs-12 tab-content" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 tab-content") +
                          "><div class=\"opt-session\"><span class=\"glyphicon glyphicon-th-list\" id=\"view-gallery\"></span><span class=\"glyphicon glyphicon-option-vertical\" id=\"options\"></span></div><ul class=\"nav nav-tabs\"><li class=\"active\"><a data-toggle=\"tab\" href=\"#photo-tab\">Photos</a></li><li><a data-toggle=\"tab\" href=\"#video-tab\">Videos</a></li><li><a data-toggle=\"tab\" href=\"#others-tab\">Others</a></li></ul><div id=\"photo-tab\" class=\"tab-pane fade in active\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"photo-row\" mode=\"grid\">");

                        var count = 0;

                        forEach(folders.data, function(item) {
                          if ((item.kind == "FILE") && (item.contentProperties.image != null)) {
                            hasphoto = true;

                            out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"photo-box\"><div class=\"photo\"" +
                              attr("data-slide-to", count) +
                              " data-toggle=\"modal\"" +
                              attr("name", item.id) +
                              " title=\"" +
                              escapeXmlAttr(item.tempLink) +
                              "?viewBox=400\"><a href=\"#lb-gallery2-10\"" +
                              attr("data-slide-to", count) +
                              " data-toggle=\"modal\"><img" +
                              attr("name", item.id) +
                              " src=\"" +
                              escapeXmlAttr(item.tempLink) +
                              "?viewBox=400\"></a></div></div></div>");

                            count++;
                          }
                        });

                        out.w("</div>");

                        if (hasphoto == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-image2.jpg);\"></span>");
                        }

                        out.w("</div><div class=\"clearfix\"></div></div><div data-app-prevent-settings=\"\" class=\"mbr-slider modal fade carousel slide\" tabindex=\"-1\" data-keyboard=\"true\" data-interval=\"false\" id=\"lb-gallery2-10\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-body\"><div class=\"carousel-inner\">");

                        var count = 0;

                        forEach(folders.data, function(item) {
                          if ((item.kind == "FILE") && (item.contentProperties.image != null)) {
                            count++;

                            if (count == 2) {
                              out.w("<div class=\"item active\"><img alt=\"\" src=\"" +
                                escapeXmlAttr(item.tempLink) +
                                "?viewBox=400\"></div>");
                            } else {
                              out.w("<div class=\"item\"><img alt=\"\" src=\"" +
                                escapeXmlAttr(item.tempLink) +
                                "?viewBox=400\"></div> ");
                            }
                          }
                        });

                        out.w("</div><a class=\"left carousel-control\" role=\"button\" data-slide=\"prev\" href=\"#lb-gallery2-10\"><span class=\"glyphicon glyphicon-menu-left\" aria-hidden=\"true\"></span><span class=\"sr-only\">Previous</span></a><a class=\"right carousel-control\" role=\"button\" data-slide=\"next\" href=\"#lb-gallery2-10\"><span class=\"glyphicon glyphicon-menu-right\" aria-hidden=\"true\"></span><span class=\"sr-only\">Next</span></a><a class=\"close\" href=\"#\" role=\"button\" data-dismiss=\"modal\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span><span class=\"sr-only\">Close</span></a></div></div></div></div></div><div id=\"video-tab\" class=\"tab-pane fade\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\" id=\"video-row\" mode=\"grid\">");

                        forEach(folders.data, function(item) {
                          if ((item.kind == "FILE") && (item.contentProperties.video != null)) {
                            hasvideo = true;

                            out.w("<div class=\"col-lg-3 col-md-3 col-sm-4 col-xs-4 mbr-gallery-item\"><figcaption class=\"mbr-figure__caption mbr-figure__caption--std-grid\"><div class=\"mbr-caption-background\"></div><small class=\"mbr-figure__caption-small\">Type caption here</small></figcaption><div class=\"video-box\"><div class=\"video\" data-slide-to=\"0\" data-toggle=\"modal\" data-target=\".mymodal\"" +
                              attr("name", item.id) +
                              attr("title", src = item.tempLink) +
                              "><img" +
                              attr("name", item.id) +
                              " src=\"" +
                              escapeXmlAttr(item.tempLink) +
                              "?viewBox=300\"></div></div></div>");
                          }
                        });

                        out.w("</div>");

                        if (hasvideo == false) {
                          out.w("<span class=\"no-item\" style=\"background-image: url(" +
                            escapeXmlAttr(out.global.app.locals.staticdir) +
                            "/themes/images/no-video2.jpg);\"></span>");
                        }

                        out.w("</div><div class=\"clearfix\"></div></div></div><div id=\"others-tab\" class=\"tab-pane fade\"><div class=\"mbr-section__container mbr-gallery-layout-article mbr-section__container--isolated\"><div><div class=\"row mbr-gallery-row no-gutter\">");

                        forEach(folders.data, function(item) {
                          if ((item.kind != "FOLDER") && (item.contentProperties.contentType.indexOf("audio") > (-1))) {
                            hasother = true;

                            out.w("<div class=\"col-sm-12 col-xs-12\"><div class=\"audio-box\"><div class=\"audio glyphicon glyphicon-play-circle\" data-toggle=\"modal\" data-target=\".mymodal\"" +
                              attr("name", item.id) +
                              attr("title", item.tempLink) +
                              "></div><span>" +
                              escapeXml(item.name) +
                              "</span></div></div>");
                          }

                          if ((((item.kind == "FILE") && (item.contentProperties.contentType.indexOf("audio") < 0)) && (item.contentProperties.image === undefined)) && (item.contentProperties.video === undefined)) {
                            hasother = true;

                            out.w("<div class=\"col-sm-12 col-xs-12\"><a" +
                              attr("href", item.tempLink) +
                              attr("name", item.id) +
                              " class=\"doc glyphicon glyphicon-file\" target=\"_blank\"></a><span>" +
                              escapeXml(item.name) +
                              "</span></div>");
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
