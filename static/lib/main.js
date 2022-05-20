'use strict';


const checkHooks = (method, url) => {
		const hooks = [{
				method: 'post',
				url: '/api/v3/topics'
		}];
		if (method) {
				for (const i in hooks) {
						if (method === hooks[i].method && url.startsWith(hooks[i].url)) {
								return true;
						}
				}
		}
		return false;
};


$(document)
		.ready(function () {
				if (grecaptcha === undefined) {
						return;
				}
				grecaptcha.enterprise.ready(function () {
						$('.grecaptcha-badge')
								.css('visibility', 'hidden');

				});
				require(['hooks', 'toaster'], (hooks, toaster) => {
						hooks.on('filter:api.options', (data) => {
								//method: "post"
								// url: "/api/v3/topics"
								if (!checkHooks(data.options.method, data.options.url)) {
										return data;
								}

								return new Promise((resolve, reject) => {
										toaster.info("正在验证.....")
										grecaptcha.enterprise.execute({ action: 'send_post' })
												.then(function (token) {
														resolve(token);
												});
								}).then((r) => {
										data.options.headers['x-captcha-token'] = r;
										return data;
								})
						});
				});
		});
