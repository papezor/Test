

var refresh = 60; // ogni quanti secondi si ricarica i dati
var coord_def = new google.maps.LatLng(41.890105,12.480821); // centro di roma
var munG = 99;var munD;var targetCoordMun = new google.maps.LatLng(41.890105,12.480821); // centro di roma
var zoom = 11;  // zoom originale
var map;	    
var coordPless = [];
var sez = [];
var markerArray = [];
var markerMun = [];
var dataSetSez = [];
var dataSetMun = []; var dataSetDetMun = [];
var percTotMun;var plotGraffNow;
var infowindow = new google.maps.InfoWindow();
var lat = '0'; var lng = '0';
var divDisp = '#renderPage';

var vers = 0;
var piePerv;

var dataAuth = $.mobile.path.parseUrl(window.location.href);
//for (var x in dataAuth){alert(x); alert(dataAuth[x]);}
jQuery(document).ready(function(){elezioni.menu.init(); loadAssets();});   