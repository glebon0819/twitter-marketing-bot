const casper = require('casper').create();

var x = require('casper').selectXPath;

casper.userAgent('Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0');

casper.options.waitTimeout = 50000;
casper.options.waitForTimeout = 50000;
casper.options.loadImages = false;

casper.onResourceRequested = function(req){
    console.log("onResourceRequested");
}

casper.start('https://twitter.com/login');

// login page
casper.waitForSelector("form input[name='session[password]']", function() {
	console.log('Filling Form Fields.')
    this.fillSelectors('form.signin', {
        'input[name="session[username_or_email]"]' : 'username',
        'input[name="session[password]"]' : 'password'
    }, true);
    casper.capture('loggingin.png');
    console.log('Logging in.');
});

// home page
casper.waitForSelector("a.js-tooltip img.Avatar", function() {
	console.log('Logged in.');
	this.capture('loggedin.png');

	this.click(x('//span[text()="Followers"]'));
	console.log('Going to Followers Page.');
});

casper.waitForSelector("a.fullname", function(){
	console.log('Inside Followers Page. Retrieving Follower Names.');
	/*
	this.scrollToBottom();
	this.wait(10000);
	*/
});

casper.thenEvaluate(function(){
	window.scrollTo(0,document.body.scrollHeight);
});

casper.then(function(){
	this.wait(5000);
});

casper.then(function(){
	var followernames = this.fetchText('a.fullname');
	console.log('Follower Names: ' + followernames);
	this.capture('followers.png')
});

// logout
casper.then(function(){
	console.log('Done. Time to go.');
	this.click(x('//a[contains(@class, "js-tooltip")]/img[contains(@class, "Avatar")]'));
	this.wait(1000);
	console.log('Clicked my face.');
	this.capture('loggingout.png');
	this.click(x('//*[@id="signout-button"]'));
	console.log('Logging out.');
});


// mobile page
casper.then(function(){
	this.wait(10000);
	console.log('Logged out.');
	this.capture('loggedout.png');
});

casper.run();