// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

//Takes in a Zuora data format, and returns a readable date string
function formatZDate(dateStr){
	//2012-06-01T00:00:00.000-08:00
	return dateStr.substr(5,2) + ' / ' + dateStr.substr(8,2) + ' / ' + dateStr.substr(0,4);
}

//Logs an error to the console
function addError(emsg){
	console.log(emsg);
}