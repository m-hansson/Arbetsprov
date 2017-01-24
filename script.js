$(document).ready(function() {
	
	var _URLbase = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=";
	var searchInput;
	var searchSuggestions;
	var submitButton;
	
	var initiate = function() {
		
        searchInput = $('[name=search-term]');
		searchSuggestions = $('.search-suggestions');
		submitButton = $('#search-form [type=submit]');
		
        $('#search-form').submit(doSearch);
        searchInput.keyup(showSuggestions);
		$('#search-form .search-icon').click( function() {
			submitButton.click();
		});
		$(document).keypress(function(e) {
			if (e.which == 13) {
				submitButton.click();
			};
		});
		
		
		//Hide search suggestions after input loses focus. Slight delay so that suggestions are clickable.
		searchInput.blur(function() { setTimeout(function(){ 
			searchSuggestions.addClass('hidden');
		}, 100); });

    };
	
	var doSearch = function(e) {
		
		e.preventDefault();
		searchSuggestions.addClass('hidden');
		
		var searchTerm = searchInput.val();
		var fullSearch = _URLbase + searchTerm;
		
		if (searchTerm == "") {
			return;
		};
		
		$.get(fullSearch, function(responseData) {
			var searchResult = cleanResponse(responseData);
			var timestamp = getTimestamp();
			if (searchResult.length > 0) {
				
				//Print item and add remove functionality to button
				var newItem = "<li class='result-item'>" + "<span class='result-term'>" + searchResult[0] + "</span>" + "<span class='timestamp'>" + timestamp + "</span>" + "<span class='icon-font remove' title='Delete search'></span></li>";
				$(".results-list").prepend(newItem);
				$(".results-list").find('.remove').first().click(function() {
					$(this).parent().remove();
				});
				
			};
			
		}, 'json');
		
		searchInput.val('');
		
	};
	
	var showSuggestions = function() {
		
		var searchTerm = searchInput.val();
		if (searchTerm == "") {
			return;
		};
		
		var fullSearch = _URLbase + searchTerm;
		
		$.get(fullSearch, function(responseData) {
			var searchResult = cleanResponse(responseData);
			var suggestionsList = $('.suggestions-list');
			
			searchSuggestions.removeClass('hidden');
			suggestionsList.html('');
			
			if(searchResult.length > 0)	{
				
				//Print each result term, make them populate the input field on click
				$.each(searchResult, function(i, term) {
					suggestionsList.append("<li class='suggestions-item'>" + term + "</li>");
				});
				
				suggestionsList.children().click(function() {
					searchInput.val($(this).text());
					searchSuggestions.addClass('hidden');
				});
				
			}
			
			else {
				suggestionsList.append("<li class='suggestions-item'>No matching articles</li>");
			};
			
		}, 'json');
	};
	
	var getTimestamp = function() {
		var now = new Date();
		var month = now.getMonth() + 1;
		var minute = now.getMinutes();
		if (minute < 10) {
			minute = '0' + minute;
		};
		var timestamp = now.getFullYear() + '-' + month + '-' + now.getDate() + ' ' + now.getHours() + ':' + minute;
		return timestamp;
	};
	
	var cleanResponse = function(responseData) {
		var resultsArray = responseData[1];
		return resultsArray;
	};
	
	initiate();
	
});
