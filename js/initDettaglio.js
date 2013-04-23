var statoAttuale = '';
var munG = 99;var munD;
var zoom = 11;  // zoom originale
var map;	    
var coordPless = [];
var sez = [];
var markerArray = [];
var markerMun = [];
var dataSetSez = [];
var dataSetMun = []; var dataSetDetMun = [];
var percTotMun;var plotGraffNow;

var lat = '0'; var lng = '0';
var divDisp = '#renderPage';
var vers = 0;var piePerv;


var dataAuth = $.mobile.path.parseUrl(window.location.href);
//for (var x in dataAuth){alert(x); alert(dataAuth[x]);}
jQuery(document).ready(function(){
    jQuery.getScript("js/elezioni.js", function(){
         elezioni.menu.init();    
	   });

    loadAssets();
});   