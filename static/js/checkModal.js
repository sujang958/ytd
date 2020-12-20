const agt = navigator.userAgent.toLowerCase(); 
if (agt.indexOf("chrome") != -1) {
    
} else {
    $("#browser").modal({
        escapeClose: true,
        clickClose: true,
        showClose: true
    });
}