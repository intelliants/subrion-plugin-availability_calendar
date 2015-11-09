$(function() {
	var aUrl = intelli.config.ia_url + 'availability/'; 
	// here's some magic to make sure the dates are happening this month.
	var clickedDay = '';

	var eventArray = [];
	var monthsRendered = [];

	var clndrTemplate = "<div class='clndr-controls'>" +
		"<div class='clndr-control-button'><span class='clndr-previous-button btn btn-sm btn-primary'><span class='fa fa-chevron-left'></span></span></div><div class='month'><%= month %> <%= year %></div><div class='clndr-control-button rightalign'><span class='clndr-next-button btn btn-sm btn-primary'><span class='fa fa-chevron-right'></span></span></div>" +
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
		}
	});
});

