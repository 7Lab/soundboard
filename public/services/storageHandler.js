class StorageHandler {

	constructor() {

		this.firestore	= firebase.firestore();
		this.firestore.settings({timestampsInSnapshots: true});
	}

	// Store data
	storeData(ref, key, value) {

		// Create a new promise
    	return new Promise((resolve, reject)=>{

			var tracks = this.firestore.collection(ref);

			tracks.doc('track-' + key).set({url: value, id: key})

			.then(() => {
				console.log("Document written");

				resolve(true);
			})
			
			.catch(error => {
				console.error("Error adding document");

				reject(error);
			});

		});
	}

	// Retrieve data
	getData(ref) {

		var tracks 	= this.firestore.collection(ref);
		var list 	= new Array();

		return new Promise((resolve, reject)=>{
			tracks.get().then(querySnapshot => {

				if(querySnapshot.size > 0) {
					querySnapshot.forEach(function(doc) {
			        	list.push(doc.data());
			    	});
				} else {
					console.log('No tracks found in DB');
				}			

			})

			.then(() => {
				resolve(list);
			})

			.catch(error => {
				reject(error);
			});
		            
		});
		
	}
}

export let storageHandler = new StorageHandler();