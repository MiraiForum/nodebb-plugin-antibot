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
				if (!$('meta[name=antibot_client_key]')
						.prop('content')) {
						return;
				}
				window.showCaptcha = function () {
						grecaptcha.render('captcha_send_post', {
								'sitekey': $('meta[name=antibot_client_key]')
										.prop('content'),
								'theme': 'light',
								'callback': window.finish_captcha,
						});
				};

				require(['hooks', 'bootbox'], (hooks, bootbox) => {
						hooks.on('filter:api.options', (data) => {
								//method: "post"
								// url: "/api/v3/topics"
								if (!checkHooks(data.options.method, data.options.url)) {
										return data;
								}
								bootbox.dialog({
										title: '需要完成验证码',
										message: `<script src="https://www.recaptcha.net/recaptcha/api.js?onload=showCaptcha"></script>
            <div id="captcha_send_post"></div>`,
										closeButton: false,
										buttons: {
												cancel: {
														label: '取消',
														className: 'btn-danger',
														callback: function () {
																window.finish_captcha(undefined);
														}
												}
										},
								});
								return new Promise((resolve, reject) => {
										window.finish_captcha = function (x) {
												if (x !== undefined) {
														resolve(x);
												}
												reject();
												bootbox.hideAll();
										};
								}).then((r) => {
										data.options.headers['x-captcha-token'] = r;
										return data;
								})
										.catch(() => {
												console.log('验证码被取消');
												return data;
										});

						});
				});
		});
