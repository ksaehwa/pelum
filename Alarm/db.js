var DB = (function(){
	function DB_(){}
	DB_.prototype.initialize = function(){
		var db,request;
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
		
		if( !window.indexedDB ){
			window.alert("Your browser doesn't support a stable version of IndexedDB.");
			return false;
		}
		request = window.indexedDB.open("MyDB",3);
		request.onsuccess = function(event){
			db = event.target.result; 
		}
		request.onupgradeneeded = function(event){
			db = event.target.result;
			var objStore = db.createObjectStore("dbs",{keyPath: "idx" });
			console.log("on upgrade needed.");
		}
	}
	DB_.prototype.readAll = function(){
		var request=window.indexedDB.open("MyDB",3),
			db;
		request.onsuccess = function(event){
			var tx,objStore;
			db = event.target.result;
			tx = db.transaction(["dbs"],"readonly");
			objStore = tx.objectStore("dbs");
			objStore.openCursor().onsuccess = function(event){
				var cursor = event.target.result;
				if(cursor){
					//POPDB
					appendList(cursor.value);
					bindListEvent(cursor.value.idx);

					cursor.continue();
				}else{
					console.log("nothing.");
				}
			}
		}
	}
	DB_.prototype.add = function(obj){
		var request = window.indexedDB.open("MyDB",3),
			db;
		request.onsuccess = function(event){
			var tx,objStore;
			db = event.target.result;
			tx = db.transaction(["dbs"],"readwrite");
			objStore = tx.objectStore("dbs");
			objStore.put(obj).onsuccess = function(e){
				console.log("success adding");
				// append list.
			}
		}
	}
	DB_.prototype.put = function(obj){
		var request = window.indexedDB.open("MyDB",3),
			db;
		request.onsuccess = function(event){
			var tx, objStore;
			db = event.target.result;
			tx = db.transaction(["dbs"],"readwrite");
			objStore = tx.objectStore("dbs");
			objStore.get(obj.idx).onsuccess = function(e){
				var req, tmp = e.target.result;
				//TGLDB

				if( obj.hasOwnProperty('tgl')){
					tmp.onoff = obj.onoff;
					req = objStore.put(tmp);	
					return;
				}				
				req = objStore.put(obj);
				req.onsuccess = function(e){
					console.log("put: success.");
				};
			};
		};
	}
	DB_.prototype.get = function(obj){
		var request = window.indexedDB.open("MyDB",3),
			db;
		request.onsuccess = function(event){
			var tx, objStore;
			db = event.target.result;
			tx = db.transaction(["dbs"],"readwrite");
			objStore = tx.objectStore("dbs");
			console.log(obj.idx);
			objStore.get(obj.idx).onsuccess = function(e){
				//SETDBJS

				if(e.target.result !== undefined){
					curIdx = e.target.result.idx;
					prepareSettingPage(e.target.result);					
				}else{
					curIdx = null;
					var temp = {};
					//DBSEL
					temp['repeat'] = 'Mon';
		
					temp['min'] = 0;
		
					temp['hour'] = 0;
		
					//DBTGL
				temp['onoff'] = '0';
					prepareSettingPage(temp);
				}			};
			objStore.get(obj.idx).onerror = function(e){
				console.log("we couldn't find idx.");
				
				return false;
			};
		};
	}
	DB_.prototype.deleteItem = function(idx){
		var request = window.indexedDB.open("MyDB",3),
			db;
		request.onsuccess = function(event){
			var tx, objStore;
			db = event.target.result;
			tx = db.transaction(["dbs"],"readwrite");
			objStore = tx.objectStore("dbs");
			objStore.delete(idx).onsuccess = function(e){
				console.log("Success Delete!");
			}
		}
	}
	DB_.prototype.deleteDataBase = function(){
		var req = window.indexedDB.deleteDatabase("MyDB");
		req.onsuccess = function(e){
			console.log("Success delete database");
		}
	}
	
	return DB_;
}());
var db = new DB();