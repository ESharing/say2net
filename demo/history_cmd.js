﻿//global var for history command
var suggestions = new Array();
var outp;
var oldins;
var posi = -1;
var words = new Array();
var HISTORY_input;
var HISTORY_key;

	function setVisible(visi){
		//var x = document.getElementById("shadow");
		var x = document.getElementById("output");
		var t = cmdInput;
		x.style.position = 'absolute';
		//x.style.top =  (findPosY(t)+3)+"px";
		//x.style.left = (findPosX(t)+2)+"px";
		x.style.top = "22px";
		x.style.left = "5px";		
		x.style.visibility = visi;
	}

	function HISTORY_init(){
		outp = document.getElementById("output");
		window.setInterval("lookAt()", 100);
		setVisible("hidden");
		//cmdInput.onkeydown = keygetter; //needed for Opera...
		cmdInput.onkeyup = keyHandler;
/*		
EventUtil.addHandler(cmdInput, "keyup", function(event) {
  event = EventUtil.getEvent(event);
  switch(event.keyCode) {
  case 13://enter
    processTopoCmdShell();
  }
});
*/		
	}

	function findPosX(obj)
	{
		var curleft = 0;
		if (obj.offsetParent){
			while (obj.offsetParent){
				curleft += obj.offsetLeft;
				obj = obj.offsetParent;
			}
		}
		else if (obj.x)
			curleft += obj.x;
		return curleft;
	}

	function findPosY(obj)
	{
		var curtop = 0;
		if (obj.offsetParent){
			curtop += obj.offsetHeight;
			while (obj.offsetParent){
				curtop += obj.offsetTop;
				obj = obj.offsetParent;
			}
		}
		else if (obj.y){
			curtop += obj.y;
			curtop += obj.height;
		}
		return curtop;
	}
	
	function lookAt(){
		var ins = cmdInput.value;
		if (oldins == ins) return;
		else if (posi > -1);
		else if (ins.length > 0){
			words = getWord(ins);
			if (words.length > 0){
				clearOutput();
				for (var i=0;i < words.length; ++i) addWord (words[i]);
				setVisible("visible");
				HISTORY_input = cmdInput.value;
			}
			else{
				setVisible("hidden");
				posi = -1;
			}
		}
		else{
			setVisible("hidden");
			posi = -1;
		}
		oldins = ins;
	}
	
	function addWord(word){
		var sp = document.createElement("div");
		sp.appendChild(document.createTextNode(word));
		sp.onmouseover = mouseHandler;
		sp.onmouseout = mouseHandlerOut;
		sp.onclick = mouseClick;
		outp.appendChild(sp);
	}
	
	function clearOutput(){
		while (outp.hasChildNodes()){
			noten=outp.firstChild;
			outp.removeChild(noten);
		}
		posi = -1;
	}
	
	function getWord(beginning){
		var words = new Array();
		for (var i=0;i < suggestions.length; ++i){
			var j = -1;
			var correct = 1;
			while (correct == 1 && ++j < beginning.length){
				if (suggestions[i].charAt(j) != beginning.charAt(j)) correct = 0;
			}
			if (correct == 1) words[words.length] = suggestions[i];
		}
		return words;
	}
	
	function setColor (_posi, _color, _forg){
		outp.childNodes[_posi].style.background = _color;
		outp.childNodes[_posi].style.color = _forg;
	}
	
	function keygetter(event){
		if (!event && window.event) event = window.event;
		if (event) HISTORY_key = event.keyCode;
		else HISTORY_key = event.which;
	}
		
	function keyHandler(event){
		keygetter(event);
	
		var textfield = cmdInput;
		//if (document.getElementById("shadow").style.visibility == "visible"){
		if (document.getElementById("output").style.visibility == "visible"){
		if (HISTORY_key == 40){ //Key down
			//alert (words);
			if (words.length > 0 && posi <  words.length-1){
				if (posi >=0) setColor(posi, "#fff", "black");
				else HISTORY_input = textfield.value;
				setColor(++posi, "blue", "white");
				textfield.value = outp.childNodes[posi].firstChild.nodeValue;
			}
		}
		else if (HISTORY_key == 38){ //Key up
			if (words.length > 0 && posi >= 0){
				if (posi >=1){
					setColor(posi, "#fff", "black");
					setColor(--posi, "blue", "white");
					textfield.value = outp.childNodes[posi].firstChild.nodeValue;
				}
				else{
					setColor(posi, "#fff", "black");
					textfield.value = HISTORY_input;
					textfield.focus();
					posi--;
				}
			}
		}
		else if (HISTORY_key == 27){ // Esc
			textfield.value = HISTORY_input;
			setVisible("hidden");
			posi = -1;
			oldins = HISTORY_input;
		}
		else if (HISTORY_key == 8){ // Backspace
			posi = -1;
			oldins=-1;
		}
		else if (HISTORY_key==13) {
			setVisible("hidden");		
		}
		}
		else { // wei: catch enter keyup, add the input word to suggestions
			if (HISTORY_key ==13) {
				var str = textfield.value;
				
				//remove head and tail space
				cmd = str.trim();
				strlen = cmd.length;				
				
				if ( strlen > 0 ) {  //not all space char, a valid command, and add to history					
					suggestions[suggestions.length] =  cmd;
					processCmdShell(cmd);
				}
				else { // show history
					clearOutput();
					len=suggestions.length;
					for (var i=0;i<len;i++) {
						words[i] = suggestions[i];
						addWord(words[i]);
					}
					if ( len > 0)
						setVisible("visible");
				}
				
			}
		}
	}
	
	var mouseHandler=function(){
		for (var i=0; i < words.length; ++i)
			setColor (i, "white", "black");
	
		this.style.background = "blue";
		this.style.color= "white";
	}
	
	var mouseHandlerOut=function(){
		this.style.background = "white";
		this.style.color= "black";
	}
	
	var mouseClick=function(){
		cmdInput.value = this.firstChild.nodeValue;
		setVisible("hidden");
		posi = -1;
		oldins = this.firstChild.nodeValue;
	}
	