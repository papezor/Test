
var elezioni = {
	menu: {
		init: function( ) {
		  	jQuery.getScript("js/menu.js", function(){
				    
					jQuery('#nav-panel').append('<div class="menu" style="background:#ff9900;" data-role="collapsible-set" data-inset="false" id="menu">');
					//aggiungo voci
					for (var x in objMenu){
					
						jQuery('#menu').append('<div class="menuItem" data-role="collapsible" data-role="collapsible" data-theme="a" data-content-theme="c" ' + 
											   'data-collapsed-icon="arrow-d" data-expanded-icon="minus" data-inset="false" id="menu'+objMenu[x]["titolo"]+'">' + 
											   ' <h3> '+objMenu[x]["titolo"]+'</h3> ' +
											   '<ul data-role="listview" id="submenu'+x+'" data-theme="c" data-content-theme="c" > ' +
											   '</ul>'+							  
											   '</div>');
									
							for (var m in objMenu[x]["voci"]){
								console.log(objMenu[x]["voci"][m]);
							   jQuery('#submenu'+x).append('<li><a class="menuItem sel" href="javascript:'+objMenu[x]["voci"][m]["funct"]+'">'+objMenu[x]["voci"][m]["titolo"]+'</a></li>');
							}	
						
						jQuery('#submenu'+x).listview();		
										
						}
					jQuery('div[data-role=collapsible]').collapsible();
					jQuery( "#menu" ).collapsibleset();		
					
					}).error(function() {
					alert('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
					});
		}
	},
	// PANNELLI
	panel: {
		bottom: {
			title: function(str){jQuery('#titleGraph').html(str);},
			create: function(obj){
				html = '';
				if (!document.getElementById("homeGraph")){jQuery(".ui-content").append('<div id="homeGraph" class="ui-corner-all ui-body-a" style="opacity: 0.9;width:'+(jQuery(document).width()-9)+'px;height:320px; bottom:-285px;position:absolute;left:3px; right:3px;z-index:100" data-theme="a" ></div>');};
				html +='<div class="ui-grid-a" style="width:100%;">';
				html +='<div class="ui-block-a" style="width:1%;min-width:30px;">';
				html += '<a href="javaScript:elezioni.ctrpanel.actionPanel(elezioni.panel.bottom);" data-icon="arrow-u" data-iconpos="notext" id="slideButton"></a>';
				html +='</div>'; // /block-a
				html +='<div class="ui-block-b" style="text-align:center;margin-left:180px;padding-top:2px;">';
				html += '<span id="titleGraph"></span>';
				html +='</div>'; // /block-b
				html +='</div>'; // /grid-a
				
				jQuery("#homeGraph").append(html);
				jQuery('#slideButton').button();	
				if (obj.numDiv == 2){ // doppio div interno al pannello sotto
					html ='<div class="ui-grid-a">';
					html +='<div class="ui-block-a" style="width:30%">';
					html +='<div id="bottom1" style="width:90%;height:280px"></div>';
					html +='</div>'; // /block-a
					html +='<div class="ui-block-b" style="width:67%">';
					html +='<div id="bottom2" style="width:100%;height:280px;"></div>';
					html +='</div>'; // /block-b
					html +='</div>'; // /grid
					jQuery(elezioni.panel.bottom.nomeDiv).append(html);
					
				}
				
			},
			nomeDiv: '#homeGraph',
			name: 'homeGraph',
			status: "close",
			close: function(){
				elezioni.ctrpanel.slidePanel(elezioni.panel.bottom.name, 'slideButton', 'b',-285,'arrow-u');
			},
			open: function(){
				elezioni.ctrpanel.slidePanel(elezioni.panel.bottom.name, 'slideButton', 'b',-4,'arrow-d');
			}
		},
		right:{
			title: function(str){jQuery('#titleRightPanel').html(str);},
			name: "dettPanel",
			create: function(obj){
				if (!document.getElementById(elezioni.panel.right.name)){jQuery(".ui-content").append('<div id="'+elezioni.panel.right.name+'" class="ui-corner-all ui-body-a" style="opacity: 0.9;width:300px;height:'+(jQuery('.ui-content').height() - 55) + 'px; top:5px;position:absolute;left:'+(jQuery('.ui-content').width() - 315)+'px; right:3px;z-index:100; padding:2px 2px 2px 2px;" data-theme="a" ></div>');}
				html = '<div style="position:absolute; top:0px; left:2px;"><a href="javaScript:elezioni.ctrpanel.actionPanel(elezioni.panel.right);" data-icon="arrow-r" data-iconpos="notext" id="slideright"></a></div>';
				jQuery("#"+elezioni.panel.right.name).append(html);	
				jQuery('#slideright').button();		
			
			
				html = '<div id="titleRightPanel" style="display:block; width:80%; text-align:center; font-size:0.8em; padding:2px 2px 2px 2px; font-weight:bold;">&nbsp;</div>';
				jQuery("#"+elezioni.panel.right.name).append(html);	
				
				if (obj.mappa){
					html = '<div style="width:100%;padding:2px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.7em;" id="mappa'+elezioni.panel.right.name+'"></div>';
					jQuery("#"+elezioni.panel.right.name).append(html);
				}
				if (obj.filter){
					elezioni.maps.filter.add(elezioni.panel.right.name);
					
				}
		
				if (obj.voti) {
				   elezioni.voti.filter.add(elezioni.panel.right.name);
				}
				
				
				
			},
			status: "open",
			close: function(){
				elezioni.ctrpanel.slidePanel(elezioni.panel.right.name, 'slideright', 'l',(jQuery('.ui-content').width() - 35),'arrow-l');
			},
			open: function(){
				elezioni.ctrpanel.slidePanel(elezioni.panel.right.name, 'slideright', 'l',(jQuery('.ui-content').width() - 315),'arrow-r');
			}
		}
	},
	// CONTROLLI PANNELLI
	ctrpanel: {
		// chiudi tutti i pannelli
		closeAllPanel: function(str){
		
			// chiudo il pannello del menu
			jQuery('#nav-panel').panel('close');
			
			// CHIUDO TUTTI GLI ALTRI PANNELLI 
			for (var x in elezioni.panel){
				if (elezioni.panel[x].status == 'open'){
					elezioni.panel[x].close();
					elezioni.panel[x].status = 'close';
				}
			}
			
			// se è un oggetto apro con le mie funzioni altrimenti apro con i panel di jquery mobile
			if (str.status){
				str.open();
			}else{
				jQuery('#'+str).panel('open');
			}
		
		},
		// CLICK BOTTONE PANNELLO 
		actionPanel: function(obj){
			
			if (obj.status == 'open'){
				obj.close(); obj.status = 'close';
			}else{
				elezioni.ctrpanel.closeAllPanel(obj);
				obj.status = 'open';
			}
		
		},
		// CONTROLLI SLIDE
		slidePanel: function(target, button, where, px, ico){
			if (jQuery('#'+target)){
		    	if (where == 'l'){jQuery('#'+target).fadeIn(1000).animate({'left':px}, "fast");}
				if (where == 'b'){jQuery('#'+target).fadeIn(1000).animate({'bottom':px}, "fast");}
				jQuery('#'+button).buttonMarkup({icon:ico});
				jQuery('#'+button).button();
			}
		}	
	},
	maps:{
		lvlzoom: 14,
		center: function(){return new google.maps.LatLng(41.890105,12.480821);},
		// CREO MAPPA DEFAULT 
		mapOptions: {
				zoom: 11,
				center: new google.maps.LatLng(41.890105,12.480821),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoomControl:true,
				navigationControl: false,
				mapTypeControl: false,
				scaleControl: false,
				disableDoubleClickZoom: true,
				streetViewControl: false,
				minZoom: 10,
				maxZoom: 18
		},
		create: function() {
			jQuery('.ui-content').append('<div id="map_canvas" style="width:100%; height:'+(jQuery(document).height())+'px;"></div>');
			
			
			map = new google.maps.Map(document.getElementById("map_canvas"),
				elezioni.maps.mapOptions);


			// bug jquery mobile sul render della mappa. Rirenderizzo la mappa mezzo secondo dopo il caricamento.
			setTimeout(function() {
				google.maps.event.trigger(map,'resize');
				map.setCenter(elezioni.maps.center());
				}, 1500);
				
			
/*	

			// CREO LISTNER SULL ZOOM
			google.maps.event.addListener(map,'zoom_changed', function() {
				elezioni.maps.control.refreshMarker();
			});
			 // CREO LISTNER SUL DRAG END
			google.maps.event.addListener(map,'dragend',function(){
				elezioni.maps.control.refreshMarker();:
			});
			// GESTIONE SWIPE
			google.maps.event.addListener(map,'idle',function(){
				if (!(infoWindow.getMap()!=null)){
					elezioni.maps.control.refreshMarker();
				}
			});

			if (name == 'Aff'){
			   loadStato();	
			}else{ // CARICO DATI //
			   loadData();
			}	

		*/
			
				
			
		}, // !CREA MAPPA
		filter:{
			add:function(target){
					html = '<div style="width:100%;padding:2px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.6em;">Filtri Mappa</div>';
					jQuery("#"+elezioni.panel.right.name).append(html);
					
			
					html = '<div style="width:100%;padding:2px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.7em;" id="filter'+elezioni.panel.right.name+'"></div>';
					jQuery("#"+elezioni.panel.right.name).append(html);
					
					html = '<label style="font-size:0.7em;" >Sezioni visualizzate:</label>' + 
							'<fieldset data-role="controlgroup" style="margin: -1px;" data-type="horizontal" data-theme="b" id="filtroSezioni" data-mini="true">' + 
							'<a href="javaScript:elezioni.maps.filter.changeSez('+"'fp'"+');" data-theme="a" data-mini="true" data-role="button" id="fp">Perv </a>' +
							'<a href="javaScript:elezioni.maps.filter.changeSez('+"'fnp'"+');" data-theme="a" data-mini="true" data-role="button" id="fnp">Non Perv </a>' +
							'<a href="javaScript:elezioni.maps.filter.changeSez('+"'ft'"+');" data-theme="c" data-mini="true" data-role="button" id="ft">Tutte </a>' +
							'</fieldset>';
					jQuery("#filter"+elezioni.panel.right.name).append(html);		
						
					
					
					html = '<div data-role="fieldcontain" data-mini="true" data-theme="c">' + 
							'<label style="font-size:0.7em;" >Livello Dettaglio:</label>' + 
							'<input type="range" name="dettZoom" id="dettZoom" value="'+elezioni.maps.lvlzoom+'" min="10" max="18" data-mini="true" data-theme="a"  data-highlight="true" />' +
							'</div>';
					jQuery("#filter"+elezioni.panel.right.name).append(html);		
						
				
			
					jQuery("#filter"+elezioni.panel.right.name).page();	
			},
			changeSez:function(str){
		
				jQuery('#fp').buttonMarkup({theme: 'a'});
				jQuery('#fnp').buttonMarkup({theme: 'a'});
				jQuery('#ft').buttonMarkup({theme: 'a'});
				$('#'+str).buttonMarkup({theme: 'c'});
			}
			
		
		},
		//CONTROLLI MAPPA
		control:{
			// AGGIORNO MARKER
			refreshMarker: function(){
				// POSIZIONI MARKER MUNICIPI
				for (var key in munMap) {

					var mun = munMap[key]["MUNICIPIO"];
					var coord = munMap[key]["COORDINATE"];


					var src = "images/mun" + mun + ".png";
					if (mun.length > 3){src = "images/elett.png";}
					var position = new google.maps.LatLng(coord[1],coord[0]);
					var marker = elezioni.maps.control.addMarker(src,position);

					//AGGIUNGO EVENTO SU CLICK MARKER MUNICIPIO
					google.maps.event.addListener(marker, 'click', (function(position) {
						return function() {
							  map.setCenter(position);
							  map.setZoom(elezioni.maps.lvlzoom);
						}
					})(position));

				}
				
				if (map.getZoom() >= elezioni.maps.lvlzoom){ // AGGIUNGO MARKER SEZIONI 
				
				
				}
			
			
			
			},
			// MARKER SEZ 
			addMarker: function(src,position){
				var marker=new google.maps.Marker({
									position:position,
									icon:new google.maps.MarkerImage(src, null, null, null, new google.maps.Size(29, 29))

							});
					//markerMun[position.lat() + '' + position.lng()] = marker;
					marker.setMap(map);
					return marker;
			
			}
			
			
		
		
		}
	
	},
	data:{
		// CARICAMENTO DATI //
		init: function(){
		 return false;
		}
			
	
	},
	page:{
		refresh: function(){
			var loc = window.location.href;
			loc = loc.replace('#','');
			window.location.href  = loc;
		}
	},
	graph: {
	 
	   createPie: function(fields,data,renderDiv,donut,colorSet) {
	   
		 var store = Ext.create('Ext.data.JsonStore', {
			  fields: fields,
			  data: data
		   });

			var pippo = Ext.create('Ext.chart.Chart', {
				renderTo: renderDiv, 
				xtype: 'chart',
				width: jQuery('#'+renderDiv).width(),
				height: 280,
				animate: true,
				store: store,
				
				insetPadding: 60,
				theme: 'Base:gradients',
				legend: {
                   position: 'right',
				   field: 'name'
                },			
				series: [{
					type: 'pie',
					field: 'data',
					dataField: 'data',
					categoryField: 'name',
					showInLegend: true,
					donut: donut,
					colorSet: colorSet,
					tips: {
						trackMouse: true,
						width: 140,
						height: 28,
						renderer: function(storeItem, item) {
							// calculate and display percentage on hover
							var total = 0;
							store.each(function(rec) {
								total += rec.get('data');
							});
							this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data') / total * 100) + '%');
						}
					},
					highlight: {
						segment: {
							margin: 20
						}
					},
					label: {
						field: 'data', 
						display: 'rotate',
						contrast: true,
						font: '18px Arial',
						renderer: function(str) {
							return roundNumber((str / 2600 * 100 ),2)+'%';
						}
					}
				}]
			});
			elezioni.graph.activeGraph.push(pippo);
			return pippo;
	   }, 
	  activeGraph:[],
	  createBar: function(fields,data,renderDiv,colorSerie,legendPosition) {
	  
	      var store = Ext.create('Ext.data.JsonStore', {
			  fields: fields,
			  data: data
		   });
		  
	      var chart = Ext.create('Ext.chart.Chart', {
		    width: (jQuery('#'+renderDiv).width() - 40),
            height: 280,
		    renderTo: renderDiv,
		    xtype: 'chart',
            animate: true,
            shadow: true,
            store: store,
            legend: {
                position: legendPosition
            },
            axes: [{
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: false,
                grid: false,
				label: {
				   font: '15px Helvetica, sans-serif',
				   rotate: {degrees: -30},
				   contrast: true,
				   color: '#006AB8'
				}
              }, {
                type: 'Numeric',
                position: 'left',
                fields: ['pervenute'],
                title: false,
				minimum: 0,
				maximum: 100
            }],
            series: [{
                type: 'column',
                gutter: 80,
				column: 'true',
				getLegendColor: function(index) {
					var me = this,
						colorLength = 0;

					me.colorArrayStyle = [colorSerie];
					colorLength = me.colorArrayStyle.length;
					if (me.style && me.style.fill) {
						return me.style.fill;
					} else {
						return me.colorArrayStyle[index % colorLength];
					}
               },
				axis: 'left',
                xField: 'name',
                yField: ['pervenute'],
				renderer: function(sprite, record, attr, index, store) {
					return Ext.apply(attr, {
						fill: colorSerie
					});
				}
            }
			]
        });
	    elezioni.graph.activeGraph.push(chart);
		return chart;
		
	  },
      redrawGraph: function(data,chart,target,fields,donut,colorSet) {
	    if(!chart) chart = elezioni.graph.createPie(fields,data,target,donut,colorSet);
	       Ext.getCmp(chart.getId()).store.loadData(data);
		   Ext.getCmp(chart.getId()).refresh();
		   Ext.getCmp(chart.getId()).redraw();
	  }
	},
	voti: {
	   filter: {
	      add:function(target){
					html = '<div style="width:100%;padding:2px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.6em;">Filtri Voti</div>';
					jQuery("#"+elezioni.panel.right.name).append(html);
					
			
					html = '<div style="width:100%;padding:2px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.7em;" id="filter'+elezioni.panel.right.name+'"></div>';
					jQuery("#"+elezioni.panel.right.name).append(html);
					
					html = '<label style="font-size:0.7em;" >Voti visualizzati:</label>' + 
							'<fieldset data-role="controlgroup" style="margin: -1px;" data-type="horizontal" data-theme="b" id="filtroTipoEle" data-mini="true">' + 
							'<a href="javaScript:elezioni.voti.filter.changeTipoEle('+"'com'"+');" data-theme="a" data-mini="true" data-role="button" id="com">Comunali </a>' +
							'<a href="javaScript:elezioni.voti.filter.changeTipoEle('+"'mun'"+');" data-theme="a" data-mini="true" data-role="button" id="mun">Municipali </a>' +
							'</fieldset>';
							
					jQuery("#filter"+elezioni.panel.right.name).append(html);		
			
					jQuery("#filter"+elezioni.panel.right.name).page();	
			},
          changeTipoEle:function(str){
		         
				if (document.getElementById("filterVoti"+elezioni.panel.right.name)) jQuery("#filterVoti"+elezioni.panel.right.name).remove();

				jQuery('#com').buttonMarkup({theme: 'a'});
				jQuery('#mun').buttonMarkup({theme: 'a'});
				jQuery('#pref').buttonMarkup({theme: 'a'});
				jQuery('#'+str).buttonMarkup({theme: 'c'});
				
				html = '<div style="width:100%;padding:30px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.7em;" id="filterVoti'+elezioni.panel.right.name+'"></div>';
				 
				jQuery("#filter"+elezioni.panel.right.name).append(html);
				
				if(str == 'com') {
				   html = '<fieldset data-role="controlgroup" style="margin: -1px;" data-type="horizontal" data-theme="b" id="filtro" data-mini="true">' + 
							'<a href="javaScript:elezioni.voti.filter.createGraph('+"'sindaco'"+');" data-theme="a" data-mini="true" data-role="button" id="sindaco">sindaco</a>' +
							'<a href="javaScript:elezioni.voti.filter.createGraph('+"'listacomunali'"+');" data-theme="a" data-mini="true" data-role="button" id="listacomunali">Liste </a>' +
							'</fieldset>' +
							'<div style="width:100%;padding:30px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.7em;" id="filterPreferenze"><fieldset data-role="controlgroup" style="margin: -1px;" data-type="horizontal" data-theme="b" id="filtro" data-mini="true">' +
							'<a href="javaScript:elezioni.voti.initPreferenze('+"'Com'"+');" data-theme="a" data-mini="true" data-role="button" id="pref">preferenze</a>' +
						    '</fieldset></div>';
				} else {
				    html = '<fieldset data-role="controlgroup" style="margin: -1px;" data-type="horizontal" data-theme="b" id="filtro" data-mini="true">' + 
							'<a href="javaScript:elezioni.voti.filter.createGraph('+"'presidente'"+');" data-theme="a" data-mini="true" data-role="button" id="presidente">presidente</a>' +
							'<a href="javaScript:elezioni.voti.filter.createGraph('+"'listamunicipali'"+');" data-theme="a" data-mini="true" data-role="button" id="listamunicipali">Liste </a>' +
							'</fieldset>' +
							'<div style="width:100%;padding:30px 2px 2px 2px;color:white;display:block;position:relative;font-size:0.7em;" id="filterPreferenze"><fieldset data-role="controlgroup" style="margin: -1px;" data-type="horizontal" data-theme="b" id="filtro" data-mini="true">' +
							'<a href="javaScript:elezioni.voti.initPreferenze('+"'Mun'"+');" data-theme="a" data-mini="true" data-role="button" id="pref">preferenze</a>' +
						    '</fieldset></div>';
				}
		
			    jQuery("#filterVoti"+elezioni.panel.right.name).append(html);
				jQuery("#filterVoti"+elezioni.panel.right.name).page();	
		},
        createGraph: function(str) {
		           if(page == 'Com' || page == 'Mun') elezioni.voti.initGraph();
		
		           jQuery('#sindaco').buttonMarkup({theme: 'a'});
				   jQuery('#listacomunali').buttonMarkup({theme: 'a'});
				   jQuery('#presidente').buttonMarkup({theme: 'a'});
				   jQuery('#listamunicipali').buttonMarkup({theme: 'a'});
				   jQuery('#pref').buttonMarkup({theme: 'a'});
				   jQuery('#'+str).buttonMarkup({theme: 'c'});
				   jQuery('#graphConfronti').empty();
				   var testo = '';
				   if(str == 'sindaco' || str == 'presidente') testo = 'Selezionare un candidato';
				   else testo = 'Selezionare una lista';
				   var html = '<div align="center" style="padding-top:30px;"><font color="white" size="7">'+ testo +'</font></div>';
				   jQuery('#graphConfronti').append(html);
	         
                    loadData(str);		 
        }		
	   
	   },
	   initGraph: function() {
	      jQuery('#renderPage').empty();
	      
	      html = '<div class="ui-grid-a" data-theme="c" >' + 
		          '<div class="ui-block-a" style="width:65%">' +
					'<div id="graphRisultati" class="contentFiltro" style="height:300px;"></div>' +
					'<div id="graphConfronti" class="contentFiltro" style="height:300px;overflow:hidden;"><div align="center" style="padding-top:30px;"><font color="white" size="7">Selezionare un candidato</font></div></div>' +
           			'<fieldset data-role="controlgroup" class="ui-scrolllistview"  data-type="horizontal"></fieldset></div>' +
                     '<div  class="ui-block-b" style="width:35%"><div id="pannelloDex" class="contentFiltro" style="height:637px;"><div id="pieRisultati">'	+
					'</div></div></div></div>';
				  jQuery('#renderPage').append(html);
				  
				  $('#graphRisultati').bind('jqplotDataClick', function(ev,seriesIndex,pointIndex,data) {
				 var candidato = graphRisultati.axes.xaxis.ticks[pointIndex];
				 var color = '';
				 for(var x in PieVoti.series[seriesIndex].data) {
					if(PieVoti.series[seriesIndex].data[x][0] == candidato) 
						color = PieVoti.series[seriesIndex].seriesColors[x];
				 }
				 renderGraphConfronti(graphRisultati.axes.xaxis.ticks[pointIndex],color,candidato);
				  
			  });  
			  
			  $('#pieRisultati').bind('jqplotDataClick', function(ev,seriesIndex,pointIndex,data) {
				if(data[0]!='Altri') renderGraphConfronti(data[0],PieVoti.series[seriesIndex].seriesColors[pointIndex]);	  
			  });  
	    },
		initPreferenze: function(str) {
		    jQuery('#sindaco').buttonMarkup({theme: 'a'});
	        jQuery('#listacomunali').buttonMarkup({theme: 'a'});
		    jQuery('#presidente').buttonMarkup({theme: 'a'});
		    jQuery('#listamunicipali').buttonMarkup({theme: 'a'});
		    jQuery('#pref').buttonMarkup({theme: 'c'});
		     
		    jQuery('#renderPage').empty();
			
			html = '<div class="renderTable" id="renderTable"><div class="ui-grid-solo" data-theme="c"><div class="ui-block-a"></div></div>' +
                    '<div class="ui-grid-a" data-theme="c">' +
                    '<div class="ui-block-a" id="blockFiltri" style="width:50%;">' +
                    '<div id="pannelloFiltri" class="contentFiltro" data-role="fieldcontain" data-placeholder="true">' +
                    '<div id="tableMun" class="tableMun" data-role=""></div></div></div>' +
                    '<div id="risultati" class="ui-block-b" style="width:30%;">' +
                    '<div id="pannelloCandidati" class="contentFiltro" data-role="fieldcontain" data-placeholder="true" style="display: none; padding-left: 20px">' +
                    '<div id="tableCand" class="tableMun" data-role=""></div></div></div></div></div>';
			jQuery('#renderPage').append(html);
		    jQuery(".ui-page").append('<div id="listaCandidati" class="ui-corner-all ui-body-b" style="width:300px;  background-color:#F9F9F9;   border: 1px solid #1A6AA1; height:'+(jQuery(document).height()-80)+'px;overflow:auto; position:absolute; top:42px; left:'+(jQuery(document).width())+'px; margin-left:13px; margin-top:26px;"  ></div>');
	        jQuery.getScript(locData + "Preferenze" + str + ".js", function(){caricaPartiti(str);}).error(function() {
		         erroreGenerico('ERRORE DI CONNESSIONE\nRICARICARE LA PAGINA CON IL PULSANTE IN ALTO A DESTRA');
	});
      	 }
	     
	   }
	
};


/*

function writeLegend(leg, target,mm){
if (mm == 'r'){var left = (jQuery('#'+target).width() - 134);var top = '4';}
if (mm == 's'){var left = 42;var top = '4';}
if (mm == 'br'){var left = (jQuery('#'+target).width() - 134);var top = (jQuery('#'+target).height() - 30);} 
if (mm == 'bl'){var left = 20;var top = (jQuery('#'+target).height() - 30);} 
if (mm == 'bl2'){var left = 20;var top = (jQuery('#'+target).height() - 60);} 

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
*/