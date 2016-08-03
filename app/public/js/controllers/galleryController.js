
function GalleryController()
{
// bind event listeners to button clicks //
	var that = this;
	$(".page-header").append(" by "+user);

//set listener on buttons
	$(document).on('click', '.surveys-click', function(){
		var id = $(this).attr('id');
		var survey = surveys[id.slice(-1)];
		var file = survey.name;

		window.open(window.location+'/../../main/file='+user+"_"+file+'.csv'+
			"&views="+survey.views+"&view="+survey.view);
	});

	$(document).on('click', '#contact-author', function(){
		$('.modal-contact').modal('toggle');
	});



	this.getSurveys = function(callback)
	{
		var that = this;
		$.ajax({
			url: "/getPublicSurveys",
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

	$(document).on('click', '.file-source', function() {

		var id = $(this).attr("id");
		var survey = surveys[id.slice(-1)];

		window.open("/getSurveys/"+survey.user+"_"+survey.name+".csv", "_blank");

	});

	this.displaySurveys = function(survey){
		var surveys = survey.reverse();

		for(i = 0; i < surveys.length; i++){
			$('#display-surveys').append('<div class="col-md-4"> <div class="panel panel-default">  <div class="tab-content"> <div class="tab-pane fade in active" id="tab1-'+i+'"> </div> '+
			'<div class="tab-pane fade" id="tab2-'+i+'"> </div> '+
			'<div class="tab-pane fade" id="tab3-'+i+'" style="width:100%;"> </div> '+
			'</div></div><!--/.panel--> </div>');

			var dateString = surveys[i].date;

			$('#tab1-'+i).append('<div class="row survey-title"> '+
			'<div class="col-xs-6"><div id="icon-img">'+
			'<button id="survey-'+i+'" type="button" class="btn btn-primary btn-circle surveys-click" style="width:100%;"> show</button> </div></div>'+
			'<div class="col-xs-6 survey-info"><h4 style="text-align:center;">'+surveys[i].name+'</h4>'+
			'<p style="text-align:center;">Created from: </p>'+
			'<a id="source-'+i+'" class="file-source" style="text-align:center;display:block;">'+surveys[i].originalname+'</a>'+
			'<p style="text-align:center;">'+ dateString+'</p>'+
			'</div>'+
			' </div>');

		}

		$('.btn-circle').css("width", $('#icon-img').width());
		$('.btn-circle').css("height", $('#icon-img').width());
		$('.btn-circle').css("border-radius", $('#icon-img').width()/6);
		$('.btn-circle').css("font-size", $('#icon-img').width()/4);
	}
}
