$(document).ready(function() {
	
	var _URLbase = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=";
	var searchInput;
	var searchSuggestions;

	
	var initiate = function() {
		
        searchInput = $('[name=search-term]');
		searchSuggestions = $('.search-suggestions');
		var submitButton = $('#search-form [type=submit]');
		var results;
		
        $('#search-form').submit(doSearch);
        searchInput.keyup(showSuggestions);
		
		$('#search-form .search-icon').click( function() {
			submitButton.click();
		});
		
		$(document).keypress(function(e) {
			if (e.which == 13) {
				console.log(e);
				if (e.target && e.target.className == 'suggestions-item') {
					$(document.activeElement).click();
				}
				else if (e.target && e.target.className == 'remove') {
					$(document.activeElement).click();
				}
				else {
					submitButton.click();
				}
			}
			
		});
		
		//Hide search suggestions after input loses focus. Slight delay so that suggestions are clickable

		searchInput.blur( function(e) { 
			if (!e.relatedTarget || e.relatedTarget.className != 'suggestions-item') {
				setTimeout(function(){ 
					searchSuggestions.addClass('hidden');
				}, 200);
			}
		});
		//searchSuggestions.focusout(function() { console.log('Boop too'); });
		

		$(".results-list").on('DOMNodeInserted', function(e) {
			if($(this).children().length > 0) {
				$(this).removeClass('hidden');
			}
		});

		$(".results-list").on('DOMNodeRemoved', function(e) {
			//Node is removed after this callback therefore length 2
			if($(this).children().length < 2) {
				$(this).addClass('hidden');
			}
		});
		
    };
	
	var doSearch = function(e) {
		
		e.preventDefault();
		searchSuggestions.addClass('hidden');
		
		var searchTerm = searchInput.val();
		var fullSearch = _URLbase + searchTerm;
		
		//TODO: handle malicious input
		
		if (searchTerm == "") {
			return;
		}
		
		$.get(fullSearch, function(responseData) {
			var searchResult = cleanResponse(responseData);
			var timestamp = getTimestamp();
			if (searchResult.length > 0) {
				
				//Print item and add remove functionality to button
				var newItem = "<li class='result-item' tabindex='0'>" +
								"<span class='result-term'>" + searchResult[0] + "</span>" + 
								"<time class='timestamp'>" + timestamp + "</time>" + 
								"<span class='icon-font remove' title='Delete search' role='button' tabindex='0'></span></li>";
				$(".results-list").prepend(newItem);
				$(".results-list").find('.remove').first().click(function() {
					$(this).parent().remove();
				});
				
			}
			
		}, 'json');
		
		searchInput.val('');
		
	};
	
	var showSuggestions = function() {
		
		var searchTerm = searchInput.val();
		if (searchTerm == "") {
			return;
		}
		
		var fullSearch = _URLbase + searchTerm;
		
		$.get(fullSearch, function(responseData) {
			var searchResult = cleanResponse(responseData);
			var suggestionsList = $('.suggestions-list');
			
			searchSuggestions.removeClass('hidden');
			suggestionsList.html('');
			
			if(searchResult.length > 0)	{
				
				//Print each result term, make them populate the input field on click
				$.each(searchResult, function(i, term) {
					suggestionsList.append("<li class='suggestions-item' tabindex='0'>" + term + "</li>");
				});
				
				suggestionsList.children().click(function() {
					searchInput.val($(this).text());
					searchSuggestions.addClass('hidden');
				}).keydown(function(e) {
					//If tab button pressed and child is not last stop propagation. Should be fine, yeah.
					if (e.which == '9' && !e.currentTarget.nextSibling) {
						searchSuggestions.addClass('hidden');
					}
				}).focusout(function(e) {
					if (!e.relatedTarget || e.relatedTarget.className != 'suggestions-item') {
						searchSuggestions.addClass('hidden');
					}
				});
				
			}
			
			else {
				suggestionsList.append("<li class='suggestions-item'>No matching articles</li>");
			}
			
		}, 'json');
	};
	
	var getTimestamp = function() {
		var now = new Date();
		var month = now.getMonth() + 1;
		var minute = now.getMinutes();
		if (minute < 10) {
			minute = '0' + minute;
		}
		var timestamp = now.getFullYear() + '-' + month + '-' + now.getDate() + ' ' + now.getHours() + ':' + minute;
		return timestamp;
	};
	
	var cleanResponse = function(responseData) {
		var resultsArray = responseData[1];
		return resultsArray;
	};
	
	initiate();
	
});
