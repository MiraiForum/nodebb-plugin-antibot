'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const controllers = require('./lib/controllers');
const settings = require.main.require('./src/meta/settings');
const routeHelpers = require.main.require('./src/routes/helpers');
const request = require('request');
const user = require.main.require('./src/user');
const plugin = {};

let plugin_data = {};

function checkSwitch() {
		if (plugin_data.switch !== 'on') {
				return false;
		}
		if (plugin_data.server_key === undefined) {
				return false;
		}
		if (plugin_data.client_key === undefined) {
				return false;
		}
		return true;

}

async function checkToken(token) {
		return new Promise((resolve) => {
				request.post('https://www.recaptcha.net/recaptcha/api/siteverify',
						{
								form: {
										secret: plugin_data.server_key,
										response: token
								}
						}, (err, rsp, body) => {
								if (rsp.statusCode === 200) {
										let data = JSON.parse(body);
										if (data.success) {
												resolve(true);
										}
										resolve(false);
								}
								resolve(false);
						});
		});
}

plugin.init = async (params) => {
		const {
				router,
				middleware/* , controllers */
		} = params;
		routeHelpers.setupAdminPageRoute(router, '/admin/plugins/antibot', middleware, [], controllers.renderAdminPage);
		plugin_data = await settings.get('antibot');
};

plugin.addAdminNavigation = (header) => {
		header.plugins.push({
				route: '/plugins/antibot',
				icon: 'fa-tint',
				name: 'AntiBot',
		});

		return header;
};

plugin.hookFooter = (data) => {
		if (!checkSwitch()) {
				return data;
		}
		let { templateValues } = data;
		templateValues._header.tags.meta.push({
				name: 'antibot_client_key',
				content: plugin_data.client_key
		});

		return data;
};

plugin.postCreate = async function (res) {
		if (!checkSwitch()) {
				return res;
		}
		let { data } = res;
		let reputation = user.getUsersFields(data.req.uid, ["reputation"])
		if (reputation > 5) {
			return res;
		}
		let token = data.req.headers["x-captcha-token"];
		if (token === undefined) {
				throw new Error('请完成验证码');
		}
		if (await checkToken(token)) {
				return res;
		}
		throw new Error('验证失败');
};
module.exports = plugin;
