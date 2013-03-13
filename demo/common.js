
function parseXml(xml){
var xmldom = null;
if (typeof DOMParser != "undefined"){
xmldom = (new DOMParser()).parseFromString(xml, "text/xml");
var errors = xmldom.getElementsByTagName("parsererror");
if (errors.length){
throw new Error("XML parsing error:" + errors[0].textContent);
}
} else if (document.implementation.hasFeature("LS", "3.0")){
var implementation = document.implementation;
var parser = implementation.createLSParser(implementation.MODE_SYNCHRONOUS,
null);
var input = implementation.createLSInput();
input.stringData = xml;
xmldom = parser.parse(input);
} else if (typeof ActiveXObject != "undefined"){
xmldom = createDocument();
xmldom.loadXML(xml);
if (xmldom.parseError != 0){
throw new Error("XML parsing error: " + xmldom.parseError.reason);
}
} else {
throw new Error("No XML parser available.");
}
return xmldom;
}

var EventUtil = {
addHandler: function(element, type, handler){
if (element.addEventListener){
element.addEventListener(type, handler, false);
} else if (element.attachEvent){
element.attachEvent("on" + type, handler);
} else {
element["on" + type] = handler;
}
},

getEvent: function(event){
return event ? event : window.event;
},
getTarget: function(event){
return event.target || event.srcElement;
},
preventDefault: function(event){
if (event.preventDefault){
event.preventDefault();
} else {
event.returnValue = false;
}
},

removeHandler: function(element, type, handler){
if (element.removeEventListener){
element.removeEventListener(type, handler, false);
} else if (element.detachEvent){
element.detachEvent("on" + type, handler);
} else {
element["on" + type] = null;
}
},

stopPropagation: function(event){
if (event.stopPropagation){
event.stopPropagation();
} else {
event.cancelBubble = true;
}
}
};

function DisplayError(msg) {
	alert(msg);
}

function validateCheck(cmdItems) {
  return true;
}

var cmdInput;
function init() {
cmdInput = document.getElementById("cmdInput");
HISTORY_init();

var funSelects = document.getElementsByName("link");
for ( var count=funSelects.length, i=0; i<count; i++ ) {
EventUtil.addHandler(funSelects[i], "click", function(event) {
	this.href += "?" + document.getElementById("currentInfo").value;
});
}
}

function processCmdShell(cmd) {
	var urlSplits = location.pathname.split("/"); 
	var filename = urlSplits[urlSplits.length-1];
	if ( filename == "topo.html" ) {
		processTopoCmd(canvas, cmd);
	}
	if ( filename == "config.html" ) {
		processConfigCmd(cmd);
	}
	if ( filename == "service.html" ) {
		processServiceCmd(cmd);
	}
	if ( filename == "alarm.html" ) {
		processAlarmCmd(cmd);
	}	
	if ( filename == "performance.html" ) {
		processPerformanceCmd(cmd);
	}
	if ( filename == "inventory.html" ) {
		processResourceCmd(cmd);
	}		
}







