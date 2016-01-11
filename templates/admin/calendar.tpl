{if isset($item.item) && in_array($item.item, explode(',', $core.config.availability_calendar_items_enabled)) && iaCore::ACTION_EDIT == $pageAction}
		<div class="wrap-group" id="avcalendar-fieldgroup" style="display: none;">
			<div class="wrap-group-heading">
				<h4>{lang key='availability_calendar'}</h4>
			</div>

			<div class="inline-calendar" id="avcalendar" data-member="{if isset($member.id)}{$member.id}{/if}"{if isset($item)} data-item="{if isset($item.item)}{$item.item}{/if}" data-item-id="{if isset($id)}{$id}{/if}"{/if}></div>
			<div class="calendar-info">
				<div class="calendar-legend"><div class="day event"></div> {lang key='booked'}</div>
				<div class="calendar-legend"><div class="day today"></div> {lang key='today'}</div>
			</div>
		</div>

		{ia_print_css files='_IA_URL_plugins/availability_calendar/templates/admin/css/style'}
		{ia_add_media files='underscore'}
		{ia_print_js files='_IA_URL_plugins/availability_calendar/js/common/moment, _IA_URL_plugins/availability_calendar/js/common/calendar, _IA_URL_plugins/availability_calendar/js/admin/calendar'}
{/if}