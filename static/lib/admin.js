'use strict';

/*
	This file is located in the "modules" block of plugin.json
	It is only loaded when the user navigates to /admin/plugins/quickstart page
	It is not bundled into the min file that is served on the first load of the page.
*/
define('admin/plugins/antibot', [
		'settings', 'uploader', 'alerts',
], function (settings, uploader, alerts) {
		let ACP = {};

		ACP.init = function () {

				settings.load('antibot', $('.antibot-settings'));
				$('#save')
						.on('click', saveSettings);
		};

		function saveSettings() {
				settings.save('antibot', $('.antibot-settings'), function () {
						alerts.alert({
								type: 'success',
								alert_id: 'quickstart-saved',
								title: '保存成功',
								message: '重启后生效',
								clickfn: function () {
										socket.emit('admin.reload');
								},
						});
				});
		}
		return ACP;
});
