var express = require('express'),
    router = express.Router(),
    template = require('../views/Home/index.marko'),
    aboutTPL = require('../views/Home/about.marko'),
    contactTPL = require('../views/Home/contact.marko'),
    helpTPL = require('../views/Home/contact.marko'),
    authPL = require('../views/Home/auth.marko'),
    templatePath = './views/Home/button.marko',
    tTest = require('marko').load(templatePath, {writeToDisk: true});

/* GET home page. */
router.get('/', function (req, res) {
    res.setHeader('Cache-Control','public, max-age=2592000');
    res.marko(template,{
        name: 'MyDrives',
        count: 2,
        colors: ['red', 'green', 'blue']
    });

})

/* GET about page. */
router.get('/about', function (req, res) {
    res.marko(aboutTPL, { title: 'About', message:'About MyDrives' })
})

/* GET contact page. */
router.get('/contact', function (req, res) {
    res.marko(contactTPL, { title: 'Contact', message:'Contact us' })
    //contactTPL.stream({ name:'Frank' }).pipe(res);
});

/* GET contact page. */
router.get('/help', function (req, res) {
    res.marko(helpTPL, { title: 'Help', message:'Tech tips' })
});

router.get('/auth', function (req, res) {
    res.marko(authPL);
});

module.exports = router
