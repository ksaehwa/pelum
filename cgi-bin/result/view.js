
function getParameterByName(url,name) {
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function flipToggle(args){
	var str = "<div class='SliderDiv'><select id='slider_"+ args.id + "' class='slider' data-role='slider' data-mini='true'>";
	if( Number(args.tgl)){
		str +="<option value='0'>off</option>"
			+ "<option value='1' selected='selected'>on</option>";
	}else{
		str +="<option value='0' selected='selected'>off</option>"
			+ "<option value='1'>on</option>";
	}
	return str + "</select></div>";
}

function instance(name,val){
	var str="";
	if($("#"+name).attr('multiple') === undefined  ){
			str += "<font size='4' face='verdana'>"+ val + "</font><font size='1' face='verdana'>"+name+"</font>\n"; 	
	}else{
		str += "<br><font size='1'>"+ val.toString()+"</font>\n";
	}
	return str;
}

function appendList(obj){
	var li = "<li id='"+obj.idx+"'> <a class='go' href='#Set1?idx="+obj.idx+"'>";
		li += "<div class='InstanceDiv'>";
		li += instance('hour',obj.hour);


li += instance('min',obj.min);


li += instance('repeat',obj.repeat);


//Pop1Instances
		li += "</div>";

		li += flipToggle({id:obj.idx,tgl:obj.onoff});
//Pop1Togglable
		li	+= "</a>"
			+"<a id='delete_"+obj.idx+"' href='#delete' class='deleteBtn' data-rel='popup' data-position-to='window'> del </a></li>";
	
	$("#List").append(li);
	$("#List").listview().listview( "refresh" );
};

function removeItem(id){
	db.deleteItem(id);
	$('#List').find("#"+id).remove();
	$("#List").listview().listview( "refresh" );
}
function settingOption(id,value){
	var select = $("#"+id);
	if(select.attr("data-role") =='slider'){
		select.val((value==1)?'1':'0').slider("refresh");	
		return;		
	}else if( select.attr("multiple")=='multiple'){
		select.val(value.split(',')).attr("selected",true);
		select.selectmenu();
		select.selectmenu('refresh');
	}else{
		select.val(value).attr("selected",true);
		select.selectmenu();
		select.selectmenu('refresh');
	}
}
function prepareSettingPage(obj){
	//pSPSEL
settingOption('repeat',obj.repeat);
settingOption('min',obj.min);
settingOption('hour',obj.hour);
	
	//pSPTGL
	settingOption('onoff',obj.onoff);
}
function appendOption(id,start,end,arr){
	if( $("#"+id).children().length < end ){
		if(arr === null){
			for( var i=start ; i <= end ; i+=1){
				$("#"+id).append("<option value='"+i+"'>"+i+"</option>");	
			}
		}
		else{
			for( var i in arr ){
				$("#"+id).append("<option value='"+arr[i]+"'>"+arr[i]+"</option>");	
			}
		}
	}
}
