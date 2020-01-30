var selected_device;
var devices = [];
function setup(){
	//Get the default device from the application as a first step. Discovery takes longer to complete.
	BrowserPrint.getDefaultDevice("printer", function(device){

				//Add device to list of devices and to html select element
				selected_device = device;
				devices.push(device);
				var html_select = document.getElementById("selected_device");
				var option = document.createElement("option");
				option.text = device.name;
				html_select.add(option);

				//Discover any other devices available to the application
				BrowserPrint.getLocalDevices(function(device_list){
					for(var i = 0; i < device_list.length; i++)
					{
						//Add device to list of devices and to html select element
						var device = device_list[i];
						if(!selected_device || device.uid != selected_device.uid)
						{
							devices.push(device);
							var option = document.createElement("option");
							option.text = device.name;
							option.value = device.uid;
							html_select.add(option);
						}
					}

				}, function(){alert("Error getting local devices")},"printer");

			}, function(error){
				alert(error);
			})
}

let errorCallback = function(errorMessage){
    alert("Error: " + errorMessage);
}

function writeToSelectedPrinter(dataToWrite){
	selected_device.send(dataToWrite, undefined, errorCallback);
}
function printBarcode(){
	console.log('test');
  let barcodeNumber  = document.getElementById('BarcodeNumber').value;
  let name = document.getElementById('Name').value;
  let dateRecived = document.getElementById('DateRecived').value;
  let supplier = document.getElementById('Supplier').value;
  let catalogueNumber = document.getElementById('CatalogueNumber').value;

  const printData = "^XA ^CF0,15 ^CI28 ^FO10,20^FD"+barcodeNumber+"^FS ^FO10,38" +
                    "^BXN,4,200 ^FD"+barcodeNumber+"^FS ^FO245,20,1^FDRec\'d^FS" +
                    "^FO245,38,1^A0N,18 ^TBN,120,120 ^FD"
                    + name+ " "+ dateRecived +
                    "^FS ^FO10,105^A0N,20^FD"+supplier + " " +catalogueNumber + "^FS ^XZ"
  //
  // alert(printData);
	writeToSelectedPrinter(printData);
  // writeToSelectedPrinter("^XA^CF0,15^CI28^FO10,20^FD12234890987^FS^FO10,38^BXN,4,200^FD12234890987^FS^FO245,20,1^FDRec'd^FS^FO245,38,1^A0N,18^TBN,120,120^FDJennifer Kimball 2017-11-30^FS^FO10,105^A0N,20^FDSigma Aldrich 25467^FS^XZ");
  // readFromSelectedPrinter()
}
window.onload = setup;
//
document.getElementById("PrintForm").addEventListener("submit", printBarcode);
