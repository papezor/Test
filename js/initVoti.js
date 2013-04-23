var page = 'sindaco';
var graphRisultati;
var PieVoti;
var graphConfronti = '';
var colorVotiSindaco = 'lightblue';
var colorVotiLista = 'lightblue';
//var cMun = ['green','violet'];

var cPie = ['lightgrey','green','red','yellow','violet','orange'];
var candidati=[];

jQuery(document).ready(function(){ 

   jQuery.getScript("js/elezioni.js", function(){
         elezioni.voti.initGraph();
         elezioni.menu.init();    
		 elezioni.panel.right.create({filter:false,mappa:false,voti:true}); 	
	});  
	  	
    loadData(page);	

	
});