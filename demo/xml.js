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

var pageWidth = window.innerWidth,
pageHeight = window.innerHeight;
if (typeof pageWidth != “number”){
if (document.compatMode == “CSS1Compat”){
pageWidth = document.documentElement.clientWidth;
pageHeight = document.documentElement.clientHeight;
} else {
pageWidth = document.body.clientWidth;
pageHeight = document.body.clientHeight;
}
}