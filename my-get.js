// my-get.js
// Usage:
// slimerjs --ssl-protocol=any --web-security=false my-get.js
// the ssl-protocol and web-security flags are added to dismiss SSL errors

var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var m3u8Flag = 0;
var ts_i = 0;

var ts_urls = new Array();

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
    var baseUrl = request.url.split('?')[0];
    var temp = baseUrl.split('/');
    var fileName = temp[temp.length-1];
    if ('m3u8' == fileName)
    {
        console.log('request: ' + request.url);
    }
    var paras = request.url.split('?')[1].split('&');
    var ts_start = getQueryString(response.url, 'ts_start');
    var ts_end =  getQueryString(response.url, 'ts_end');
    if (0 == ts_start && 0 == ts_end) {return;}
    console.log('request: ' + baseUrl + ' ts_start: ' + ts_start + 'ts_end: ' + ts_end);
};

function readM3u8(m3u8)
{
    var lines = m3u8.split('\n');
    for (var i = 0; i < lines.length; i++)
    {
        var url = lines[i];
        if ('' == url) continue;
        if ('#' == url[0]) continue;
        ts_urls[ts_urls.length] = url;
    }
}

page.onResourceReceived = function(response) {
    if ('end' != response.stage) {return;}
    var baseUrl = response.url.split('?')[0];
    var temp = baseUrl.split('/');
    var fileName = temp[temp.length-1];
    var dir = '/root/video/';

    if ('m3u8' == fileName)
    {
        console.log('received: ' + fileName
            + ' bodySize: '+ response.bodySize
            + ' stage: ' + response.stage);
        fs.makeDirectory(dir);
        fs.write(dir + fileName, response.body, 'b');
        return;
    }

    var ts_start = getQueryString(response.url, 'ts_start');
    var ts_end = getQueryString(response.url, 'ts_end');
    if (0 == ts_start && 0 == ts_end) {return;}

    console.log('received: ' + fileName + ' ts_start: ' + ts_start
        + ' ts_end: ' + ts_end + ' bodySize: '+ response.bodySize
        + ' stage: ' + response.stage);
    fs.makeDirectory(dir);
    var path = dir + fileName + '_._' + ts_start + '_._' + ts_end;
    fs.write(path, response.body, 'b');
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
page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0';
var url = 'http://v.youku.com/v_show/id_XMzUzNDE3NDc5Ng==.html?spm=a2hww.20027244.search.5&from=y1.8-4.999'
//var url = 'http://www.baidu.com/index.html'
// Open the web page
//page.open(system.args[1]);
page.viewportSize = { width: 1980, height: 1024};
page.open(url);
