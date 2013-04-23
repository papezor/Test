    
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


function loadPage(page,n,t){jQuery('#nav-panel').panel('close');window.location.href = page + '?n='+n+'&t='+t;}
