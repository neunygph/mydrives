function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      escapeXmlAttr = __helpers.xa,
      __loadTag = __helpers.t,
      html_comment = __loadTag(require("marko/taglibs/html/html-comment-tag")),
      layout_placeholder = __loadTag(require("marko/taglibs/layout/placeholder-tag")),
      await_reorderer = __loadTag(require("marko/taglibs/async/await-reorderer-tag"));

  return function render(data, out) {
    out.w("<?xml version=\"1.0\" encoding=\"UTF-8\"?> <!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML Basic 1.1//EN\" \"http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd\"> <html lang=\"en\"><head>");

    var cDir = out.global.app.locals.staticdir;

    out.w("<title>MyDrives </title><meta charset=\"UTF-8\"> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <meta name=\"viewport\" content=\"width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui\"> <link rel=\"icon\" href=\"https://d3sh86b159avjl.cloudfront.net/themes/images/ifile.ico\" type=\"image/x-icon\"> <meta name=\"description\" content=\"MyDrives is a mobile-first website where users can view, edit, upload, download and share files between multiple cloud storages such as Dropbox, Google Drive, Amazon Cloud, OneDrive...etc.Transferring files from one cloud drive to another without having to download to your devices. Watch videos with more than 30 minutes long which are not allowed on some certain cloud storages. Conbine multiple free cloud storage accounts to increase your free online storage size. Switching between cloud accounts without having to open another page or go to another different website. View recent media posts from Instagram and post photos/videos from different cloud storages to Facebook.\"> <meta name=\"keywords\" content=\"files upload, files download, cloud files, upload, download, free upload, free download\"> <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto:700,400&amp;amp;subset=cyrillic,latin,greek,vietnamese\"> <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css\"> <link rel=\"stylesheet\" href=\"" +
      escapeXmlAttr(cDir) +
      "/style_v1.6.min.css\" type=\"text/css\"> <script>\r\n      (function () {\r\n        var node, i;\r\n          for (i = window.document.childNodes.length; i--;) {\r\n              node = window.document.childNodes[i];\r\n              if (node.nodeName == 'HTML') {\r\n              node.className += ' javascript';\r\n              }\r\n          }\r\n      })();\r\n    </script> </head><body><div class=\"modal fade mymodal\" tabindex=\"-1\" role=\"dialog\"> <div class=\"modal-dialog modal-lg\" role=\"document\"> <div class=\"modal-content\"> <div class=\"modal-header\"> <button type=\"button\" id=\"mymodal-close\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> </div> <div id=\"mymodal-body\" class=\"modal-body\"> </div> </div> </div> </div> <div class=\"container-fluid\" id=\"content\"> <section class=\"row mbr-navbar mbr-navbar--freeze mbr-navbar--absolute mbr-navbar--auto-collapse\" id=\"ext_menu-u\"> <div class=\"mbr-navbar__section mbr-section\"> <div class=\"mbr-navbar__hamburger mbr-hamburger\" id=\"nav-btn\"><span class=\"mbr-hamburger__line\"></span></div> <a href=\"#\" id=\"search\"><img id=\"srch-img\" src=\"https://d3sh86b159avjl.cloudfront.net/themes/images/search.png\"></a> <div class=\"mbr-section__container container\"> <div class=\"mbr-navbar__container\"> <div class=\"mbr-navbar__column mbr-navbar__column--s mbr-navbar__brand\"> <span class=\"mbr-navbar__brand-link mbr-brand mbr-brand--inline\"> <span class=\"mbr-brand__logo\"><a href=\"https://www.mydrives.cloud\"><img src=\"https://d3sh86b159avjl.cloudfront.net/themes/images/ifile_small.png\" class=\"mbr-navbar__brand-img mbr-brand__img\" alt=\"Mobirise\"></a></span> <span class=\"mbr-brand__name\"><a class=\"mbr-brand__name text-white\" href=\"https://www.mydrives.cloud\">MyDrives</a></span> </span> </div> <div class=\"mbr-navbar__column mbr-navbar__menu\" id=\"desktop-menu\"> <nav class=\"mbr-navbar__menu-box mbr-navbar__menu-box--inline-right\"> <div class=\"mbr-navbar__column\"> <ul class=\"mbr-navbar__items mbr-navbar__items--right float-left mbr-buttons mbr-buttons--freeze mbr-buttons--right btn-decorator mbr-buttons--active mbr-buttons--only-links\"> <li class=\"mbr-navbar__item\"><a class=\"mbr-buttons__link btn text-white\" href=\"/\">HOME</a></li> <li class=\"mbr-navbar__item\"><a class=\"mbr-buttons__link btn text-white\" href=\"/about\">ABOUT</a></li> <li class=\"mbr-navbar__item\"><a class=\"mbr-buttons__link btn text-white\" href=\"/contact\">CONTACT</a></li> </ul> </div> </nav> </div> <div class=\"mbr-navbar__column mbr-navbar__menu\" id=\"mobile-nav\"> <nav class=\"mbr-navbar__menu-box mbr-navbar__menu-box--inline-right\"> <div class=\"mbr-navbar__column\"> <ul id=\"mobile-menu\" class=\"mbr-navbar__items mbr-navbar__items--right float-left mbr-buttons mbr-buttons--freeze mbr-buttons--right btn-decorator mbr-buttons--active mbr-buttons--only-links\"> <li class=\"mbr-navbar__item mobile\"><span id=\"homenav\" class=\"authlog\"></span></li> <li class=\"mbr-navbar__item mobile\"><span id=\"AmazonLoginLogo\" class=\"authlog\" title=\"amazon\"></span></li> <li class=\"mbr-navbar__item mobile\"><span id=\"GoogleLoginLogo\" class=\"authlog\" title=\"google\"></span></li> <li class=\"mbr-navbar__item mobile\"><span id=\"OneLoginLogo\" class=\"authlog\" title=\"one\"></span></li> <li class=\"mbr-navbar__item mobile\"><span id=\"DropboxLoginLogo\" class=\"authlog\" title=\"dropbox\"></span></li> <li class=\"mbr-navbar__item mobile\"><span id=\"FacebookLoginLogo\" class=\"authlog\" title=\"facebook\"></span></li> <li class=\"mbr-navbar__item mobile\"><span id=\"InstagramLoginLogo\" class=\"authlog\" title=\"instagram\"></span></li> </ul> </div> </nav> </div> </div> </div> </div> </section> <section class=\"row mbr-section mbr-section--relative mbr-section--fixed-size mbr-after-navbar\" id=\"social-buttons1-13\" style=\"background-color: rgb(255, 255, 255);\"> <div class=\"wrapper\"> <div class=\"mbr-header mbr-header--inline row\" style=\"padding-top: 40.8px; padding-bottom: 25.8px;\"> ");

    if (data.showLogicon === true) {
      out.w(" <div class=\"authDiv\"> <div><a href=\"javascript:void(0);\" title=\"amazon\" class=\"authlog\"><span id=\"amazonicon\" style=\"background-image: url(" +
        escapeXmlAttr(cDir) +
        "/themes/images/amzn.png);\"></span></a></div> <div><a href=\"javascript:void(0);\" title=\"google\" class=\"authlog\"><span id=\"googleicon\" style=\"background-image: url(" +
        escapeXmlAttr(cDir) +
        "/themes/images/google.png);\"></span></a></div> <div><a href=\"javascript:void(0);\" title=\"one\" class=\"authlog\"><span id=\"oneicon\" style=\"background-image: url(" +
        escapeXmlAttr(cDir) +
        "/themes/images/onedrive_small.png);\"></span></a></div> <div><a href=\"javascript:void(0);\" title=\"dropbox\" class=\"authlog\"><span id=\"dropboxicon\" style=\"background-image: url(" +
        escapeXmlAttr(cDir) +
        "/themes/images/dropbox.png);\"></span></a></div> <div><a href=\"javascript:void(0);\" title=\"facebook\" class=\"authlog\"><span id=\"facebookicon\" style=\"background-image: url(" +
        escapeXmlAttr(cDir) +
        "/themes/images/facebook.png);\"></span></a></div> <div><a href=\"javascript:void(0);\" title=\"instagram\" class=\"authlog\"><span id=\"instagramicon\" style=\"background-image: url(" +
        escapeXmlAttr(cDir) +
        "/themes/images/instagram.png);\"></span></a></div> </div> <div class=\"mbr-social-icons\"> <div class=\"mbr-social-likes social-likes_style-1\" data-counters=\"true\"> <div class=\"fb-like\" data-href=\"https://preview.mydrives.cloud\" data-layout=\"button_count\" data-action=\"like\" data-size=\"small\" data-show-faces=\"true\" data-share=\"true\"></div> </div> </div> ");
    }

    out.w(" </div> </div> </section> ");

    html_comment({
        renderBody: function renderBody(out) {
          out.w("body");
        }
      }, out);

    out.w(" ");

    layout_placeholder({
        name: "body",
        content: data.layoutContent
      }, out);

    out.w(" ");

    html_comment({
        renderBody: function renderBody(out) {
          out.w("form");
        }
      }, out);

    out.w(" <section class=\"row mbr-section mbr-section--relative mbr-section--fixed-size\" id=\"form2-z\" style=\"background-color: rgb(239, 239, 239);\"> <div class=\"mbr-section__container mbr-section__container--sm-padding container\" style=\"padding-top: 40.8px; padding-bottom: 40.8px;\"> <div class=\"row\"> <div class=\"col-sm-12\"> <div class=\"row\"> <div class=\"col-sm-8 col-sm-offset-2\" data-form-type=\"formoid\"> <div class=\"mbr-header mbr-header--center mbr-header--std-padding\"> <h2 class=\"mbr-header__text\">SUBSCRIBE TO OUR NEWSLETTER</h2> </div> <div data-form-alert=\"true\"> <div class=\"hide\" data-form-alert-success=\"true\">You have been successfully subscribed to our newsletter.</div> </div> <form class=\"mbr-form\" action=\"https://mydrives.cloud/\" method=\"post\" data-form-title=\"SUBSCRIBE TO OUR NEWSLETTER\"> <input type=\"hidden\" value=\"wMyga5Oeo0xaeCuZSp4KsM0dSIXJMzJup7wIArFyDpHPsEa7fHVgfvJbos0/J3Jje8Rb4Szl8j3NWDdOCgKsF+uHyHhlxm54cBcRORzzEus2l6jz2r728ebIFWB/YR7R\" data-form-email=\"true\"> <div class=\"mbr-form__left\"> <input type=\"email\" class=\"form-control\" name=\"email\" required=\"\" placeholder=\"Enter Your Email Address...\" data-form-field=\"Email\"> </div> <div class=\"mbr-form__right mbr-buttons mbr-buttons--no-offset mbr-buttons--right\"><button type=\"submit\" class=\"mbr-buttons__btn btn btn-lg btn-danger\">SUBSCRIBE</button></div> </form> </div> </div> </div> </div> </div> </section> <section class=\"row mbr-section mbr-section--relative mbr-section--fixed-size\" id=\"footer\"> <div class=\"mbr-section__container container\"> <div class=\"mbr-contacts mbr-contacts--wysiwyg row\" style=\"padding-top: 45px; padding-bottom: 45px;\"> <div class=\"col-sm-12\"> <div class=\"row\"> <div class=\"col-sm-4\"> <p class=\"mbr-contacts__text\"><strong>ADDRESS</strong><br> 1234 Street Name<br> City, AA 99999</p> </div> <div class=\"col-sm-4\"> <p class=\"mbr-contacts__text\"><strong>CONTACTS</strong><br> Email: support@mydrives.cloud<br> Phone: +1 (0) 000 0000 001<br> Fax: +1 (0) 000 0000 002</p> </div> <div class=\"col-sm-4\"> <p class=\"mbr-contacts__text\"></p><br> <p class=\"mbr-contacts__text\">Currently under development by <a href=\"https://www.linkedin.com/in/phuong-nguyen-1740aa34\" target=\"blank\">Phuong Nguyen</a></p><br> <p class=\"mbr-contacts__text\">&copy; MyDrives 20016</p> </div> </div> </div> </div> </div> </section> </div> <div id=\"scrollToTop\" class=\"scrollToTop mbr-arrow-up\"><a style=\"text-align: center;\"><i class=\"mbr-arrow-up-icon\"></i></a></div> <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js\"></script> <script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script> <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js\"></script> <script src=\"" +
      escapeXmlAttr(cDir) +
      "/scripts/mydrives.min.js\" defer></script> <script src=\"" +
      escapeXmlAttr(cDir) +
      "/assets/smooth-scroll/SmoothScroll.min.js\" defer></script> <script src=\"" +
      escapeXmlAttr(cDir) +
      "/assets/mobirise/js/script.min.js\" defer></script> <script src=\"" +
      escapeXmlAttr(cDir) +
      "/assets/formoid/formoid.min.js\" defer></script> ");

    if (data.loadGallery === true) {
      out.w(" <script src=\"" +
        escapeXmlAttr(cDir) +
        "/assets/masonry/masonry.pkgd.min.js\" defer></script> <script src=\"" +
        escapeXmlAttr(cDir) +
        "/assets/imagesloaded/imagesloaded.pkgd.min.js\" defer></script> <script src=\"" +
        escapeXmlAttr(cDir) +
        "/assets/bootstrap-carousel-swipe/bootstrap-carousel-swipe.min.js\" defer></script> <script src=\"" +
        escapeXmlAttr(cDir) +
        "/assets/mobirise-gallery/gallery.min.js\" defer></script> ");
    }

    out.w(" ");

    if (data.loadDropbox === true) {
      out.w(" <script type=\"text/javascript\" src=\"https://www.dropbox.com/static/api/2/dropins.js\" id=\"dropboxjs\" data-app-key=\"riqoimk2j9c8d1m\" defer></script> ");
    }

    out.w(" <script>\r\n      window.fbAsyncInit = function() {\r\n        FB.init({\r\n          appId      : '1756840247915942',\r\n          xfbml      : true,\r\n          version    : 'v2.7'\r\n        });\r\n      };\r\n    \r\n      (function(d, s, id){\r\n         var js, fjs = d.getElementsByTagName(s)[0];\r\n         if (d.getElementById(id)) {return;}\r\n         js = d.createElement(s); js.id = id;\r\n         js.src = \"//connect.facebook.net/en_US/sdk.js\";\r\n         fjs.parentNode.insertBefore(js, fjs);\r\n       }(document, 'script', 'facebook-jssdk'));\r\n    </script> ");

    await_reorderer({}, out);

    out.w(" </body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);
