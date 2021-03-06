var TerminalSize = 15;
var NodeSize = 20;
var ConnectorSize=8;
var LABEL_ON=new Boolean(true);
var LabelObjects = {};
var NEObjects = {}; // label map to node, hold total node 
var LinkObjs = {};
var NodeNum = 0; // topo node count
var NEs;
var BW_BACKBONE=5;BW_TRUNK=3;BW_ACCESS=2;FIBER_BW=3;
var FIBER_COLOR="gray",PW_COLOR="green",LSP_COLOR="blue";
var ACTIVE_COLOR="green",STANDBY_COLOR="yellow";
var LinkNames = new Array();
var LinkNum = 0;

//drag & drop fun: start, move, up
var start = function () {
    // storing original coordinates
	// consider selected nodes to move multiple nodes
	// use the key saved in node attr content, and use it as map key to get the label
	
	switch (this.type) {
	case "circle":
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
		break;
	case "rect":
		this.ox = this.attr("x");
		this.oy = this.attr("y");
		break;
	default:
		;
	}	
	
//    this.attr({opacity: 1});
	
},
move = function (dx, dy) {
    // move will be called with dx and dy
	var x = this.ox + dx;
	var y = this.oy + dy;	
	switch (this.type) {
	case "circle":
		this.attr({cx: x, cy: y});
		break;
	case "rect":
		this.attr({x: x, y: y});
		break;		
	default:
		;
	}

	//mode label
	var labelText = LabelObjects[this.content];
	if ( LABEL_ON ) {
		labelText.attr({x: this.ox + dx +NodeSize/2-LabelXOff , y: this.oy + dy + LabelYOff });	
	}	
	
	// move path, use path attr
	var node = NEObjects[this.content];
	node.Topox = x;
	node.Topoy = y;	
	
    var oldpeerend;
    if ( node.links.length > 0 ) {
        var linknode1 = node.links[0];
		if(linknode1.end1.Label == this.content ) {
            oldpeerend = linknode1.end2;
		}	else {
            oldpeerend = linknode1.end1;
		}
    }


    var ii=0;
	for ( var i=0, len = node.links.length; i<len; i++) {
		var link = node.links[i];
		
		var x2,y2,peerend;
		if(link.end1.Label == this.content ) {
            peerend = link.end2;
			x2 = link.end2.Topox + NodeSize/2;
			y2 = link.end2.Topoy + NodeSize/2;
		}	else {
            peerend = link.end1;
			x2 = link.end1.Topox + NodeSize/2;
			y2 = link.end1.Topoy + NodeSize/2;	
		}
		
		var x1 = x + NodeSize/2;
		var y1 = y + NodeSize/2;
        
        if ( peerend != oldpeerend ) {
            ii = 1;
            oldpeerend = peerend;
        }
        else
            ii++;

		var str = getPathStr(x1,y1,x2,y2,ii,ii);
		link.path.attr("path",str);
	}
},
up = function () {
    // restoring state
//    this.attr({opacity: .5});
	// save the xy to the node object
//	var node = NEObjects[this.content];
/*	
	switch (this.type) {
	case "circle":
		node.Topox = this.cx;
		node.Topoy = this.cy;
		break;
	case "rect":
		node.Topox = this.x;
		node.Topoy = this.y;		
		break;		
	default:
		;
	}
*/

	
};

function getPathStr(x1,y1,x2,y2,curDegree1,curDegree2) {

		var A = x2 - x1;
		var B = y2 - y1;
		var C = Math.sqrt(A*A + B*B)*4;
		
		//changex1 / B = NodeSize/2 / C;
        flag = curDegree1 % 2 ==1 ? 1 : -1;
		var changex1 = Math.round( NodeSize*curDegree1 /C * B ) * flag ;
		var changey1 = Math.round( NodeSize*curDegree1 /C * A) * flag;
		var changex2 = Math.round( NodeSize*curDegree2 /C * B) * flag;
		var changey2 = Math.round( NodeSize*curDegree2 /C * A) * flag;
		
		changex1 = x1 + changex1;
		changey1 = y1 - changey1;
		changex2 = x2 + changex2;
		changey2 = y2 - changey2;
		var str =   "M"+ x1 + " " + y1 + 
						"C"+ changex1 + " " + changey1 + " " +
						changex2 + " " + changey2 + " " +
						x2 + " " + y2;
		//alert(str);
		return str;
}

function addNodeToCanvas(canvas,type,x,y,label) {
var node;
switch (type) {
  case "node":
    node = canvas.rect(x, y, NodeSize,NodeSize).attr({fill: "white", opacity:1, cursor: "move"});

	LabelXOff = label.length * 2 / 2;
	LabelYOff = NodeSize + 6;
	text = canvas.text(x+NodeSize/2-LabelXOff, y+LabelYOff,label);

	node.content = label;
	LabelObjects[label]=text;

	node.drag(move,start,up);	

    node.node.ondblclick = function () {window.open("olttable.html",label + "Device Config"); };

	return node;
	break;
  case "terminal":
    return canvas.circle(x, y, TerminalSize);
	break;
  case "connector":
    return canvas.circle(x, y, ConnectorSize);
	break;	
  default:
	return null;
	}
}

function addTopoNodes(canvas, NEs, start, end) {
for(var i=start; i<end;i++) {
  label = NEs[i].Label;
  NEs[i].raphael = addNodeToCanvas(canvas, NEs[i].NodeType,NEs[i].Topox,NEs[i].Topoy,label);
  
  var links = new Array();
  NEs[i].links = links;
  
  NEObjects[label]=NEs[i];
  
  saveNodeToServer(NEs[i]);

}

return NEs;
}

function createLink(linkLabel, node1, node2,bw,color) {
	//check node1, node2 existance
	if(!bw) bw=FIBER_BW;
	if(!color) color=FIBER_COLOR;
	var nodeA = NEObjects[node1];
	var nodeB = NEObjects[node2];
	if ( nodeA == undefined ) { 
		DisplayError("No such node " + node1);
		return;
	} ;
	if ( nodeB == undefined ) { 
		DisplayError("No such node " + node2);
		return;
	} ;	
	
	//var alinknum = nodeA.links.length;
	//var blinknum = nodeB.links.length;

    var alinknum=0, blinknum=0;
    for (var i=nodeA.links.length; i>0; i--)
    if ( nodeA.links[i-1].end2 == nodeB || nodeA.links[i-1].end1 == nodeB ) {
            alinknum++;
            blinknum++;
    }
	
	var x1 = nodeA.Topox + NodeSize/2;
	var y1 = nodeA.Topoy + NodeSize/2;
	var x2 = nodeB.Topox + NodeSize/2;
	var y2 = nodeB.Topoy + NodeSize/2;	
	var str = getPathStr(x1,y1,x2,y2, alinknum+1, blinknum+1);
	
	var path = canvas.path(str);
	path.attr({stroke:color,"stroke-width":bw});
	path.toBack();
	
	var linkObj = new Object();
	linkObj.name = linkLabel;
	linkObj.end1 = nodeA;
	linkObj.end2 = nodeB;
	linkObj.path = path;
	
	LinkObjs[linkLabel] = linkObj;
	LinkNames[LinkNum++] = linkLabel;
	
	var alinknum = nodeA.links.length;
	var blinknum = nodeB.links.length;

	nodeA.links[alinknum] = linkObj;
	nodeB.links[blinknum] = linkObj;


}



function loadobjs(canvas, loaded_objs) {
NEs = JSON.parse(loaded_objs);
if (NEs == null )  return null;
NodeNum = NEs.length;
return addTopoNodes(canvas, NEs, 0, NodeNum);
}

function saveNodeToServer(node) {
//var xhr = new XMLHttpRequest();
//xhr.open("post","save_node.php",true);

}


/*
*cmd sample: 
*add node/connector/terminal ([ip=xxx] [type=xxx] [label=xxx];)*
*discovery iprange=xxx-xxx type=xxx
*del node/connector/terminal label=xxx
*/

//add node/connector/terminal ([ip=xxx] [type=xxx] [label=xxx];)*
//add node label
//return NEs
function parseNEsFromAddInputCmd(cmdItems) {
var type = cmdItems[1];
var len = cmdItems.length;
if (len<4) { // cmd=add node, using default xy location, 
	var NE = new Object();
	NE.NodeType = type;
	NE.Topox = 100;
	NE.Topoy = 100;	
	if ( len < 3) {//use the node count as label 
		no = NodeNum+1;
		NE.Label = no.toString();
	} else  {
		NE.Label = cmdItems[len-1];
	}
	NEs[NodeNum++] = NE;
	return NEs;
}
var nodes = cmdItems[2].split(";");
for(i=0;i<nodes.length;i++) {
	
}
return NEs;
}

//DEMO: 
//Accessing Ring: 10 705nodes
//Aggregation Ring: 5 705nodes, 1 765node
//Backbone Ring: 4 765nodes
function autodiscovery() {
//Accessing Ring: 10 705nodes	
var centX=450,centY=230,R=230;
var demo_ring_nodes = ["C705-1","A705-2","A705-3","A705-4","A705-5",
											"A705-6","A705-7","A705-8","A705-9","C705-10"];
var start = NodeNum;
  addTopoDemoRing(demo_ring_nodes,centX,centY,R);
	addTopoNodes(canvas,NEs,start,NodeNum);
	for(i=start;i<NodeNum-1;i++) {
		createLink("link_"+NEs[i].Label+"_"+NEs[i+1].Label,NEs[i].Label,NEs[i+1].Label);
	}  
	createLink("link_"+NEs[i].Label+"_"+NEs[start].Label,NEs[i].Label,NEs[start].Label);
	
//Aggregation Ring: 6 705nodes, 1 765node, 
//start from cross node C705-1, end to cross node C705-10
//hand on hand calculate
	len=150;
	current_node_num = NodeNum;
	demo_ring_nodes = [];
	demo_ring_nodes = ["T705-2","T705-3","B765-1","T705-4","T705-5"];
//	demo_ring_nodes = ["T705-2"];
	angleStep = 2 * 3.14/7.00;
	angle=angleInit = 3.14/5;
	c=angleStep-angleInit;
	for(i=0;i<demo_ring_nodes.length;i++) {
		start = NodeNum-1;
    addTopoDemoHandOnNode(NEs[start],demo_ring_nodes[i],len,angle);
    addTopoNodes(canvas,NEs,start+1,NodeNum);
    createLink("link_"+NEs[start].Label+"_"+demo_ring_nodes[i], NEs[start].Label,demo_ring_nodes[i]);
    angle = 2*3.14-(c+angleStep*i);
  }
  createLink("link_"+demo_ring_nodes[i-1]+"_"+"C705-1",demo_ring_nodes[i-1],"C705-1");
//  createLink("ring","C705-10","C705-10");

//Access Ring: 8 705nodes
//start from cross node T705-4, end to cross node T705-5
//hand on hand calculate
	len=130;
	current_node_num = NodeNum;
	demo_ring_nodes = [];
	demo_ring_nodes = ["A705-11","A705-12","A705-13","A705-14","A705-15","A705-16"];
//	demo_ring_nodes = ["T705-2"];
	angleStep = 2 * 3.14/7.00;
	angle=angleInit = 6.00;
	c=angleStep-angleInit;
	start = NodeNum - 2;
	for(i=0;i<demo_ring_nodes.length;i++) {
    addTopoDemoHandOnNode(NEs[start],demo_ring_nodes[i],len,angle);
    addTopoNodes(canvas,NEs,NodeNum-1,NodeNum);
    createLink("link_"+NEs[start].Label+"_"+demo_ring_nodes[i], NEs[start].Label,demo_ring_nodes[i]);
    angle = 2*3.14-(c+angleStep*i);
    start = NodeNum-1;
  }
  createLink("link_"+demo_ring_nodes[i-1]+"_"+"T705-5",demo_ring_nodes[i-1],"T705-5");	
  
//Backbone Ring: 4 765nodes
//start from cross node B765-1, 
//hand on hand calculate  
	len=100;
	current_node_num = NodeNum;
	demo_ring_nodes = [];
	demo_ring_nodes = ["B765-2","B765-3","B765-4"];
//	demo_ring_nodes = ["T705-2"];
	angleStep = 2 * 3.14/4.00;
	angle=angleInit = 3.14/4;
	c=angleStep-angleInit;
	//start = NodeNum - 2;
	for(i=0;NEs[i].Label!="B765-1";i++);
	start = i;
	for(i=0;i<demo_ring_nodes.length;i++) {
    addTopoDemoHandOnNode(NEs[start],demo_ring_nodes[i],len,angle);
    addTopoNodes(canvas,NEs,NodeNum-1,NodeNum);
    createLink("link_"+NEs[start].Label+"_"+demo_ring_nodes[i], NEs[start].Label,demo_ring_nodes[i]);
    angle = 2*3.14-(c+angleStep*i);
    start = NodeNum-1;
  }
  createLink("link_"+demo_ring_nodes[i-1]+"_"+"B765-1",demo_ring_nodes[i-1],"B765-1");	
}

function getNodesOnPath(src,dst) {
	return ["A705-7","A705-8","A705-9","C705-10","T705-2","T705-3","B765-1",
	         "B765-2"];
}

function getNodesOnStandbyPath(src,dst) {
	return ["A705-7","A705-6","A705-5","A705-4","A705-3","A705-2","C705-1",
	         "T705-5","T705-4","B765-1","B765-4","B765-3"];
}

//Display
//1. the path link will be shown in green and shink in 3 seconds
function drawServicePath(nodes,type) {
	for(i=0;i<nodes.length-1;i++) {
		tmp_ne1 = NEObjects[nodes[i]];
		tmp_ne2 = NEObjects[nodes[i+1]];
		found = false; 
		linknum = 0;
		while ( ! found && linknum < tmp_ne1.links.length) {
			if ( tmp_ne1.links[linknum].end1 == tmp_ne2 || 
			      tmp_ne1.links[linknum].end2 == tmp_ne2 ) {
			      	found = true;
			      	break;
			      }
			linknum++;
		}
		if ( ! found ) {
			alert("Not found link between " + nodes[i] + " and " + nodes[i+1]);
			return;
		}
		//tmp_ne1.links[linknum].path.attr({stroke:"red","stroke-width":10});
		tmp_path = tmp_ne1.links[linknum].path;
//		tmp_path.animate({stroke:"green","stroke-width":10},2000,
	//		function() {this.animate({stroke:this.attrs.stroke,
		//		                    "stroke-width":this.attrs.stroke-width},2000);});
		//tmp_ne1.links[linknum].path.attr({stroke:"green","stroke-width":1});
		tmp_ne1.links[linknum].path.animate({stroke:type,"stroke-width":10},2000);

	}
}

//add service bw=100M type=3G/LTE_data src=NodeB dst=RNC protect=yes
//calculate the path from src to dst, algorithm like ospf, cspf, ...
//The algorith should be calculated by the back end server, but
//for Demo here, just use a static path instead.
function addService(cmdItems) {
	var s,src,dst, protect=false;
	
	for(i=2;i<cmdItems.length;i++) {
		s = cmdItems[i].split("=");
		if ( s[0] == "src") src = s[0];
		if ( s[0] == "dst") dst = s[0];
		if ( s[0] == "protect" ) protect = true;
	}
	if (!src) {
		alert("No src=xxx input");
		return;
	}
	if (!dst) {
		alert("No dst=xxx input");
		return;
	}
	
		
	if (protect) {
		nodes = getNodesOnPath(src,dst);
		drawServicePath(nodes,ACTIVE_COLOR); 
		nodes = getNodesOnStandbyPath(src,dst);		
		drawServicePath(nodes,STANDBY_COLOR); 				
	}
	else {
		nodes = getNodesOnPath(src,dst);
		drawServicePath(nodes,ACTIVE_COLOR); 
	}
}

function addTopoDemoHandOnNode(node, creatingNodeLabel, len, angle) {
	var NE = new Object();
	NE.NodeType = "node";
	NE.Topox = node.Topox + len * Math.cos(angle);
	NE.Topoy = node.Topoy - len * Math.sin(angle);	
	NE.Label = creatingNodeLabel;
	
	NEs[NodeNum++] = NE;	
}

function addTopoDemoRing(demo_ring_nodes,centX,centY,R) {

	for(i=0;i<demo_ring_nodes.length;i++) {
		var NE = new Object();
		NE.NodeType = "node";
		NE.Topox = centX + R * Math.cos(2*0.314*i);
		NE.Topoy = centY + R * Math.sin(2*0.314*i);	
		NE.Label = demo_ring_nodes[i];
		
		NEs[NodeNum++] = NE;	
	}
return NEs;
}

function showFiber() {
	for(i=0;i<LinkNames.length;i++){
		LinkObjs[LinkNames[i]].path.attr({stroke:FIBER_COLOR,"stroke-width":FIBER_BW});
  }
}

function processTopoCmd(canvas, cmd) {
var tmp_cmdItems = cmd.split(" ");
if ( validateCheck(tmp_cmdItems) != true ) {
  return null;
}
//filter the blank space char
var cmdItems = [];ii=0;
for(i=0;i<tmp_cmdItems.length;i++) {
	if (tmp_cmdItems[i] != "") cmdItems[ii++] = tmp_cmdItems[i];
}

var cmdName = cmdItems[0];
switch(cmdName) {
//autodiscovery
//Demo the node and its links discovery
//2 access ring, 1 aggregation ring, 1 backbone ring
case "autodiscovery":
  autodiscovery();
  return null;
  
case "show":
 switch(cmdItems[1]) {
//just show fiber links
 	case "fiber":
 	  showFiber();
 	  return;
 	default:
 	  return;
	}   
case "add":
 switch(cmdItems[1]) {
	case "link":  // add link linklabel node1 node2 
		linklabel = cmdItems[2];
		node1 = cmdItems[3];
		node2 = cmdItems[4];
		createLink(linklabel, node1, node2);		
		return;
	case "node": 
		var start = NodeNum;
		parseNEsFromAddInputCmd(cmdItems);
		addTopoNodes(canvas,NEs,start,NodeNum);
		return;
  case "service":	
//add service
//add service bw=100M type=3G/LTE src=NodeB dst=RNC
    addService(cmdItems);
    return null;
  default:
    return null;
  }

case "del":
	return null;
case "discovery":
	return null;
case "alarm": // simulate alarm presentation, like alarm link broken, etc
// Present Alarm
// link alarm: alarm link $linkname $alarmtype, eg. alarm link a broken
// node alarm: alarm node $nodename $alarmtype
    if ( cmdItems[1] == 'link' ) {
        linkname = cmdItems[2];
        alarmType = cmdItems[3];
        processLinkAlarmDisplay(linkname, alarmType);
    }
    if ( cmdItems[1] == 'node' ) {
        nodename = cmdItems[2];
        alarmType = cmdItems[3];
        processNodeAlarmDisplay(nodename, alarmType);
    }
default:
	return null;
}

}

//just for demo
function processTopoUpdatebyAlarmDemo() {
	var activeLinks = ["A705-8","A705-9","C705-10","T705-2","T705-3","B765-1",
	         "B765-2"];
	//change the color to fiber
  for(i=0;i<activeLinks.length-1;i++) {
  	LinkObjs["link_"+activeLinks[i]+"_"+activeLinks[i+1]].path.attr({stroke:FIBER_COLOR});
  }

	var standbyLinks = ["B765-3","B765-4","B765-1","T705-4","T705-5","C705-1","A705-2","A705-3","A705-4","A705-5","A705-6","A705-7",];
  for(i=0;i<standbyLinks.length-1;i++) {
  	LinkObjs["link_"+standbyLinks[i]+"_"+standbyLinks[i+1]].path.attr({stroke:ACTIVE_COLOR});
  }
}

// Present Link Alarm
// link alarm: alarm link $linkname $alarmtype, eg. alarm link a broken
function processLinkAlarmDisplay(linkName, alarmType) {
//Find the link by linkName
    var linkObj = LinkObjs[linkName];

//show the alarm path and attr by alarmType
    if ( alarmType == "LOS" ) 
        linkObj.path.attr({stroke:"red"});
    if ( alarmType == "BRK" ) 
        linkObj.path.attr({stroke:"red","stroke-dasharray":"- "});
        
    processTopoUpdatebyAlarmDemo();//just for demo
}

// Present Node Alarm
// node alarm: alarm node $nodename $alarmtype, eg. alarm node boy FANFailure
function processNodeAlarmDisplay(nodeName, alarmType) {
//Find the node by nodeName
    var nodeObj = NEObjects[nodeName];

//show the alarm path and attr by alarmType
    if ( alarmType == "FANFailure" ) 
        nodeObj.raphael.attr({fill:"red"});
}

function alarm_recv() {
	for(var i=0;i<NEs.length;i++) {
		alarm_recv_NE(NEs[i]);
	}
	setTimeout(alarm_recv,3000);
}

function alarm_recv_NE(NE) {
	if ( NE.Label == "alarm" )
		NE.raphael.attr({fill:"red"});
}

