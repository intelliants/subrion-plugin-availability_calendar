$(function() {
	$('#avcalendar-fieldgroup').insertAfter('.wrap-list .wrap-group:last').show();
	
	var aUrl = intelli.config.admin_url + '/availability/'; 
	// here's some magic to make sure the dates are happening this month.
	var clickedDay = '';

	var eventArray = [];
	var monthsRendered = [];

	var clndrTemplate = "<div class='clndr-controls'>" +
		"<div class='clndr-control-button'><span class='clndr-previous-button btn btn-xs btn-primary'><i class='i-chevron-left'></i></span></div><div class='month'><%= month %> <%= year %></div><div class='clndr-control-button rightalign'><span class='clndr-next-button btn btn-xs btn-primary'><i class='i-chevron-right'></i></span></div>" +
		"</div>" +
	"<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
		"<thead>" +
		"<tr class='header-days'>" +
		"<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
			"<td class='header-day'><%= daysOfTheWeek[i] %></td>" +
		"<% } %>" +
		"</tr>" +
		"</thead>" +
		"<tbody>" +
		"<% for(var i = 0; i < numberOfRows; i++){ %>" +
			"<tr>" +
			"<% for(var j = 0; j < 7; j++){ %>" +
			"<% var d = j + i * 7; %>" +
			"<td class='<%= days[d].classes %>'><div class='day-contents'><%= days[d].day %>" +
			"</div></td>" +
			"<% } %>" +
			"</tr>" +
		"<% } %>" +
		"</tbody>" +
	"</table>";

	avCalendar = $('#avcalendar').clndr({
		template: clndrTemplate,
		events: eventArray,
		clickEvents: {
			click: function(target) {
				clickedDay = target.date._i;
			}
		},
		doneRendering: function() {
			params = {
				item_id: $('#avcalendar').data('item-id'),
				item: $('#avcalendar').data('item'),
				month: this.month.format('YYYY-MM')
			};
			
			tmpThis = this;

			if (-1 == $.inArray(params.month, monthsRendered))
			{
				$.get(aUrl + 'read.json', params, function(data) {
						tmpThis.addEvents(data);
				});

				monthsRendered.push(params.month);
			}
			
			actContainer = $('<div>').addClass('actions-container');
			
			bookBtn = $('<div>').addClass('book btn btn-xs btn-success');
			unbookBtn = $('<div>').addClass('unbook btn btn-xs btn-danger');

			bookIcon = $('<i>').addClass('i-signup');
			unbookIcon = $('<i>').addClass('i-remove-circle');

			bookBtn.append(bookIcon);
			unbookBtn.append(unbookIcon);


			$('#avcalendar .day:not(.adjacent-month)')
			.mouseenter(function() {
				thisDay = this;
				
				actContainer.html('');

				if ($(this).hasClass('event'))
				{
					actContainer.append(unbookBtn);
				}
				else
				{
					actContainer.append(bookBtn);
				}


				$(this).append(actContainer);
			})
			.mouseleave(function() {
				$('.actions-container', this).remove();
			});
		}
	});

	$(document).on('click', '#avcalendar .day .book', function() {
		newEvent = {
			date: clickedDay
			// title: "New event"
		};

		avCalendar.addEvents([newEvent]);

		params = {
			item_id: $('#avcalendar').data('item-id'),
			item: $('#avcalendar').data('item'),
			date: clickedDay
		};
		$.post(aUrl + 'add.json', params);
		intelli.notifFloatBox({msg: _t('saved'), autohide: true});


	});

	$(document).on('click', '#avcalendar .day .unbook', function() {
		allEvents = avCalendar.options.events;

		$.each(allEvents, function(i, v) {
			if (typeof v != undefined && v.date == clickedDay)
			{
				allEvents.splice(i, 1);
				return false;
			}
		});

		avCalendar.setEvents(allEvents);

		params = {
			item_id: $('#avcalendar').data('item-id'),
			item: $('#avcalendar').data('item'),
			date: clickedDay
		};
		$.post(aUrl + 'delete.json', params);
		intelli.notifFloatBox({msg: _t('saved'), autohide: true});
	});
});

