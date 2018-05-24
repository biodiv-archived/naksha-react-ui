import Config from '../common/config.js'
var shapefile = require('shapefile');
var Pikaday = require('pikaday');

var props = null;
var root_container;
const MAX_ROW_COUNT = 5;

function init(params) {
    props = params;
	root_container = document.getElementById('add-layer-component');
	root_container.innerHTML = createAddLayersPanel();
}

/*------------------ ADD LAYER FUNCTIONS -------------------------*/

function createAddLayersPanel(){
	var html =  "<div class=add-layer-panel>"
				+ "<label>Please select input type</label><br>"
				+ "<input type='radio' name='fileType' value='shape' onChange='setDataUploadType(this.value)' checked=true> Shape File"
				+ "<input type='radio' name='fileType' value='raster' onChange='setDataUploadType(this.value)'> Raster File<br><br>"
				+ "<div id='shape-file-data' class='grey-border'>"
				+   "<label>Select shape file   </label>"
				+   "<input type='file' id='inputShpFiles' name='files[]'><br><br>"
				+   "<label>Select shx file   </label>"
				+   "<input type='file' id='inputShxFiles' name='files[]'><br><br>"
				+   "<label>Select dbf file   </label>"
				+   "<input type='file' id='inputVectorDbfFiles' name='files[]'><br><br>"
				+   "<input type='submit' class='' id='upload-submit-shape' value='Go!' onclick='displayShapeDataForm()'>"
				+   "<br><br>"
				+   "<div id='dbf-data-table-div' class='dbf-table'></div>"
				+ "</div>"
				+ "<div id='raster-file-data' class='hide grey-border'>"
				+   "<label>Select tiff file   </label>"
				+   "<input type='file' id='inputTiffFiles' name='files[]'><br><br>"
				+   "<label>Select dbf file   </label>"
				+   "<input type='file' id='inputRasterDbfFiles' name='files[]'><br><br>"
				+   "<input type='submit' class='' id='upload-submit-raster' value='Go!' onclick='displayRasterDataForm()'>"
				+   "<br><br>"
				+ "</div>"
				+ "</div>"

	return html;
}

function displayShapeDataForm() {
	handleShapeFileSelect(addMetadataComponent);
}

function displayRasterDataForm() {
	document.getElementById('upload-submit-raster').classList.add('hide');
	handleRasterFileSelect();
	addMetadataComponent(null);
}

/*function displayShapeDataForm() {
	var pr = new Promise(handleShapeFileSelect)
		.then(function(){
			addMetadataComponent();
		);
	
}*/

function addMetadataComponent(col_names) {
	console.log('adding metadata component');
	var dataType = document.querySelector('input[name="fileType"]:checked').value
	var html = "<div id='metadata-component'>"
	var styleColumnHtml = ""
	if (col_names) {
		styleColumnHtml = "<tr><td data-name='color_by'>Default Styling Column</td><td>"
							+ "<select id='default_style_column'>"
		col_names.forEach(function(column) {
			styleColumnHtml += "<option value='" + column + "'>" + column + "</option>"
		})
		styleColumnHtml += "</select>" + "</td></tr>";
	}
	var detailsHtml = "<table id='metadata_table'>"
					+ styleColumnHtml
					+ "<tr><td data-name='layer_name'>Layer Name</td><td><input/></td></tr>"
					+ "<tr><td data-name='layer_description'>Layer Description</td><td><textarea style='width:100%' rows='5' cols='50'></textarea></td></tr>"

	if (dataType === "shape") {
		detailsHtml += "<tr><td data-name='layer_type'>Layer Type</td><td>"
					+ getLayerTypeSelector()
					+ "</td></tr>"
	}
	
	detailsHtml		+= "<tr><td data-name='created_by'>Contributor</td><td><input/></td></tr>"
					+ "<tr><td data-name='attribution'>Attribution</td><td><input/></td></tr>"
					+ "<tr><td data-name='tags'>Tags</td><td><input/></td></tr>"
					+ "<tr><td data-name='license'>License</td><td>"
					+   getLicenseSelector()
					+ "</td></tr>"
					+ "<tr><td data-name='created_date'>Data Curation Date</td><td><input id='curation_date_picker'></td></tr>"
					+ "<table>"
	//html += "<label>Default styling column   </label>" + styleColumnHtml;
	html += detailsHtml
	html += "</div>"
	document.getElementById(dataType + '-file-data').insertAdjacentHTML('beforeend', html);

	// add date picker on curation date picker element
	var maxDate = new Date(); // current date
	var yearRange = [1800, maxDate.getFullYear()];
	var picker = new Pikaday({
			field: document.getElementById('curation_date_picker'),
			maxDate: maxDate,
			yearRange: yearRange
		});
	addSubmitButton(dataType)
}

function addSubmitButton(dataType) {
	var html =  "<button id='shape_submit_btn' class='submit-btn' onClick='uploadFiles()'>Upload</button>";
	document.getElementById(dataType + '-file-data').insertAdjacentHTML('beforeend', html);
}

function getLicenseSelector() {
	var html = "<select>"
	var licenseOptions = ["CC-BY", "CC-HI"];
	licenseOptions.forEach(function(lic) {
		html += "<option value='" + lic + "'>" + lic + "</option>"
	})
	html += "</select>"
	return html;
}

function getLayerTypeSelector() {
	var html = "<select>"
	var licenseOptions = ["POINT", "MULTIPOINT", "MULTILINESTRING", "MULTIPOLYGON"];
	licenseOptions.forEach(function(lic) {
		html += "<option value='" + lic + "'>" + lic + "</option>"
	})
	html += "</select>"
	return html;
}

function setDataUploadType(type) {
	console.log('upload data type changed: ', type)
	if (type === 'shape'){
		document.getElementById('shape-file-data').classList.remove('hide');
		document.getElementById('raster-file-data').classList.add('hide');
	} else if (type === 'raster') {
		document.getElementById('shape-file-data').classList.add('hide');
		document.getElementById('raster-file-data').classList.remove('hide');
	}
}

function handleShapeFileSelect(callback) {
	var shpFiles = document.getElementById('inputShpFiles').files; // FileList object
	var shxFiles = document.getElementById('inputShxFiles').files; // FileList object
	var dbfFiles = document.getElementById('inputVectorDbfFiles').files;
	if (shpFiles.length === 0) {
		alert ('Please select a shape file.');
		return false;
	}
	if (shxFiles.length === 0) {
		alert ('Please select a shx file.');
		return false;
	}
	if (dbfFiles.length === 0) {
		alert ('Please select a dbf file');
		return false;
	}
	
	// hide the 'Go!' button
	document.getElementById('upload-submit-shape').classList.add('hide');

	var shpReader = new FileReader();
	var dbfReader = new FileReader();
	dbfReader.onload = (function(){
		shapefile.openDbf(dbfReader.result)
			.then(source => createDataTable(source, callback))
		 	.catch(error => console.error(error.stack));
	})
	dbfReader.readAsArrayBuffer(dbfFiles[0]);
	return true;
}

function handleRasterFileSelect() {
	var tiffFiles = document.getElementById('inputTiffFiles').files; // FileList object
	var dbfFiles = document.getElementById('inputRasterDbfFiles').files;
	if (tiffFiles.length === 0) {
		alert ('Please select a TIFF file.');
		return false;
	}
	if (dbfFiles.length === 0) {
		alert ('Please select a dbf file');
		return false;
	}
}

function createDataTable(source, callback) {
	var fixed_col_html = getFixedColumnHTML();
	var row_count = 0;
	var table_html = "<table id='dbf-data-table'>";

	source.read().then(function(result){
		var col_names = Object.keys(result.value);
		// construct table header row
		table_html += "<tr>"
		col_names.forEach(function(col) {
			table_html += "<th>" + col + "</th>"
		})
		table_html += "</tr>"
		table_html += "<tr>"
		col_names.forEach(function(col) {
			table_html += "<td><input value='" + col + "'></input></td>"
		})
		table_html += "</tr>"
		// contruct table rows
		function addRow(result1) {
			table_html += "<tr>"
			Object.values(result1.value).forEach(function(value) {
				table_html += "<td>" + value + "</td>";
			})
			table_html += "</tr>";
			row_count += 1;
			source.read().then(function(res) {
			    if (!res.done && row_count < MAX_ROW_COUNT)
				addRow(res);
			    else {
				table_html += getAdditionalRows(col_names);
				table_html += "</table>"
				console.log('finished creating table');
				document.getElementById('dbf-data-table-div').innerHTML = "<div>"
																	//+ fixed_col_html
																	+ "</div>"
																	+ "<div>"
																	+ table_html
																	+ "</div>";
				callback(col_names);
			    }
			});
		}

		addRow(result);
	})
	return;
}

function getAdditionalRows(columns) {
	// add radio button row to select title column
	var html = "<tr>"
	var checked = "checked";
	columns.forEach(function(col) {
		html += "<td style='text-align:center'><input type='radio' " + checked + " name='titleColumn' value='" + col + "'>Title Column</input></td>"
		checked = "";
	})
	html += "</tr>"

	// add checkbox row to select summary columns
	html += "<tr>"
	columns.forEach(function(col) {
		html += "<td style='text-align:center'><input type='checkbox' name='summaryColumn' value='" + col + "'>Summary Column</td>"
	})
	html += "</tr>"
	return html;
}

function getFixedColumnHTML() {
	var html = "";
	html += "<table>";
	html += "<tr><th>Field Name</th></tr>"
	html += "<tr><th>Field Description</th></tr>"
	html += "<tr><th></th></tr>"
	html += "<tr><th>Field Name</th></tr>"
	html += "<tr><th>Field Name</th></tr>"
	html += "<tr><th>Field Name</th></tr>"
	html += "</table>";
	return html;
}

function uploadFiles() {
	var metadata_json = {};
	var dataType = document.querySelector('input[name="fileType"]:checked').value;

	if (dataType == 'shape') {
		var title_column = "'" + document.querySelector('input[name="titleColumn"]:checked').value + "'";
		var summary_columns = document.querySelectorAll('input[name="summaryColumn"]:checked')
		var summary_columns_names = []
		summary_columns.forEach(function(col){
			summary_columns_names.push("'" + col.value + "'")
		})

		metadata_json['title_column'] = title_column;
		metadata_json['summary_columns'] = summary_columns_names;
	}

	
	var meta_table = document.getElementById('metadata_table');
	var num_rows = meta_table.rows.length;
	for (var i = 0; i < num_rows; i++) {
		var keyCells = meta_table.rows[i].cells[0]
		var objCells = meta_table.rows[i].cells[1].children[0];
		var key = keyCells.getAttribute('data-name');
		var value = objCells.value;
		if (key === 'color_by')
			value = "'" + value + "'"

		metadata_json[keyCells.getAttribute('data-name')] = value;
		console.log(objCells.value);
	}
	console.log('metadata', metadata_json);

	var data = new FormData();
	if (dataType === 'shape') {
		var shpFile = document.getElementById('inputShpFiles').files[0];
		metadata_json['layer_tablename'] = shpFile.name.replace(".shp", "").toLowerCase();
		data.append('shp', shpFile);
		data.append('shx', document.getElementById('inputShxFiles').files[0]);
		data.append('dbf', document.getElementById('inputVectorDbfFiles').files[0]);
	}
	else if (dataType === 'raster') {
		var tiffFile = document.getElementById('inputTiffFiles').files[0];
		metadata_json['layer_tablename'] = tiffFile.name.replace(".tiff", "").toLowerCase();
		data.append('raster', tiffFile);
		data.append('dbf', document.getElementById('inputRasterDbfFiles').files[0])
	}

	metadata_json['status'] = 1;
	data.append('metadata', createMetadataFile(dataType, metadata_json));
	var url = "https://" + props.contextUrl + "/naksha/geoserver/uploadshp";
	console.log(url);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4){
		document.getElementById('upload-loader').style.display = 'none';
		console.log('response type: ', typeof(xmlHttp.response));
		if(xmlHttp.response === 0 || xmlHttp.response === '0')
		    alert('Layer added successfully!');
		else if (xmlHttp.response === 1 || xmlHttp.response === '1')
		    alert('Layer creation failed.')
		else
		    alert('Oops! Something went wrong.')
	  }
	}
	xmlHttp.open("POST", url, true);
	xmlHttp.send(data);
	document.getElementById('shape_submit_btn').disabled = true;
	document.getElementById('shape_submit_btn').style.opacity = 0.5;
	document.getElementById('add-layer-component').insertAdjacentHTML('beforeend', '<div id="upload-loader" class="loader"></div>');
}

/*function WriteToFile(passForm) { 
		set fso = CreateObject("Scripting.FileSystemObject"); 
	set s = fso.CreateTextFile("C:\test.txt", True); 
	s.writeline("HI"); 
	s.writeline("Bye"); 
	s.writeline("-----------------------------"); 
	s.Close(); 
}*/

function createMetadataFile(dataType, metadata_json) {
	var content = "";
	content += "*Meta_Layer\n";
	for (var key in metadata_json) {
		content += key + " : " + metadata_json[key] + "\n";
	}


	content += "\n$Layer_Column_Description\n";
	if (dataType === "shape") {
		var dataTable = document.getElementById('dbf-data-table');
		var col_names = dataTable.rows[0];
		var col_names_desc = dataTable.rows[1];
		var num_cols = col_names.childElementCount;
		for (var i = 0; i < num_cols; i++) {
			content += col_names.cells[i].textContent + " : " + col_names_desc.cells[i].children[0].value + "\n";
		}
	}

	console.log(content);
	return new Blob([content], {type:'text/plain'});

}

export default {
	init: init
}

window.handleShapeFileSelect   		=handleShapeFileSelect
window.setDataUploadType			=setDataUploadType
window.displayShapeDataForm			=displayShapeDataForm
window.uploadFiles					=uploadFiles
window.displayRasterDataForm		=displayRasterDataForm
