import Config from '../common/config.js'
var shapefile = require('shapefile');
var Pikaday = require('pikaday');

var root_container;
const MAX_ROW_COUNT = 5;

function init(params) {
	root_container = document.getElementById('add-layer-component');
	root_container.innerHTML = createAddLayersPanel();
}

/*------------------ ADD LAYER FUNCTIONS -------------------------*/

function createAddLayersPanel(){
	var html =  "<div class=add-layer-panel>"
				+ "<label>Please select input type</label><br>"
				+ "<input type='radio' name='fileType' value='shape' onChange='setDataUploadType(this.value)'> Shape File"
				+ "<input type='radio' name='fileType' value='raster' onChange='setDataUploadType(this.value)'> Raster File<br><br>"
				+ "<div id='shape-file-data' class='grey-border'>"
				+   "<label>Select shape file   </label>"
				+   "<input type='file' id='inputShpFiles' name='files[]'><br><br>"
				+   "<label>Select dbf file   </label>"
				+   "<input type='file' id='inputDbfFiles' name='files[]'><br><br>"
				+   "<input type='submit' class='' id='upload-submit' value='Go!' onclick='displayShapeDataForm()'>"
				+   "<br><br>"
				+   "<div id='dbf-data-table' class='dbf-table'></div>"
				+ "</div>"
				+ "<div id='raster-file-data' class='hide grey-border'>"
				+ "</div>"
				+ "</div>"

	return html;
}

function displayShapeDataForm() {
	var isSuccess = handleFileSelect(addMetadataComponent);
}

/*function displayShapeDataForm() {
	var pr = new Promise(handleFileSelect)
		.then(function(){
			addMetadataComponent();
		);
	
}*/

function addMetadataComponent(col_names) {
	console.log('adding metadata component');
	var html = "<div id='metadata-component'>"
	var styleColumnHtml = "<select id='default_style_column'>"
	col_names.forEach(function(column) {
		styleColumnHtml += "<option value='" + column + "'>" + column + "</option>"
	})
	styleColumnHtml += "</select>";

	var detailsHtml = "<table id='metadata_table'>"
					+ "<tr><td>Default Styling Column</td><td>" + styleColumnHtml + "</td></tr>"
					+ "<tr><td>Layer Name</td><td><input/></td></tr>"
					+ "<tr><td>Layer Description</td><td><textarea style='width:100%' rows='5' cols='50'></textarea></td></tr>"
					+ "<tr><td>Contributor</td><td><input/></td></tr>"
					+ "<tr><td>Attribution</td><td><input/></td></tr>"
					+ "<tr><td>License</td><td>"
					+   getLicenseSelector()
					+ "</td></tr>"
					+ "<tr><td>Data Curation Date</td><td><input id='curation_date_picker'></td></tr>"
					+ "<table>"
	//html += "<label>Default styling column   </label>" + styleColumnHtml;
	html += detailsHtml
	html += "</div>"
	document.getElementById('shape-file-data').insertAdjacentHTML('beforeend', html);

	// add date picker on curation date picker element
	var maxDate = new Date(); // current date
	var yearRange = [1800, maxDate.getFullYear()];
	var picker = new Pikaday({
			field: document.getElementById('curation_date_picker'),
			maxDate: maxDate,
			yearRange: yearRange
		});
	addSubmitButton()
}

function addSubmitButton() {
	var html =  "<button id='shape_submit_btn' class='submit-btn' onClick='uploadFiles()'>Upload</button>";
	document.getElementById('shape-file-data').insertAdjacentHTML('beforeend', html);
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

function handleFileSelect(callback) {
	var shpFiles = document.getElementById('inputShpFiles').files; // FileList object
	var dbfFiles = document.getElementById('inputDbfFiles').files;
	if (shpFiles.length === 0) {
		alert ('Please select a shape file.');
		return false;
	}
	if (dbfFiles.length === 0) {
		alert ('Please select a dbf file');
		return false;
	}

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

function createDataTable(source, callback) {
	var fixed_col_html = getFixedColumnHTML();
	var row_count = 0;
	var table_html = "<table>";

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
			if (!result1.done && row_count < MAX_ROW_COUNT)
				source.read().then(addRow);
			else {
				table_html += getAdditionalRows(col_names);
				table_html += "</table>"
				console.log('finished creating table');
				document.getElementById('dbf-data-table').innerHTML = "<div>"
																	//+ fixed_col_html
																	+ "</div>"
																	+ "<div>"
																	+ table_html
																	+ "</div>";
				callback(col_names);
			}
		}

		addRow(result);
	})
	return;
}

function getAdditionalRows(columns) {
	// add radio button row to select title column
	var html = "<tr>"
	columns.forEach(function(col) {
		html += "<td style='text-align:center'><input type='radio' name='titleColumn' value='" + col + "'></td>"
	})
	html += "</tr>"

	// add checkbox row to select summary columns
	html += "<tr>"
	columns.forEach(function(col) {
		html += "<td style='text-align:center'><input type='checkbox' name='summaryColumn' value='" + col + "'></td>"
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
	var meta_table = document.getElementById('metadata_table');
	var num_rows = meta_table.rows.length;
	for (var i = 0; i < num_rows; i++) {
		var objCells = meta_table.rows[i].cells[1].children[0];
		console.log(objCells.value);
	}
}

export default {
	init: init
}

window.handleFileSelect      		=handleFileSelect
window.setDataUploadType			=setDataUploadType
window.displayShapeDataForm			=displayShapeDataForm
window.uploadFiles					=uploadFiles
