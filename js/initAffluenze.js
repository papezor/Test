var dataSet = [];

var PieReg;var PieCam;var PieSen;var DonReg;var DonCam;var DonSen;var BarReg;var BarCam;var BarSen;var BarRegCfr;var BarCamCfr;var BarSenCfr;var PieRegStore;
var PieCamStore;var PieSenStore;


// 2 è regionali, 0 è camera , 1 è senato

// 2 prima aff, 3 seconda aff, 4 terza affluenza, 9 ultima affluenza


var oldAff = {
		"2":{
			"2":{
				"perv": 192166,
				"aste": (2342769 - 192166)
			},
			"3":{
				"perv": 692369,
				"aste": (2342769 - 692369)
			},
			"4":{
				"perv": 967624,
				"aste": (2342769 - 967624)
			},
			"9":{
				"perv": 1323669,
				"aste": (2342769 - 1323669)
			}
		},
		"1":{
			"2":{
				"perv": 343534,
				"aste": (2001676 - 343534)
			},
			"3":{
				"perv": 1022649,
				"aste": (2001676 - 1022649)
			},
			"4":{
				"perv": 1344598,
				"aste": (2001676 - 1344598)
			},
			"9":{
				"perv": 1606327,
				"aste": (2001676 - 1606327)
			}
		},
		"0":{
			"2":{
				"perv": 343534,
				"aste": (2158922 - 343534)
			},
			"3":{
				"perv": 1022649,
				"aste": (2158922 - 1022649)
			},
			"4":{
				"perv": 1344598,
				"aste": (2158922 - 1344598)
			},
			"9":{
				"perv": 1733986,
				"aste": (2158922 - 1733986)
			}
		}

};

var difSex = {
		"2":{
			"2":{
				"f": 91180,
				"m": 100986
			},
			"3":{
				"f": 356307,
				"m": 336062
			},
			"4":{
				"f": 499887,
				"m": 467737
			},
			"9":{
				"f": 695986,
				"m": 627683
			}
		},
		"1":{
			"2":{
				"f": 161193,
				"m": 182341
			},
			"3":{
				"f": 527141,
				"m": 495508
			},
			"4":{
				"f": 697027,
				"m": 647571
			},
			"9":{
				"f": 847997,
				"m": 758330
			}
		},
		"0":{
			"2":{
				"f": 161193,
				"m": 182341
			},
			"3":{
				"f": 527141,
				"m": 495508
			},
			"4":{
				"f": 697027,
				"m": 647571
			},
			"9":{
				"f": 911197,
				"m": 822789
			}
		}

};



var defPie = [['Affluenza',1], ['Astensione',1]];
var defBar = [['Maschi',3000000], ['Femmine',3000000]];

var cAst = 'lightgrey';
var cReg = 'green';
var cCam = 'red';
var cSen = 'yellow';
var cTot = 'violet';
var cSto = 'orange';




jQuery(document).ready(function () {  
 jQuery("#titoloCam").css('color',cCam);
 jQuery("#titoloReg").css('color',cReg);
 jQuery("#titoloSen").css('color',cSen);
 
    jQuery.getScript("js/elezioni.js", function(){
         elezioni.menu.init();    
	   });

 initGraphs();
 
 
 // AFF GRAPH PANEL
	//	addGraphPanel();

 loadData();






});