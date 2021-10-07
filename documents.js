//////////////////////////////////////////
// UPLOAD LOGIC
//////////////////////////////////////////

var myForm = document.getElementById('formAjax');

myForm.onsubmit = function(event) {

	var numberOfDocuments = 0;
	event.preventDefault();
	
	console.log(numberOfDocuments);
	
	var formData = new FormData();
	
	for(singleDocument in documentsUploadFiles) {
		if(documentsUploadFiles[singleDocument] === undefined) {
			if(singleDocument == "file1") { continue; }

			alert("Please upload all the files!");
			return;
		}
		
		numberOfDocuments++;
		//Append the files to the AJAX request
		console.log(documentsUploadFiles[singleDocument]);
		formData.append(`upfile['${documentsUploadFiles[singleDocument].inputField}']`, 
						documentsUploadFiles[singleDocument], documentsUploadFiles[singleDocument].name);
	}
	
	//Setup the request

	console.log(formData);
	var xhr = new XMLHttpRequest();
	
	//Open the connection
	xhr.open('POST', 'uploadHandling.php', true);
	
	//Set up a handler for when the task for the request is complete
	xhr.onload = function () {
		if (xhr.status == 200) {

			if(IsJsonString(xhr.responseText)) {
				checkIfUserLoggedIn(function(isLoggedIn) {

					if(isLoggedIn) {
						storeDocumentsInDb(JSON.parse(xhr.responseText), numberOfDocuments, false);
					}
					else {
						registerAutista(autista_data.basic_info, autista_data.basic_info_subsequent_data, 
								autista_data.profilo_vettore, JSON.parse(xhr.responseText), numberOfDocuments);
					}
				});
			}
			else{
				alert(xhr.responseText);
			}
		} else {
			alert('Something went wrong!\nTry again.');
		}
	};
	
	//Send the data.
	xhr.send(formData);
}
