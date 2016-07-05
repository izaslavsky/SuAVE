
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
	var DLength;
	var collection = {};
	var shapeData=[];
	var colorData=[];
	var SID;

//memory settings
var cMemory = false;
var sMemory = false;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });
	$('#btn-update').click(function(){ window.open('/update', "_self"); });

//handle new survey
	$('#btn-addNew').click(function(){$('.modal-new-survey').modal('show'); });

//set listener on buttons
	$(document).on('click', '#select-about-submit', function(){
		window.frames[0].frameElement.contentWindow.getCode(function(data){

			$.ajax({
				url: "/changeAboutFileByID",
				type: "POST",
				data: {"name" : surveys[SID].name, "user": user,
					"data": data},
				success: function(code){
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		});

	});

	$(document).on('click', '#select-icons', function(){
		$('.surveys-edit').click();
	});

	$(document).on('click', '#select-about', function(){
		$('.modal-select-collection').empty();
		$('.modal-select-collection').css("width", "800px");
		$('.modal-select-collection').append('<div class="modal-header">'+
		' <button data-dismiss="modal" class="close">x</button> '+
		'<div class="container"> <div style="padding-left:90px;" class="row"> '+
		'<div class="col-xs-2">'+
		' <button id="select-icons" style="width:100%;" class="btn btn btn-default">View Options</button>'+
		' </div> <div class="col-xs-2"> '+
		'<button id="select-about" style="width:100%;" class="btn btn btn-default">Describe Survey</button> '+
		' </div> <div class="col-xs-2"> '+
		'<button id="select-reupload" style="width:100%;" class="btn btn btn-default">Reupload Data</button> '+
		'</div>  </div> </div> <iframe height="450px" width="100%" src="/editor.html" id="editorFrame">'+
		'</iframe><button id="select-about-submit" data-dismiss="modal" class="btn btn-raised btn-info">submit</button></div>');
	});

	$(document).on('click', '#select-reupload', function(){
		$('.modal-select-collection').modal('show');
		$('.modal-select-collection').css("width", "560px");
		$('.modal-select-collection').empty();
		//upload file
		$('.modal-select-collection').append('<div class="modal-header"> <button data-dismiss="modal" class="close">x</button>'+
		' <div class="container"> <div style="padding-left:30px;" class="row"> '+
		'<div class="col-xs-1" style="margin-right:5%;"> <button id="select-icons"  class="btn btn btn-default">View Options</button> </div>'+
		'<div class="col-xs-1" style="margin-right:5%;"> <button id="select-about"  class="btn btn btn-default">Describe Survey</button> </div> '+
		'<div class="col-xs-1" style="margin-right:5%;"> <button id="select-reupload"  class="btn btn btn-default">Reupload Data</button> </div>'+
		'</div> </div> </div> '+
		'<div class="modal-body"> <h3>Select a new csv file to upload:</h3> '+
		'<form id="replace-survey" action="/replaceCSV" method="POST" enctype="multipart/form-data"> '+
		'<hr/> <fieldset> <div class="control-group"> <input type="file" name="file" required="required"/> </div>'+
		'<div class="form-buttons"> <button id="replace-survey-submit" type="submit" class="btn btn-raised btn-info">'+
		'submit</button> </div> </fieldset> </form> </div>');

		$('#replace-survey').ajaxForm({
			data: surveys[SID],
			beforeSubmit : function(formData, jqForm, options){
				$('.modal-loading').modal({ show : false, keyboard : false, backdrop : 'static' });
				$('.modal-loading .modal-body h3').html('Loading....');
				$('.modal-loading').modal('show');
				return true;
			},
			success	: function(responseText, status, xhr, $form){
				$('.modal-loading').modal('hide');
				$('.modal-select-collection').modal('hide');
			},
			error : function(e){

			}
		});
	});

	window.editorFrameLoaded = function (){
		$.ajax({
			url: "/getAboutFileByID",
			type: "GET",
			data: {"name" : surveys[SID].name, "user": user},
			success: function(code){
				window.frames[0].frameElement.contentWindow.setCode(code);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	var prepSetting = function(survey){
		var c = JSON.parse(survey.collection);
		if( c.sColumn != undefined && c.sColumn != '|^'){
			sMemory = true;
			$('#column-select-1 option[value='+c.sColumn+']').prop('selected', true);
			$('#collect-select option[value='+c.name+']').prop('selected', true);
			collection['sColumn'] = parseInt($('#column-select-1').find(':selected').val());
			that.fetchColVal($('#column-select-1').find(':selected').text(),
					$('#collect-select').find(':selected').val());
		}
		if( c.cColumn != undefined && c.cColumn != '|^'){
			cMemory = true;
			$('#column-select-2 option[value='+c.cColumn+']').prop('selected', true);
			collection['cColumn'] = parseInt($('#column-select-2').find(':selected').val());
			that.fetchColVal($('#column-select-2').find(':selected').text(), "");
		}
		if(c.iName){
			$('#column-select-3 option[value='+c.iName+']').prop('selected', true);
		}

	};

	$(document).on('click', '.surveys-edit', function(){
		$('.modal-select-collection').modal('show');
		$('.modal-select-collection').css("width", "560px");

		$('.modal-select-collection').empty();
		//insert collection selections
		$('.modal-select-collection').append('<div class="modal-header"> <button data-dismiss="modal" class="close">x</button>'+
		' <div class="container"> <div style="padding-left:30px;" class="row"> '+
		'<div class="col-xs-1" style="margin-right:5%;"> <button id="select-icons"  class="btn btn btn-default">View Options</button> </div>'+
		' <div class="col-xs-1" style="margin-right:5%;"> <button id="select-about"  class="btn btn btn-default">Describe Survey</button> </div> '+
		'<div class="col-xs-1" style="margin-right:5%;"> <button id="select-reupload"  class="btn btn btn-default">Reupload Data</button> </div>'+
		'</div> </div> </div> <div class="modal-body"> <p>Public View Options:</p> <div id="pv-views" class="container"></div> '+
		'<div class="container"> <div class="row"> '+
		'<div class="col-xs-3">'+
		'<p class="subheading">Select a field to associate with shapes:</p> <select id="column-select-1"></select> </div> '+
		'<div class="col-xs-3"> <p class="subheading">Select a shape collection:</p> '+
		'<select id="collect-select"> <option selected="" disabled="" hidden=""></option> <option value="gender">Gender</option>'+
		'<option value="object">Object</option> </select> </div> '+
		'</div></div> '+
		'<div id="column-collect-shape" class="container"></div> <hr/> <div class="container"> <div class="row"> '+
		'<div class="col-xs-3"> <p class="subheading">Select a field to associate with colors:</p> <select id="column-select-2">'+
		'</select> </div> </div> </div> <div id="column-collect-color" class="container"></div>'+
		'<hr/> <div class="container"> <div class="row"> '+
		'<div class="col-xs-3"> <p class="subheading">Select a field to associate with item names:</p> <select id="column-select-3">'+
		'</select> </div> </div> </div>'+
		' <div class="form-buttons"> '+
		'<button id="select-collection-submit" data-dismiss="modal" class="btn btn-raised btn-info">submit</button> </div> </div>');

		var id = $(this).attr("id");
		var i = id.slice(-1);
		SID = i;
		var survey = surveys[i];
		collection = {};
		//insert views checkboxes
		$('#pv-views').empty();
		$('#pv-views').append(
			'<div class="row" ><div class="col-xs-2"><input id="pv-grid" class="checkbox-custom"  type="checkbox">'+
			'<label for="pv-grid" class="checkbox-custom-label">Grid</label></div>'+
			'<div class="col-xs-2"><input id="pv-bucket" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-bucket" class="checkbox-custom-label">Bucket</label></div>'+
			'<div class="col-xs-2"> <input id="pv-crosstab" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-crosstab" class="checkbox-custom-label">Crosstab</label></div></div><div class="row">'+
			'<div class="col-xs-2"> <input id="pv-qca" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-qca" class="checkbox-custom-label">QCA</label></div>'+
			'<div class="col-xs-2"> <input id="pv-map" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-map" class="checkbox-custom-label">Map</label> </div>'+
			'<div class="col-xs-2"><input id="pv-r" class="checkbox-custom" type="checkbox">'+
			'<label for="pv-r" class="checkbox-custom-label">R</label></div></div>'
		);
		var views = survey.views.toString();
		if(views[0] == '1') $("#pv-grid").prop("checked", true);
    if(views[1] == '1') $("#pv-bucket").prop("checked", true);
    if(views[2] == '1') $("#pv-crosstab").prop("checked", true);
    if(views[3] == '1') $("#pv-qca").prop("checked", true);
    if(views[4] == '1') $("#pv-map").prop("checked", true);
		if(views[5] == '1') $("#pv-r").prop("checked", true);
		$('#column-select-1').empty();
		$('#column-select-2').empty();
		$('#column-select-3').empty();
		$('#collect-select').prop("selected", false);
		$('#column-collect-shape').empty();
		//get Columns
		$.ajax({
			url: "/getSurveyColumnsNCollection",
			type: "POST",
			data: {"name" : survey.name, "user": user},
			success: function(data){
				var column = data;
				$("#column-select-1").append($("<option selected disabled hidden></option>").html(""));
				$("#column-select-2").append($("<option selected disabled hidden></option>").html(""));
				$("#column-select-3").append($("<option selected disabled hidden></option>").html(""));
				for(var i = 0; i < column.length; i++){
					$("#column-select-1").append($("<option></option>").val(i).html(column[i]));
					$("#column-select-2").append($("<option></option>").val(i).html(column[i]));
					$("#column-select-3").append($("<option></option>").val(i).html(column[i]));
				}
				if (survey.collection.name != 'default') {
					prepSetting(survey);
				}
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	});

	$(document).on('change', '#collect-select', function(){
    var collectVal = $(this).find(':selected').val();
    var columnVal = $('#column-select-1').find(':selected').text();

    if(columnVal.length > 0){
			collection['sColumn'] = parseInt($('#column-select-1').find(':selected').val());
      that.fetchColVal(columnVal, collectVal);
    }

	});

	$(document).on('change', "#column-select-1", function(){
    var columnVal = $(this).find(':selected').text();
    var collectVal = $('#collect-select').find(':selected').val();

    if(collectVal.length > 0){
			collection['sColumn'] = parseInt($('#column-select-1').find(':selected').val());
    	that.fetchColVal(columnVal, collectVal);
    }
	});

	$(document).on('change', "#column-select-2", function(){
		var columnVal = $(this).find(':selected').text();
		collection['cColumn'] = parseInt($('#column-select-2').find(':selected').val());
		that.fetchColVal(columnVal, "");
	});

	$(document).on('click', '#select-collection-submit', function(){

		if($('#collect-select').find(':selected').val() != '' &&
	 				$('#column-select-1').find(':selected').val() != ''){
			for(var i = 0; i < shapeData.length; i++){
				var shape = $('#collect-drop-'+i+' .dd-selected-value').val();
				shapeData[i] = shapeData[i].toLowerCase();
				if(shapeData[i] == ''){
					shapeData[i] = '|^';
				}
				if(shape == '0'){
						collection.sValues[shapeData[i]] = '';
				}else{
						collection.sValues[shapeData[i]] = shape;
				}
			}
		}else{
			collection["sColumn"] = "|^";
		}

		if($('#column-select-2').find(':selected').val() != ''){
			for(var i = 0; i < colorData.length; i++){
				var color = $('#color-drop-'+i+' .dd-selected-value').val();
				colorData[i] = colorData[i].toLowerCase();
				if(colorData[i] == ''){
					colorData[i] = '|^';
				}
				if(color == '0') {
					collection.cValues[colorData[i]] = '';
				}else{
					collection.cValues[colorData[i]] = color;
				}
			}
		}else{
			collection["cColumn"] = "|^";
		}

		var iName = $('#column-select-3').find(':selected').val();
		collection.iName = iName;

		if(collection["cColumn"] != "|^" || collection["sColumn"] != "|^"){
			$.ajax({
				url: "/changeCollection",
				type: "POST",
				data: {"name" : surveys[SID].name, "user": user, "collection": JSON.stringify(collection)},
				success: function(data){
					if(iName != ''){
						changeIname();
					}
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}else if(iName != ''){
			changeIname();
		}

		var views = "";
		//change view options
		if($("#pv-grid").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-bucket").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-crosstab").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-qca").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-map").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}
		if($("#pv-r").is(':checked')){
			views += 1;
		}else{
			views += 0;
		}

		$.ajax({
			url: "/changeViewOptions",
			type: "POST",
			data: {"name" : surveys[SID].name, "user": user, "views": parseInt(views)},
			success: function(data){
				surveys[SID].views = parseInt(views);
				if(iName == '') setTimeout(function(){window.location.href = '/';}, 500);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

		$('.modal-loading').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-loading .modal-body h3').html('Loading....');
		$('.modal-loading').modal('show');

	});

	//deal with asynchronized problem.
	//if two API calls both request write into csv file
	var changeIname = function(){
		var iName = $('#column-select-3').find(':selected').val();

		$.ajax({
			url: "/changeCollectionItemName",
			type: "POST",
			data: {"name" : surveys[SID].name, "iName": iName},
			success: function(data){
				setTimeout(function(){window.location.href = '/';}, 300);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	};

	$(document).on('click', '.toggle-button', function() {
		$(this).toggleClass('toggle-button-selected');
		var id = $(this).attr("id");
		var survey = surveys[id.slice(-1)];

		$.ajax({
			url: "/hideSurveyByNameID",
			type: "POST",
			data: {"name" : survey.name, "user": user},
			success: function(data){
				//setTimeout(function(){window.location.href = '/';}, 3000);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	});

	$(document).on('click', '.view-button', function() {
		var id = $(this).attr("id");
		var survey = surveys[id.slice(-1)];
		var view = id.substring(0, id.length-2);

		if(view == survey.view) return;
		surveys[id.slice(-1)].view = view;

		$.ajax({
			url: "/changeViewByNameID",
			type: "POST",
			data: {"name" : survey.name, "user": user, "view": view},
			success: function(data){
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	});

	//when "show" button is clicked
	$(document).on('click', '.surveys-click', function(){
		var id = $(this).attr('id');
		var survey = surveys[id.slice(-1)];
		var file = survey.name;
		//Grid, bucket, crosstab, QGA, map
		window.open(window.location+'/../main.html?file='+user+"_"+file+'.csv'+
			"&views="+survey.views+"&view="+survey.view);
	});

	$(document).on('click', '.surveys-delete', function(){
		var id = $(this).attr('id');
		var file = surveys[id.slice(-1)].name;

		var that = this;
		$.ajax({
			url: "/deleteSurvey",
			type: "POST",
			data: {"name" : file, "user": user},
			success: function(data){
				$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
				$('.modal-alert .modal-header h3').text('Success!');
				$('.modal-alert .modal-body p').html('Successfully deleted the survey.<br>Redirecting you back to the homepage.');
				$('.modal-alert').modal('show');
				$('.modal-alert button').click(function(){window.location.href = '/';})
				setTimeout(function(){window.location.href = '/';}, 3000);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	});

	this.fetchColVal = function(columnVal, collectVal){
		var columnImg;
		var collect;

		if(collectVal == ""){
			$('#column-collect-color').empty();
			collect = colorImg;
		}else{
			$('#column-collect-shape').empty();
			collection['name'] = collectVal;
			if(collectVal == "default" ){
				collect = defaultImg;
			}else if(collectVal == "gender"){
				collect = genderImg;
			}else if(collectVal == "object"){
				collect = objectImg;
			}
		}

		$.ajax({
			url: "/getColumnsOptions",
			type: "POST",
			data: {"name" : surveys[SID].name, "user": user, "column": columnVal},
			success: function(data){
				if(collectVal == ""){
					colorData = data;

					//generate initial collect json
					collection['cValues'] = {};

					columnImg = generateImgJson(data);
					Dlength = data.length;
					$('#column-collect-color').append('<p>Please assign a color to each value:</p>');

					for(var i = 0; i < data.length; i++){
						$('#column-collect-color').append(
							'<div class="row"><div class="col-xs-3"><div id="column-drop2-'+i+'"></div></div>'+
							'<div class="col-xs-3"><div id="color-drop-'+i+'"></div></div></div><p style="line-height: 50%;"></p>');
					}

					var count = 0;
					var defaultIndex = 2;
					var values;
					if (surveys[SID].collection.name != "default"){
						values = JSON.parse(surveys[SID].collection).cValues;
					}
					for(var i = 0; i < data.length; i++){
						//inflate collection dropdown
						$('#column-drop2-'+i).append('<div style="width: 250px;background: '+
						'#eee;position: relative;height: 50px;border: solid 1px #ccc;"> '+
						'<a class="dd-selected"><label class="dd-selected-text" '+
						'style="line-height: 47px;">'+columnImg[i].value+'</label></a> </div>');
						if(values && cMemory){
							var v = [];
							for(var key in values) {
									v.push(values[key]);
							}
							defaultIndex = colorIndex[v[i]];
						}
						else if (count > 31){
							count = 0;
							defaultIndex = 2;
						}


						$('#color-drop-'+i).ddslick({
							data:colorImg,
							defaultSelectedIndex: defaultIndex,
							width:250,
							background: '#ffffff',
							imagePosition:"right"
						});
						defaultIndex++;
						count++;
					}
					cMemory = false;
				}else{
					shapeData = data;
					//generate initial collect json
					collection['sValues'] = {};
					/*
					for(var i = 0; i < data.length; i++){
						collection.sValues[data[i]] = '';
					}*/

					columnImg = generateImgJson(data);
					Dlength = data.length;
					$('#column-collect-shape').append('<p>Please assign a shape to each value:</p>');

					for(var i = 0; i < data.length; i++){
						$('#column-collect-shape').append(
							'<div class="row">'+
							'<div class="col-xs-3"><div id="column-drop-'+i+'"></div></div>'+
							'<div class="col-xs-3"><div id="collect-drop-'+i+'"></div></div></div><p style="line-height: 50%;"></p>');
					}

					var count = 0;
					var defaultIndex = 1;
					var survey;
					var values;
					if (surveys[SID].collection.name != "default"){
						survey = JSON.parse(surveys[SID].collection);
						values = survey.sValues;
					}

					for(var i = 0; i < data.length; i++){

						//inflate collection dropdown
						$('#column-drop-'+i).append('<div style="width: 250px;background: '+
						'#eee;position: relative;height: 50px;border: solid 1px #ccc;"> '+
						'<a class="dd-selected"><label class="dd-selected-text" '+
						'style="line-height: 47px;">'+columnImg[i].value+'</label></a> </div>');
						if(values && sMemory){
							var v = [];
							for(var key in values) {
									v.push(values[key]);
							}
							if(collectVal == "object"){
								defaultIndex = objectIndex[v[i]];
							}else{
								defaultIndex = genderIndex[v[i]];
							}
						}
						else if (count > 8 && collectVal == "object"){
							count = 0;
							defaultIndex = 1;
						}else if (count > 2 && collectVal == "gender"){
							count = 0;
							defaultIndex = 1;
						}

						$('#collect-drop-'+i).ddslick({
							data:collect,
							defaultSelectedIndex: defaultIndex,
							width:250,
							background: '#ffffff',
							imagePosition:"right"
						});

						defaultIndex++;
						count++;
					}
					sMemory = false;
				}
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/logout",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}


	this.getSurveys = function(callback)
	{
		var that = this;
		$.ajax({
			url: "/getSurveys",
			type: "POST",
			data: {"user" : user},
			success: function(data){
				callback(data);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				callback("error");
			}
		});
	}

	this.displaySurveys = function(surveys){
		for(i = 0; i < surveys.length; i++){
			$("#main-container").append('<div class="row carousel-row"><div id="carousel-'+i+'" class="col-xs-8 col-xs-offset-2 slide-row">'+
			'<div class="carousel slide slide-carousel" data-ride="carousel">'+
			'<div class="carousel-inner"><img src="/../img/blue.jpg" alt="Image"></div></div>'+
			'<div class="slide-content"><h2>'+surveys[i].name+'</h2><div class="container"><div class="row" id="row-'+i+'">'
		  +'</div></div></div>');

			var views = surveys[i].views.toString();

			if(views[0] == '1') $('#row-'+i).append(
				'<div class="col-xs-1"><input type="radio" name="radio-'+i+'" id="grid-button-'+i+'" class="radio"/>'+
				'<label id="grid-'+i+'" class="view-button" for="grid-button-'+i+'">Grid</label></div>');
	    if(views[1] == '1') $('#row-'+i).append('<div class="col-xs-1">'+
				'<input type="radio" name="radio-'+i+'" id="bucket-button-'+i+'" class="radio"/><label id="bucket-'+
				i+'" class="view-button" for="bucket-button-'+i+'">Bucket</label></div>');
	    if(views[2] == '1') $('#row-'+i).append('<div class="col-xs-1"> <input type="radio" name="radio-'
			+i+'" id="crosstab-button-'+i+'" class="radio"/>'+
			'<label id="crosstab-'+i+'" class="view-button" for="crosstab-button-'+i+'">Crosstab</label></div>');
	    if(views[4] == '1') $('#row-'+i).append(
				'<div class="col-xs-1"><input type="radio" name="radio-'+i+'" id="map-button-'+i+'" class="radio"/>'+
				'<label id="map-'+i+'" class="view-button" for="map-button-'+i+'">Map</label></div>');

			$("#carousel-"+i).append(
			'<div class="slide-footer"><div id="hidden-button" class="col-xs-1"><h4>Public: </h4></div>'+
			'<div class="toggle-button" id="public-'+i+'"><button ></button></div>'+
			'<span class="pull-right buttons">'+
			'<button id="survey-'+i+'" class="btn btn-raised btn-sm btn btn-raised btn-info surveys-click"><i class="fa fa-fw fa-eye"></i> Show</button>'+
			'<button id="edit-'+i+'" class="btn btn-raised btn-sm btn btn-raised btn-info surveys-edit"><i class="fa fa-map-o"></i> Edit</button>'+
			'<button id="delete-'+i+'" class="btn btn-raised btn-sm btn-info surveys-delete"><i class="fa fa-fw fa-warning"></i> Delete</button>'+
			'</span></div></div></div>'
			);
			if($('#'+surveys[i].view+'-'+i).length == 0){
				$('#'+'grid-'+i).trigger('click');
			}else{
				$('#'+surveys[i].view+'-'+i).trigger("click");
			}
			if(parseInt(surveys[i].hidden) == 0) $("#public-"+i).toggleClass('toggle-button-selected');

		}
	}
	// redirect to homepage on new survey creation
		$('#help-button').click(function(){window.open("https://docs.google.com/document/d/1f4ABDP1YrEU3vRxYkIPHl9dyGTT4w3pqfRNI2Kn97Ic/edit#heading=h.vcpylem4gnc7")});


}
