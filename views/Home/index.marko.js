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
      escapeXmlAttr = __helpers.xa;

  return function render(data, out) {
    var cDir = out.global.app.locals.staticdir;

    layout_use({
        "*": {
            showLogicon: true
          },
        __template: Shared_layout,
        getContent: function getContent(__layoutHelper) {
          layout_put({
              into: "body",
              layout: __layoutHelper,
              renderBody: function renderBody(out) {
                out.w("<section class=\"mbr-section mbr-section--relative mbr-section--fixed-size\" id=\"features1-o\" style=\"background-color: rgb(255, 255, 255);\"> <div class=\"mbr-section__container container mbr-section__container--std-top-padding\" style=\"padding-top: 93px;\"> <div class=\"mbr-section__row row\"> <div class=\"mbr-section__col col-xs-12 col-md-3 col-sm-6\"> <div class=\"mbr-section__container mbr-section__container--center mbr-section__container--middle\"> <figure class=\"mbr-figure\"><img src=\"" +
                  escapeXmlAttr(cDir) +
                  "/themes/images/home1.png\" class=\"mbr-figure__img\"></figure> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-header mbr-header--reduce mbr-header--center mbr-header--wysiwyg\"> <h3 class=\"mbr-header__text\">MULTIPLE CLOUD</h3> </div> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-article mbr-article--wysiwyg\"> <p>View your media files from your cloud drives in one place, switching from drive to drive without opening another page or go to another different website. Watch videos with more than 30 minutes long which is not allowed on certain cloud storages.</p> </div> </div> <div class=\"mbr-section__container mbr-section__container--last\" style=\"padding-bottom: 93px;\"> <div class=\"mbr-buttons mbr-buttons--center\"><a href=\"/help\" class=\"mbr-buttons__btn btn btn-wrap btn-xs-lg btn btn-primary\">LEARN MORE</a></div> </div> </div> <div class=\"mbr-section__col col-xs-12 col-md-3 col-sm-6\"> <div class=\"mbr-section__container mbr-section__container--center mbr-section__container--middle\"> <figure class=\"mbr-figure\"><img src=\"" +
                  escapeXmlAttr(cDir) +
                  "/themes/images/home3.png\" class=\"mbr-figure__img\"></figure> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-header mbr-header--reduce mbr-header--center mbr-header--wysiwyg\"> <h3 class=\"mbr-header__text\">DRIVES MANAGEMENT</h3> </div> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-article mbr-article--wysiwyg\"> <p>Share files between your cloud storages, upload/download and transfer files from one cloud drive to another without having to download to your device first.</p> </div> </div> <div class=\"mbr-section__container mbr-section__container--last\" style=\"padding-bottom: 93px;\"> <div class=\"mbr-buttons mbr-buttons--center\"><a href=\"/help\" class=\"mbr-buttons__btn btn btn-wrap btn-xs-lg btn btn-primary\">LEARN MORE</a></div> </div> </div> <div class=\"clearfix visible-sm-block\"></div> <div class=\"mbr-section__col col-xs-12 col-md-3 col-sm-6\"> <div class=\"mbr-section__container mbr-section__container--center mbr-section__container--middle\"> <figure class=\"mbr-figure\"><img src=\"" +
                  escapeXmlAttr(cDir) +
                  "/themes/images/home2.png\" class=\"mbr-figure__img\"></figure> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-header mbr-header--reduce mbr-header--center mbr-header--wysiwyg\"> <h3 class=\"mbr-header__text\">RESPONSIVE</h3> </div> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-article mbr-article--wysiwyg\"> <p>MyDrives is a mobile-first website with fully responsive features which is viewable and can be accessed from different devices.</p> </div> </div> <div class=\"mbr-section__container mbr-section__container--last\" style=\"padding-bottom: 93px;\"> <div class=\"mbr-buttons mbr-buttons--center\"><a href=\"/help\" class=\"mbr-buttons__btn btn btn-wrap btn-xs-lg btn btn-primary\">LEARN MORE</a></div> </div> </div> <div class=\"mbr-section__col col-xs-12 col-md-3 col-sm-6\"> <div class=\"mbr-section__container mbr-section__container--center mbr-section__container--middle\"> <figure class=\"mbr-figure\"><img src=\"" +
                  escapeXmlAttr(cDir) +
                  "/themes/images/home6.png\" class=\"mbr-figure__img\"></figure> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-header mbr-header--reduce mbr-header--center mbr-header--wysiwyg\"> <h3 class=\"mbr-header__text\">SHARED DRIVES</h3> </div> </div> <div class=\"mbr-section__container mbr-section__container--middle\"> <div class=\"mbr-article mbr-article--wysiwyg\"> <p>Combine your free cloud storages or social media accounts to increase your free cloud storage size. View your posted media files on Instagram and post photos/videos from your cloud drives to Facebook.</p> </div> </div> <div class=\"mbr-section__container mbr-section__container--last\" style=\"padding-bottom: 93px;\"> <div class=\"mbr-buttons mbr-buttons--center\"><a href=\"/help\" class=\"mbr-buttons__btn btn btn-wrap btn-xs-lg btn btn-primary\">LEARN MORE</a></div> </div> </div> </div> </div> </section>");
              }
            }, out);
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);
