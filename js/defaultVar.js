var locAssets = 'private/assets/';
var locData = 'IPAD/';
var name = 'Aff';  // Aff = affluenze  Com = composizione Scr = scrutinio
var tipo = 0; // 0 = regionali 1 = camera 2 = senato
var timer = 0; var statusTimer = false; // variabili PER GESTIONE TIMER 
var statusTimer = false;
var refresh = 60;
var statusGraph = false;
var statoAttuale;

function  cambiaTitolo(title){$('#titlePage').text(title);}

function writeLegend(leg, target,mm){
if (mm == 'r'){var left = (jQuery('#'+target).width() - 134);var top = '4';}
if (mm == 's'){var left = 42;var top = '4';}
if (mm == 'br'){var left = (jQuery('#'+target).width() - 134);var top = (jQuery('#'+target).height() - 30);} 
if (mm == 'bl'){var left = 20;var top = (jQuery('#'+target).height() - 30);} 
if (mm == 'bl2'){var left = 20;var top = (jQuery('#'+target).height() - 60);} 
if(mm == 'bl3') {var left = 200;var top = (jQuery('#'+target).height() + 60);
                  jQuery('#'+target).append('<div style="position:absolute;width:200px;background-color:white;opacity:0.7;padding:2px 2px 2px 2px;font-size:1em;font-weight:bold;line-height:1.5em;top:'+top+'px;left:'+left+'px;" id="'+target+'Legend"></div>');
                  for (var x in leg){jQuery('#'+target+'Legend').append('<span style="background-color:'+leg[x]['color']+'">&nbsp;&nbsp;&nbsp;&nbsp;</span> '+leg[x]['lbl']+'</br>');}
				  return;
                } 

jQuery('#'+target).append('<div style="position:absolute;width:120px;background-color:white;opacity:0.7;padding:2px 2px 2px 2px;font-size:0.7em;line-height:1.5em;top:'+top+'px;left:'+left+'px;" id="'+target+'Legend"></div>');
for (var x in leg){jQuery('#'+target+'Legend').append('<span style="background-color:'+leg[x]['color']+'">&nbsp;&nbsp;&nbsp;&nbsp;</span> '+leg[x]['lbl']+'</br>');}
}


function loadingCustom(status){
	if (status == 0){
		jQuery('.ui-loader').css('opacity','1');
		jQuery('.ui-loader').css('top','200px');
		jQuery('.ui-loader').show();
	}else{
		jQuery('.ui-loader').hide();
	}

}



function refreshPage(){
	var loc = window.location.href;
	loc = loc.replace('#','');
	window.location.href  = loc;
}

jQuery(window).bind('orientationchange',function(e){
   
	if(e.orientation){
      if(e.orientation == 'portrait') {
	      var html = '<div style="background-color:black;color:white;text-align:center;height:100px;"><div style="padding-top:40px;">Orientare lo schermo in orizzontale</div></div>';
          jQuery('.ui-page').html(html);return false;
      } else if(e.orientation == 'landscape'){
	       refreshPage();
	  }
    }

});

function erroreGenerico(error){
alert(error);


}



