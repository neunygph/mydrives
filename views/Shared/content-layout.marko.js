function create(__helpers) {
  var loadTemplate = __helpers.l,
      Shared_layout = loadTemplate(require.resolve("../Shared/layout.marko")),
      str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      layout_use = __loadTag(require("marko/taglibs/layout/use-tag")),
      layout_put = __loadTag(require("marko/taglibs/layout/put-tag")),
      html_comment = __loadTag(require("marko/taglibs/html/html-comment-tag")),
      layout_placeholder = __loadTag(require("marko/taglibs/layout/placeholder-tag"));

  return function render(data, out) {
    layout_use({
        "*": {
            loadGallery: true,
            loadDropbox: true
          },
        __template: Shared_layout,
        getContent: function getContent(__layoutHelper) {
          layout_put({
              into: "body",
              layout: __layoutHelper,
              renderBody: function renderBody(out) {
                out.w("<section class=\"row mbr-gallery mbr-section mbr-section--no-padding\" id=\"gallery2-10\"><div class=\"col-sm-12\" id=\"main-body\"><div class=\"row mid-allign\"><ul class=\"breadcrumb\"><li><a href=\"#\">" +
                  escapeXml(data.currentTitle) +
                  "</a> </li><li><a href=\"#\">Library</a></li><li class=\"active\">Data</li></ul><span class=\"setting\"></span></div><div class=\"row gutter bhoechie-tab-container\" id=\"main-section\">");

                html_comment({
                    renderBody: function renderBody(out) {
                      out.w("nav");
                    }
                  }, out);

                out.w("<div class=\"col-lg-1 col-md-1 col-xs-1 col-sm-1 gutter bhoechie-tab-menu hidden-sm hidden-xs\" id=\"desktop-main-nav\"><div class=\"list-group\" id=\"list-item\"><a href=\"javascript:void(0);\" title=\"amazon\" class=\"list-group-item text-center sr-log\"><span id=\"amazonnav\" style=\"background-image: url(https://d3sh86b159avjl.cloudfront.net/themes/images/amzn.png);\"></span></a><a href=\"javascript:void(0);\" title=\"google\" class=\"list-group-item text-center sr-log\"><span id=\"googlenav\" style=\"background-image: url(https://d3sh86b159avjl.cloudfront.net/themes/images/google.png);\"></span></a><a href=\"javascript:void(0);\" title=\"one\" class=\"list-group-item text-center sr-log\"><span id=\"onenav\" style=\"background-image: url(https://d3sh86b159avjl.cloudfront.net/themes/images/onenav.png);\"></span></a><a href=\"javascript:void(0);\" title=\"dropbox\" class=\"list-group-item text-center sr-log\"><span id=\"dropboxnav\" style=\"background-image: url(https://d3sh86b159avjl.cloudfront.net/themes/images/dropbox.png);\"></span></a><a href=\"javascript:void(0);\" title=\"facebook\" class=\"list-group-item text-center sr-log\"><span id=\"facebooknav\" style=\"background-image: url(https://d3sh86b159avjl.cloudfront.net/themes/images/facebook.png);\"></span></a><a href=\"javascript:void(0);\" title=\"instagram\" class=\"list-group-item text-center sr-log\"><span id=\"instagramnav\" style=\"background-image: url(https://d3sh86b159avjl.cloudfront.net/themes/images/instagram.png);\"></span></a></div></div>");

                html_comment({
                    renderBody: function renderBody(out) {
                      out.w("main-content");
                    }
                  }, out);

                out.w("<div class=\"col-lg-11 col-md-11 col-sm-12 col-xs-12 gutter bhoechie-tab main-tabcontent\" style=\"padding:0px!important;\">");

                layout_placeholder({
                    name: "body-content",
                    content: data.layoutContent
                  }, out);

                out.w("</div></div></div></section>");
              }
            }, out);
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
