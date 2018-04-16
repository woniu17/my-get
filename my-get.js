// my-get.js
// Usage:
// slimerjs --ssl-protocol=any --web-security=false my-get.js
// the ssl-protocol and web-security flags are added to dismiss SSL errors

var page = require('webpage').create();
var system = require('system');
var fs = require('fs');

function getQueryString (url, name) {
  /* eslint-disable */
  return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)')
           .exec(url)||[, ''])[1].replace(/\+/g, '%20')) || 0
  /* eslint-enable */
}

// Listen for all requests made by the webpage,
// (like the 'Network' tab of Chrome developper tools)
// and add them to an array
page.onResourceRequested = function(request, networkRequest) { 
    // If the requested url if the one of the webpage, do nothing
    // to allow other ressource requests
    var baseUrl = response.url.split('?')[0];
    var paras = response.url.split('?')[1].split('&');
    var ts_start = getQueryString(response.url, 'ts_start');
    var ts_end =  getQueryString(response.url, 'ts_end');
    if (0 == ts_start && 0 == ts_end) {return;}
    console.log('request: ' + baseUrl + ' ts_start: ' + ts_start + 'ts_end: ' + ts_end);
};

page.onResourceReceived = function(response) {
    if ('end' != response.stage) {return;}
    var baseUrl = response.url.split('?')[0];
    var temp = baseUrl.split('/');
    var fileName = temp[temp.length-1];
    var paras = response.url.split('?')[1].split('&');
    var ts_start = getQueryString(response.url, 'ts_start');
    var ts_end =  getQueryString(response.url, 'ts_end');
    if (0 == ts_start && 0 == ts_end) {return;}

    console.log('received: ' + fileName + ' ts_start: ' + ts_start
        + ' ts_end: ' + ts_end + ' bodySize: '+ response.bodySize
        + ' stage: ' + response.stage);
    var dir = '/root/video/';
    fs.makeDirectory(dir);
    var path = dir + fileName + '_._' + ts_start + '_._' + ts_end;
    fs.write(path, response.body, 'b');
    console.log('write: ' + res);
}

// When all requests are made, output the array to the console
page.onLoadFinished = function(status) {
  // console.log(JSON.stringify(urls));
  console.log('finished');
  // phantom.exit();
};

// If an error occur, dismiss it
page.onResourceError = function(){
  return false;
}
page.onError = function(){
  return false;
}

page.captureContent = [ /.*/ ]
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36';
var url = 'http://v.youku.com/v_show/id_XMzU0MTQ1NTU4NA==.html?spm=a2hww.20027244.m_250036.5~5!2~5~5!2~5~5~A&f=51666735'
// Open the web page
//page.open(system.args[1]);
page.open(url);
