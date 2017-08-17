this.onmessage = function(e){
	var reader = new FileReaderSync(),
		temp = reader.readAsText(e.data[0]);
	
	//console.log( temp );
	try{
		postMessage({result: reader.readAsText(e.data[0]) });
	} catch( e ){
		console.log("Error" + e);
		postMessage({result:'err'});
	}
	
};
