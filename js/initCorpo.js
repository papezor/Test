
var name = 'Aff';  // Aff = affluenze  Com = composizione Scr = scrutinio

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
var timer = 0; var statusTimer = false; // variabili PER GESTIONE TIMER 
var divDisp = '#renderPage';
var statusGraph = false;
var vers = 0;

var totMun = '#50021B';
var cMun = ['#FF9933','#99FF66'];
var totMunF = 'pink';
var totMunM = 'lightblue';
var cMunDon =['blue','#FF66FF','lightblue','#FFCCFF'];

var dataAuth = $.mobile.path.parseUrl(window.location.href);
//for (var x in dataAuth){alert(x); alert(dataAuth[x]);}
jQuery(document).ready(function(){
     
	  jQuery.getScript("js/elezioni.js", function(){
         elezioni.menu.init();    
	   });
	 
     jQuery('#checkbox-1').attr('checked',true).checkboxradio('refresh');
     
     jQuery('.map').maphilight({
            fillColor: '008800'
        });
    $('#municipiyellow area').click(function(e) {

		    var Tid = this.id;
			if (Tid == "21"){return;}
			e.preventDefault();
            var data = $('#'+Tid).mouseout().data('maphilight') || {};

			if(!data.alwaysOn) {

			    jQuery('#checkbox-1').attr('checked',false).checkboxradio('refresh');

				if(obj.checkedMun == obj.maxMun) {
	              alert("Numero massimo di municipi selezionabili raggiunto");
		          return;
	            }

				for(i=1;i <= obj.maxMun;i++) {

				  if((!graph['g'+i]['mun']) || graph['g'+i]['mun'] == '') {
				    graph['g'+i] = {'mun':Tid};
					break;
					}
				}
			    obj.checkedMun++;

			} else {

			   for(i=1;i <= obj.maxMun;i++) {
	                   if(Tid == graph['g'+i]['mun']) {
					              graph['g'+i]['mun'] = '';

		             }
		        }
				obj.checkedMun--;
			}

            data.alwaysOn = !data.alwaysOn;
            $('#'+Tid).data('maphilight', data).trigger('alwaysOn.maphilight');

			if(obj.checkedMun == 0) {
			   defPop = {};
			   jQuery('#checkbox-1').attr('checked',true).checkboxradio('refresh');
		     loadCorpo();
		    }
			else renderData();
        });
       
       loadAssetCorpo();
 
  jQuery('#changeCorpo').css('top',(jQuery('.ui-page').height() -2) + 'px');
   jQuery('#changeCorpo').css('left',(jQuery('.ui-page').width() - 310) + 'px');
});   