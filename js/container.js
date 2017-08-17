var current_id, id_in_progress, jsInstance, is_file_loading=false;
jsPlumb.ready(function(){
	jsInstance = jsPlumb.getInstance({
		Endpoint : [ "Dot", {radius : 2	} ],
		paintStyle : {strokeStyle : "#5c96bc",lineWidth : 2	},
		ConnectorStyle : {strokeStyle : "#5c96bc",lineWidth : 2	},
		HoverPaintStyle : {	strokeStyle : "#5c96bc",lineWidth : 2},
		dragOptions : {cursor : 'corsshair'},
		ConnectionOverlays :[
			["Arrow",{location: 1,length: 10}],
			["Custom",{	create: function(e){
						return $("<input id='evtType_"+e.sourceId+
						"' size='1' style='width:50px;'"+
						" type='text' class='evtType' name=''/>");
					},location: 0.5,id:"MyCustom"}]			
		],
		Overlays : [
			[ "Arrow", {
				location : 1,
				length : 10
			} ]],
		Container: "BaseCanvas"
	});
	jsInstance.fileLoad = false;
	jsInstance.bind("dblclick",function(e){
		var div = $("#"+e.sourceId),
			attr = div.attr('data-to').toString(),
			arr = attr.split(','),
			tmp='',
			len = arr.length,
			i;
	
		if( confirm("delete the connection?")){
			if( len > 1){
				for( i=0 ; i < len-1 ; i+=1 ){
					if( e.targetId == arr[i] ){
						continue;
					}
					tmp += arr[i] + ',';
				}
				tmp += arr[len-1];	
			}else if(len == 1){
				tmp='';
				tmp.trim();				
			}
			div.attr('data-to',tmp);
			
			blank = "";
			blank = blank.trim();
			$("#"+e.targetId).attr("data-from",blank);
			jsInstance.detach(e);
		}
	});
	jsInstance.bind("connection",function(e){
		var from_div = $("#"+e.sourceId),
			to_div   = $("#"+e.targetId),
			from_attr,
			to_attr;
		if( !is_file_loading ){
			to_attr = from_div.attr("data-to");
			from_attr = to_div.attr("data-from");
			if( to_attr ){
				to_attr += ',' + e.targetId;
				
			}else{
				to_attr = e.targetId;
			}
			
			if( from_attr){
				from_attr += ',' + e.sourceId;
			}else{
				from_attr = e.sourceId;
			}
			from_div.attr('data-to',to_attr);
			to_div.attr('data-from',from_attr);
			
		}
		// 이벤트 이름을 input val에 저장하기.
		$("._jsPlumb_Overlay").change(function(e){
			//get target id
			var tid = $("#"+e.target.id);
			tid.attr("name",tid.val());
			console.log("tid.val() > "+ tid.val() + " tid.attr('name') >" + tid.attr('name'));
			e.stopPropagation();
		});
	});
});

var PIMManager = (function(){
	function PM_(){
		//this.attrs = ["Name", "Values", "DefValue", "MulCheck"]; // added by ksaehwa 2017-07-20
		this.arr=[]; 
		this.openURL=[];
	};
	PM_.prototype.get = function(id){ // added by ksaehwa 2017-07-20
		var tempObj = this.find(id);
		if (tempObj) {
			return tempObj;
		} else {
			pim.add(id);
			return this.find(id);
		}
	};
//	PM_.prototype.saveOBJ = function(id){ // commented by ksaehwa
//		// this.arr[id];
//	};
	PM_.prototype.saveURL = function(id,value){
		this.openURL[id] = {'id':id,'URL':value};
	};
	PM_.prototype.getURL = function(id){
		return this.openURL[id];
	};
	/* ksaehwa comment on 2017-07-21 There was a misuses on arrays and objects. 
	 * Refer to the following from https://www.w3schools.com/js/js_arrays.asp 
	 * 	 * "WARNING !!
If you use named indexes, JavaScript will redefine the array to a standard object.
After that, some array methods and properties will produce incorrect results."
	* The previous add() and find() regarded var "arr" as object and not array. 
	*/
	PM_.prototype.add = function(id){
		//this.arr[id] = {'id':id,'Name':"",'Values':"", 'DefValue':"", 'MulCheck':""	}; // commented by ksaehwa 2017-07-20
		// ksaehwa add start 2017-07-21
		//var tempObj = {'id':id,'Name':"",'Values':"", 'DefValue':"", 'MulCheck':"false"}; // ksaehwa 2017-07-21
		var tempObj = {'id':id,'Name':"",'Values':"", 'DefValue':"", 'MulCheck':""}; // replaced 'MulCheck' by kkrul 2017-07-31
		this.arr.push(tempObj);
		// ksaehwa add end 2017-07-21
		return 1;
	};
	PM_.prototype.find = function(id){
		//console.log(this.arr[id]);
		//return this.arr[id]; // commented by ksaehwa 2017-07-20 
		// ksaehwa add start 2017-07-21
		for(var i=0; i < this.arr.length; i++) {
			var tempObj = this.arr[i];
			if (tempObj.id == id) {
				return tempObj;
			}
		}
		return null;
		// ksaehwa add end 2017-07-21		
	};
	/* commented by ksaehwa 2017-07-20
	PM_.prototype.setPage = function(id){
		if( this.arr[id] != 'undefined'){
			$('.Name').val(o.name);
			$('.Values').val(o.name);
			$('.DefValue').val(o.name);
			$('.MulCheck').val(o.name);
		}else{
			return false;
		}		
	}; */
	//pim.update(id_in_progress,'Name',$(this).val());
	PM_.prototype.update = function(id, type, value){
	//	this.add(id); // ksaehwa commented 2017-07-20
		//var temp_obj = this.arr[id];// ksaehwa replaced 2017-07-21
		var temp_obj = this.find(id);// ksaehwa added 2017-07-21
		//console.log("pim update type="+type + ", id="+id);
		//console.log("tempObj="+temp_obj);
		if( temp_obj ){
			switch( type ){
			case 'Name':
				temp_obj.Name = value;
				break;
			case 'Values':
				temp_obj.Values = value;
				break;
			case 'DefValue':
				temp_obj.DefValue = value;
				break;				
			case 'MulCheck':
				temp_obj.MulCheck = value;
				break;
			}
		}else{
			console.log("Error: "+id);
		}
		return;
	};
	PM_.prototype.showAll = function(){
		for(var i in this.arr ){
			console.log( this.arr[i] );
		}		
	};
	return PM_;
}());
var pim = new PIMManager();

var LUMManager = (function(){
	var me;
	function LM_(){
		this.types = ["Con", "Pop", "Opt", "Set", "Pre", "Nav", "Its","Ins","Sel","Edt","Tgl"];
		this.counts= [ 0,0,0,0,0,0,0,0,0,0,0];
		this.lums=[];
		me = this;
	}
	LM_.prototype.getCode = function(type){
		var my_id = current_id +"_" + this.types[type]+(++this.counts[type]), // make id.
			code=""; 
		// set code.
		if( 0<=type && type<=3 ){
			code = "<div id="+my_id+" class='Component Container' name='' data-from='' data-to=''>";
		}else{
			code = "<div id="+my_id+" class='Component Presentation' name='' data-from='' data-to=''>";
		}
		code = code +
				"	<div class='ComponentHead'>"  + 
				"	<span><img src='./img/img_"+this.types[type]+".jpg'></span>"+
				"	<span><input id='name_"+my_id+"' type='text'></span>"+
				"	<span><img id='del_"+my_id+"'src='./img/remove.jpg'></span>"+
				"	</div>"+
				"</div>" ;
		
		return {'code':code,'id':my_id};
	};
	// check pim.
	function check(id){
		var current_Target_id = id,
			temp_arr = current_Target_id.split('_'),
			//temp_arr_length = temp_arr.length, // commented by ksaehwa 2017-07-20
			flag=-1,
			temp_obj,
			Values = $('.Values'),
			DefValue = $('.DefValue'),
			MulCheck = $('#MulCheck'); // replaced with by ksaehwa 2017-07-20
			//MulCheck = $('.MulCheck'); // replaced by ksaehwa 2017-07-20
			
		//console.log("temp_arr_length="+temp_arr_length);
		//console.log("temp_arr="+temp_arr);
		/* org version by kibong --> replaced by ksaehwa 2017/07/20
		if( temp_arr[temp_arr_length - 1 ].substring(0,3) === "Set"){
			flag = 1;
		}else if(temp_arr[temp_arr_length - 1 ].substring(0,3) === "Pop"){
			flag = 0;
		}  */
		if( temp_arr[1].substring(0,3) === "Set"){
			flag = 1;
		}else if(temp_arr[1].substring(0,3) === "Pop"){
			flag = 0;
		}
		// class = 'Values & DefValue & MulCheck' enable.
		$('.Name').val( $('#name_'+id).val() );
		switch(flag){
			case -1:
				Values.attr('disabled',true);
			case 0:
				if(temp_obj=pim.getURL(current_Target_id)){
					Values.val(temp_obj.URL);
				}
				DefValue.attr('disabled',true);
				MulCheck.attr('disabled',true);
				break;
			case 1:
				/* replaced by ksaehwa 2017-07-20 
				if( pim.add(current_Target_id) ){ 
					console.log("running");
					temp_obj = pim.find(current_Target_id);
					Values.val( temp_obj.Values);
					DefValue.val( temp_obj.DefValue );
					((temp_obj.MulCheck == '1')? 
					MulCheck.attr('checked',true) : MulCheck.attr('checked',false) );
					MulCheck.val( temp_obj.MulCheck );
				} */
				// ksaehwa replaced with 2017-07-20 start 
				temp_obj = pim.get(current_Target_id); // get() is added by ksaehwa 2017-07-20
				Values.val( temp_obj.Values);
				DefValue.val( temp_obj.DefValue );
				//console.log('check temp_obj.MulCheck='+temp_obj.MulCheck+" id="+id);
				if (temp_obj.MulCheck == 'True') {//replaced by kkrul(temp_obj.MulCheck == 'true'->temp_obj.MulCheck == 'True')
					MulCheck.checked = "True";//replaced by kkrul(true->True)
					//console.log('after mulcheck true setting');
				}
				else {
					MulCheck.checked = "";//replaced by kkrul(true->"")
					//console.log('after mulcheck false setting');
				}
				// ksaehwa replaced with 2017-07-20 end
				//console.log('pim_arr in check '+pim.arr);
				Values.attr('disabled',false);
				DefValue.attr('disabled',false);
				MulCheck.attr('disabled',false);
				break;
		}
		id_in_progress = current_Target_id;
		return true;
	}
	
	function findLum(id,name){
		var result={index:0,name:false};
		for( i in me.lums){
			if( me.lums[i].name == name){
				result.name = true;
			}
			if( me.lums[i].id == id){
				result.index = i;
			}
		}
		return result;
	}
	LM_.prototype.eventBinding = function(id,x,y,tId){
		var source_point = {
			endpoint : [ "Rectangle", {
				width : 12,
				height : 12
			} ],
			paintStyle : {
				fillStyle : "#5c96bc",
				lineWidth : 2
			},
			connectorStyle : {
				strokeStyle : "#5c96bc",
				lineWidth : 2
			},
			maxConnections : -1,
			isSource : true
		},
		target_point = {
			DropOptions : {
				HoverClass : "dragHover"
			},
			anchor : "Continuous",
			isTarget : true
		};
		
		$("#"+id).resizable({
			containment: "#"+current_id,
			resize : function(e,ui){
				jsInstance.repaintEverything(true);
			}
		});	
		$("#"+id).draggable({
			containment: "parent",
			drag : function() {
				jsInstance.repaintEverything(true);
			}
		});
		$("#del_"+id).on("click",function(){
			if(confirm("delete it?") ){
				$("#"+id).find(".Component").each(function(index,element){
					console.log(this.id);
					jsInstance.deleteEndpoint(this.id+"DragAnchor");
					jsInstance.detachAllConnections(this.id);
				});
				jsInstance.deleteEndpoint(id + "DragAnchor");
				jsInstance.detachAllConnections(id);
				$("#"+id).remove();
			}
		});
		
		$(".Component").click(function(e){
			//중첩된 div의 event 핸들링의 전파를 막는다.
			e.stopPropagation();
			check(e.currentTarget.id);
			return;
		});
		$("#name_"+id).change(function(e){
			if( check(e.target.id.substring(5))){ // ksaehwa note: 5 is for eliminating "name_"
				$("#"+id).attr('name',$(this).val());
				$('.Name').val($(this).val());	
				pim.update(id_in_progress,'Name',$(this).val());
			}			
		});
		
		if(tId){
			console.log("Connect each elements",tId);
			is_file_loading = true;
			jsInstance.connect({
				source:id, 
				target:tId, 
				paintStyle:{
					strokeStyle : "#5c96bc",
					lineWidth : 2
				}, 
				overlays : [
					[ "Arrow", { 
						location : 1,
						length : 10
					} ]
				]
			});
		}else{
			is_file_loading = false;
			$("#"+id).css({left: x , top: y });
		}
		
		jsInstance.addEndpoint(id, source_point, {
			anchors : [  "Left", "Top", "Right", "Bottom", "Continuous" ],
			uuid : id + "DragAnchor"
		});
		jsInstance.unmakeEveryTarget();
		var containers = jsPlumb.getSelector(".Component");
		for (var i = containers.length - 1; i >= 0; i--) {
			jsInstance.makeTarget(containers[i], target_point);
		}
		
	};
	return LM_;
}());
var model = new LUMManager();

var FileManager = (function(){
	var me;
	var filesystem = null;
	function FM_(){
		this.evtName=[];
		me = this;
	}
	/* 
	 cb is callback.
	 it works event binding. 
	*/
	FM_.prototype.FileLoad = function( files ){
		var	myWorker,
			base = $("#BaseCanvas"),
			i; 
		if(window.Worker){ //
			//myWorker = new Worker("http://localhost/js/worker.js");// ksaehwa commented 2017-07-20
			myWorker = new Worker("js/worker.js"); // ksaehwa replaced 2017-07-20
			//worker 가 일을 수행해야함. 
			for( i=0 ; i<files.length; i+=1 ){
				// post message file object to 'worker.js'
				myWorker.postMessage([files[i],files[i].type]);
				// then, append e.data.result(lum file) to '#BaseCanvas'.
				myWorker.onmessage = function(e){
					if(e.data.type == "text/xml"){
						console.log('Loading LUM file...');
						base.append( e.data.result );
						console.log('Initializing LUM file...');
						base.find("_jsPlumb_endpoint").each(function(index,element){
							$(element).remove();
						});
						
						//processing evesnt name.
						base.find("input").each(function(index,element){
							var I = $(element),
								id = I.attr('id').split('_');
							if(id[0] == 'evtType'){
								console.log('id: '+I.attr('id')+' name: '+I.attr('name'));
								me.evtName.push({id:I.attr('id'),name:I.attr('name')});	
								I.remove();
							}
						});
						base.find("svg").each(function(index,element){
							$(element).remove();
						});
						$('.ui-resizable').resizable().resizable('destroy');
						model.counts= [ 0,0,0,0,0,0,0,0,0,0];
						model.lums =[];
						base.find(".Component").each(function(index,element){
							var id = $(element).attr('id'),
								id_split = id.split('_'),
								id_split_len = id_split.length;
							model.counts[model.types.indexOf(id_split[id_split_len-1].substring(0,3))]+=1;
							
							model.eventBinding($(element).attr('id'),
										false,false, $(element).attr('data-to') );		
							model.lums.push({id:id, name:$(element).attr('name')});
							$("#name_"+id).val($(element).attr('name'));
						});	
						// input evt name
						for( var i in me.evtName){
							console.log( me.evtName[i] );
							$("#"+me.evtName[i].id).val( me.evtName[i].name);
						}
						// make null
						me.evtName = []; 
						console.log('Loading LUM file done.');
					}else{
						//pim load.
						console.log("Loading PIM...");
						pim.arr=[]; // The pim-array is initialized to state of empty .
						var temp = e.data.result,
							obj;
						temp = temp.toString();
						if(temp && temp.length){
							obj = $.parseJSON(temp);
							$.each(obj, function(i,v){
								pim.arr.push(v);
								console.log("v.id"+v.id);
							});
						}
						console.log("Loaing PIM file is done. ");
					}
				};
			}
		
		}
	};
	// private method.
	function createDownObj(obj,data,name){
		var url;
		window.URL.revokeObjectURL(url);
		url = window.URL.createObjectURL(data);
		console.log(url);
		obj.attr('href',url);
		obj.attr('download', name);
	}
	function writeLocalLum(text) {
		var fs = require('fs');
		fs.writeFile('./results.txt', text, function(err) {
		  if(err) throw err;
		  console.log('File write completed');
		});
	}
	FM_.prototype.FileDown = function( ){
		var blob=[],
			url,
			lum_xml = $("#BaseCanvas").html(),
			pim_xml = pim.arr,
			ldl = $("#LumDownLink"),
			pdl = $("#PimDownLink");
		if(!window.URL && !window.Blob){
			console.log("none.");
			return false;
		}
		writeLocalLum(lum_xml);
		//blob[1]= new Blob([JSON.stringify(pim_xml)], {type:'text/json'});
		//createDownObj(ldl,blob[0],'Lum');
		//createDownObj(pdl,blob[1],'Pim.json');
	};
	
	FM_.prototype.FileDown1 = function( ){
		var blob=[],
			url,
			lum_xml = $("#BaseCanvas").html(),
			pim_xml = pim.arr,
			ldl = $("#LumDownLink"),
			pdl = $("#PimDownLink");
		if(!window.URL && !window.Blob){
			console.log("none.");
			return false;
		}
		
		blob[0]= new Blob([lum_xml], {type:'text/xml'});
		blob[1]= new Blob([JSON.stringify(pim_xml)], {type:'text/json'});
		createDownObj(ldl,blob[0],'Lum');
		createDownObj(pdl,blob[1],'Pim.json');
	};
	return FM_;
}());
var fmanager = new FileManager();
