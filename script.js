$(document).ready(function() {
	
	var _URLbase = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=";
	
	var initiate = function() {
        
        $('#search-form').submit(doSearch);
        $('[name=search-term]').keyup(showSuggestions);
    };
	
	var doSearch = function(e) {
		
		e.preventDefault();
		
		var term = $('[name=search-term]').val();
		var searchTerm = $('[name=search-term]').val();
		var fullSearch = _URLbase + searchTerm;
		
		$.get(fullSearch, function(responseData) {
			var searchResult = cleanResponse(responseData);
			
			if (searchResult.length > 0) {
				$(".results-list").prepend("<li class='result-item'>" + searchResult[0] + "</li>");
			};
			
		}, 'json');
		
	};
	
	var showSuggestions = function() {
		
		var searchInput = $('[name=search-term]');
		var fullSearch = _URLbase + searchInput.val();
		
		$.get(fullSearch, function(responseData) {
			var searchResult = cleanResponse(responseData);
			var suggestionsList = $('.suggestions-list');
			
			$('.search-suggestions').removeClass('hidden');
			suggestionsList.html('');
			
			if(searchResult.length > 0)	{
				
				//Print each result term and make them on click populate the input field.
				$.each(searchResult, function(i, term) {
					suggestionsList.append("<li class='suggestions-item'>" + term + "</li>");
				});
				
				suggestionsList.children().click(function() {
					searchInput.val($(this).text());
					$('.search-suggestions').addClass('hidden');
				});
			}
			
			else {
				suggestionsList.append("<li class='suggestions-item'>No matching articles</li>");
			};
			
		}, 'json');
	};
	
	var cleanResponse = function(responseData) {
		var resultsArray = responseData[1];
		return resultsArray;
	};
	
	initiate();
	
});
