<?php
/******************************************************************************
 *
 * Subrion - open source content management system
 * Copyright (C) 2016 Intelliants, LLC <http://www.intelliants.com>
 *
 * This file is part of Subrion.
 *
 * Subrion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Subrion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Subrion. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @link http://www.subrion.org/
 *
 ******************************************************************************/

if ($iaView->getRequestType() == iaView::REQUEST_JSON)
{
	$iaDb->setTable('availability_calendar');
	switch ($pageAction)
	{
		case iaCore::ACTION_ADD:
			$out = array('message' => '', 'error' => true);

			$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
			$data = array(
				'date' => isset($_POST['date']) && isset($_POST['date']) ? $_POST['date'] : 0,
				'description' => isset($_POST['description']) ? strip_tags(iaSanitize::sql($_POST['description'])) : '',
				'item' => isset($_POST['item']) ? iaSanitize::sql($_POST['item']) : '',
				'item_id' => isset($_POST['item_id']) ? (int)$_POST['item_id'] : 0,
				'member_id' => $_SESSION['user']['id'],
				'status' => 'busy'
			);

			// $member_id = $iaDb->one('`member_id`', "`id` = " . $data['item_id'], $data['item']);

			// if (!$member_id)
			// {
			// 	$out['message'] = iaLanguage::get('av_unknown_item');
			// }
			// elseif ($member_id != $_SESSION['user']['id'])
			// {
			// 	$out['message'] = iaLanguage::get('av_not_your_item');
			// }

			if (!$id)
			{
				if ($iaDb->insert($data))
				{
					$out['message'] = iaLanguage::get('av_saved');
					$out['error'] = false;
				}
				else
				{
					$out['message'] = iaLanguage::get('av_error_saving');
				}
			}
			// else
			// {
			// 	$data['id'] = $id;
			// 	if ($iaDb->update($data) !== false)
			// 	{
			// 		$out['success'] = true;
			// 		$out['message'] = iaLanguage::get('av_saved');
			// 		$out['error'] = false;
			// 	}
			// 	else
			// 	{
			// 		$out['message'] = iaLanguage::get('av_error_saving');
			// 	}
			// }

			if ($out['error'] === false)
			{
				unset($out['error']);
			}
			$iaView->assign($out);

			break;

		case iaCore::ACTION_DELETE:
			$out = array('message' => iaLanguage::get('unknown_error'), 'error' => true);

			$item_id = isset($_POST['item_id']) ? (int)$_POST['item_id'] : 0;
			$item = isset($_POST['item']) ? iaSanitize::sql($_POST['item']) : 0;
			$date = isset($_POST['date']) ? $_POST['date'] : 0;

			// $member_id = $iaDb->one('`member_id`', "`id` = " . $data['item_id'], $data['item']);

			// if (!$member_id)
			// {
			// 	$out['message'] = iaLanguage::get('av_unknown_item');
			// }
			// elseif ($member_id != $_SESSION['user']['id'])
			// {
			// 	$out['message'] = iaLanguage::get('av_not_your_item');
			// }

			$iaDb->delete("`item` = '{$item}' AND `item_id` = '{$item_id}' AND `date` = '{$date}'");

			$out['message'] = iaLanguage::get('av_deleted');
			$out['error'] = false;

			$iaView->assign($out);

			break;

		case iaCore::ACTION_READ:
			$item = isset($_GET['item']) ? iaSanitize::sql($_GET['item']) : false;
			$itemId = isset($_GET['item_id']) ? (int)$_GET['item_id'] : false;
			$month = isset($_GET['month']) ? $_GET['month'] : false;

			$where = '1';

			if ($item && $itemId)
			{
				$where = "`item` = '{$item}' AND `item_id` = '{$itemId}'";
			}
			if ($month)
			{
				$where .= " AND DATE_FORMAT(`date`, '%Y-%m') = '" . $month . "'";
			}

			$out = $iaDb->all(iaDb::ALL_COLUMNS_SELECTION, $where);

			$iaView->assign($out);

			break;
	}

	$iaDb->resetTable();
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~