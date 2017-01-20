$(document).ready(function() {
	
	var initiate = function() {
        
        $('#search-submit').click(doSearch);
        
    };
	
	var doSearch = function() {
		$.get('http://www.codecademy.com/', function(responseData) {
			$("#results").text(responseData);
		});
	}
	
	initiate();
	
});