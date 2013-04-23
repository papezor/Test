  var candidati=[];
  
  
  $(document).ready(function(){ 
   jQuery(".ui-page").append('<div id="listaCandidati" class="ui-corner-all ui-body-b" style="width:300px;  background-color:#F9F9F9;   border: 1px solid #1A6AA1; height:'+(jQuery(document).height()-80)+'px;overflow:auto; position:absolute; top:42px; left:'+(jQuery(document).width())+'px; margin-left:13px; margin-top:26px;"  ></div>');
    
	jQuery.getScript("js/elezioni.js", function(){
         elezioni.menu.init();    
	});
	   
	caricaPartiti(0);
  });
  
 function caricaPartiti(tipo){
    var lista;
     jQuery('#pannelloCandidati').css("display", 'none');
	//jQuery('#listaCandidati').fadeIn(1000).animate({"left":(jQuery(document).width()+50)}, "fast"); 
    if (tipo == 'com'){/* COMUNALI */ lista = listaReg;}
    if (tipo == 'mun'){/* MUNICIPALI */ lista = listaSen;}
       
     var html ='<ul id="listViewCandidati" data-role="listview" style="padding-top:5px;margin-left:3px;margin-top:3px;width:99%;" >';
      for(var x in lista)
      {
        var idPartito = x;
        var nome=lista[x]['nome'];
        var logo=lista[x]['logo'];
        var func = '';
        if (lista[x]['lista']){
            func = "javaScript:apriLista("+x+",'"+nome+"');";
            if (!candidati[x]){candidati[x] = [];}
            candidati[x].push(lista[x]['lista']);
        }
        html += '<li><a href="'+func+'">';
        
        if(parseInt(x) >= '9') 
         html += '<img alt="" src="simboli/r'+(parseInt(x)+1)+'.gif"  />';
        else
         html += '<img alt="" src="simboli/r0'+(parseInt(x)+1)+'.gif" />';
        
        html += '<h3>'+nome+'</h3></a></li>';
      
      }
      
      html+='</ul>';
  
      jQuery('#tableMun').html(html);
      jQuery('#listViewCandidati').listview();
      jQuery('#pannelloFiltri').css("height", (jQuery('.ui-page').height() - 50) + 'px');
      jQuery('#tableMun').css("height", (jQuery('.ui-page').height() - 50) + 'px');
 
 }
  
     
    
function apriLista(id,nomePartito)
{
	 
    $('#tableSez').html('');

    html = '<ul  data-role="listview" style="line-height:20px; padding-top:5px;margin-left:3px;margin-top:3px;width:99%; " id="candList">';
    
    html = '<h3><font color="red" style="margin-left:6px;">'+nomePartito+'</font></h3>';
    
    
    
    for(var x in candidati[id][0]){ 
     
     html+= '<p> <font color="yellow">'+candidati[id][0][x]["posizione"]+' - '+candidati[id][0][x]["nome"] +'</font></p>';
     }
     
     html += '</ul>';
	 
	 jQuery('#tableCand').html(html);
	 jQuery('#candList').listview();
     jQuery('#pannelloCandidati').css("height", (jQuery('.ui-page').height() - 50) + 'px');
     jQuery('#tableCand').css("height", (jQuery('.ui-page').height() - 50) + 'px');
     jQuery('#pannelloCandidati').css("display", 'block');
     
}
    
// CLICCO SU VOCI MENU 
function loadMenu(dest,type){
// dest  Aff = affluenze  Com = composizione Scr = scrutinio
// type  0 = regionali 1 = camera 2 = senato
   var dest = 'index.html?n='+dest+'&t='+type;
   name = dest;
   tipo = type;
   window.location.href = dest;
   
}


// INIZIO JS PER TABELLE //
function loadTable(dest,type){
// dest  Aff = affluenze  Com = composizione Scr = scrutinio
// type  0 = regionali 1 = camera 2 = senato
   var dest = 'index.html?n='+dest+'&t='+type;
   name = dest;
   tipo = type;
   window.location.href = dest;
}

function loadPage(page){
	window.location.href = page;
}
function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
function closeAllPanel(str){jQuery('#'+str).panel('open');}        
       