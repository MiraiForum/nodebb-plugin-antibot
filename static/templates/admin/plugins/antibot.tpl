<form role="form" class="antibot-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
				反机器人插件设置，本插件使用reCaptcha对更改操作进行验证。可以在权限设置里更改每个组的权限
			</p>

			<div class="checkbox">
				<label for="setting-switch" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="setting-switch" name="switch">
					<span class="mdl-switch__label"><strong>全局开关</strong></span>
				</label>
			</div>

			<div class="form-group">
				<label for="client_key">网页密钥</label>
				<input type="text" id="client_key" name="client_key" title="网页密钥" class="form-control" placeholder="xxxxx">
			</div>
			<div class="form-group">
				<label for="server_key">服务器密钥</label>
				<input type="text" id="server_key" name="server_key" title="服务器密钥" class="form-control" placeholder="xxxx">
			</div>
		</div>
	</div>


</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
