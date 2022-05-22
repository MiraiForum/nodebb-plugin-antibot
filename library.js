'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const controllers = require('./lib/controllers');
const settings = require.main.require('./src/meta/settings');
const routeHelpers = require.main.require('./src/routes/helpers');
const privsGlobal = require.main.require("./src/privileges/global")
const request = require('request');
const plugin = {};

let plugin_data = {};

const hooks = [{
		method: 'post',
		url: '/api/v3/topics'
}];

function checkHooks(method, url) {
		if (method) {
				for (const i in hooks) {
						if (method === hooks[i].method && url.startsWith(hooks[i].url)) {
								return true;
						}
				}
		}
		return false;
}


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

plugin.reqHook = async function(data){
		if (!checkSwitch()) {
				return data;
		}
		let {req} = data;

		if (req.isAuthenticated() && await privsGlobal.can("antibot:skip",req.user.uid)){
			return data;
		}
		let method = req.method.toLowerCase()
		let url = req.baseUrl
		if (checkHooks(method,url)){
				let token = data.req.headers["x-captcha-token"];
				if (await checkToken(token)) {
						return data;
				}
				throw new Error('验证失败');
		}

}

plugin.globalPrivileges = async function(data){
		let {privileges} = data;
		privileges.set("antibot:skip", { label:  "允许跳过验证码"})
		return data;
}

module.exports = plugin;
