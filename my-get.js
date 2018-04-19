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
        return;
    }
    if ('youku-player.min.js' == fileName)
    {
        console.log('request: ' + request.url);
        //request.abort();
        //request.changeUrl('http://127.0.0.1/youku-player.min.js');
        return;
    }
    var paras = request.url.split('?')[1].split('&');
    var ts_start = getQueryString(response.url, 'ts_start');
    var ts_end =  getQueryString(response.url, 'ts_end');
    if (0 == ts_start && 0 == ts_end) {return;}
    console.log('request: ' + baseUrl + ' ts_start: ' + ts_start + 'ts_end: ' + ts_end);
};

page.onResourceReceived = function(response) {
    if ('end' != response.stage) {return;}
    var url = response.url
    var baseUrl = url.split('?')[0];
    var temp = baseUrl.split('/');
    var fileName = temp[temp.length-1];
    var dir = '/root/video/';

    if ('m3u8' == fileName)
    {
        console.log('received: ' + fileName);
        var vid = getQueryString(url, 'vid');
        var type = getQueryString(url, 'type');
        fs.makeDirectory(dir);
        fs.write(dir + fileName + '#' + vid + '#' + type, response.body, 'b');
        return;
    }
    if ('youku-player.min.js' == fileName)
    {
        console.log('received: ' + fileName);
        fs.makeDirectory(dir);
        fs.write(dir + fileName, response.body, 'b');
        return;
    }

    var ts_start = getQueryString(url, 'ts_start');
    var ts_end = getQueryString(url, 'ts_end');
    if (0 == ts_start && 0 == ts_end) {return;}

    console.log('received: ' + fileName + ' ts_start: ' + ts_start + ' ts_end: ' + ts_end);
    fs.makeDirectory(dir);
    var path = dir + fileName + '##' + ts_start + '##' + ts_end;
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
var url = 'http://v.youku.com/v_show/id_XMzUzNDE3NDc5Ng==.html'
var url = 'http://v.youku.com/v_show/id_XMzUxNDk4NjQyOA==.html'
//var url = 'http://www.baidu.com/index.html'
// Open the web page
//page.open(system.args[1]);
//page.viewportSize = { width: 1980, height: 1024};
page.viewportSize = { width: 1000, height: 624};
page.open(url);
