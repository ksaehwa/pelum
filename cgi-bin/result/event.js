
$(document).ready(function(){
    //POPEVENT	
	db.initialize();
	$("#List").empty();
	db.readAll();
	
	//Page1Event
	$("#Pop1").on('pagebeforeshow',function(){
		$("#List").empty();
		db.readAll();
		return ;
	});
	$("#popupYesBtn").click(function(){
		// remove a element on list.
		removeItem($(this).attr("data-del-id"));
	});	
    
    //SETEVENT
	$("#Set1").on("pagebeforeshow",function(event){
		event.stopPropagation();
		var idx = getParameterByName(event.target.baseURI,'idx');
		db.get({idx:idx});
		return;
	});
	function getdata(id){
		if( $("#"+id).attr("multiple") !== null ){
			var temp=[];
			$("#"+id+" option:selected").each(function(i,selected){
				temp.push( $(selected).val() );
			});
			return temp.toString();
		}else{
			return $("#"+id+" option:selected").val();
		}
	};
	$("#save").on('click',function(){
		var temp={};
		temp['idx'] = (curIdx == null) ? Math.random().toString(36).substring(2,4)+Math.random().toString(36).substring(2,4):curIdx;
		//SETSEL
		temp['repeat'] = getdata('repeat');
		temp['min'] = getdata('min');
		temp['hour'] = getdata('hour');
		
		//SETTGL
			temp['onoff'] = getdata('onoff');
		
		db.put(temp);
	});
    
});
	
function bindListEvent(id){
	//bLETGL	
	$(".slider").slider();
	$("#slider_"+id).bind('change',function(e){
		var tmp_id = e.target.id.split("_");
		db.put({idx:tmp_id[1],onoff:$(this).val(),tgl:true});
	});

	$("#delete_"+id).bind('click',function(e){
		var tmp_id = e.target.id.split('_');
		$("#popupYesBtn").attr("data-del-id",tmp_id[1]);
	});
}	