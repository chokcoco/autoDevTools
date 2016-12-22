(function(name, definition) {
	if (typeof define === 'function') {
		define(definition);
	} else {
		this[name] = definition();
	}
})('autoDevTool', function() {

	function autoDevTool() {
		this._version = '1.0.0';
		this._times = 1;
		this._lastTapTime = null;
		this._container = null;

		this._logContainer = null;

		this._btnFilter = null;
		this._btnClear = null;
		this._btnRefresh = null;
	}

	/**
	 * 创建记录遮罩
	 * @return {*}
	 */
	autoDevTool.prototype._createWrap = function() {
		var body = document.getElementsByTagName('body')[0];

		this._container = document.createElement('div');
		this._container.setAttribute('id', 'dev-tool');
		this._container.style.cssText = "position:fixed;top:70%;bottom:0;left:0;width:100%;box-sizing:border-box;background:rgba(0,0,0,.3);"

		var navDom = '<ul style="height:20px;line-height:20px;display:flex;justify-content:space-around;color:#fff;">' + '<li class="autoDev-filter" id="autoDev-all" style="background-color:#2196f3;flex:1;text-align:center;text-align:center;">All</li>' + '<li class="autoDev-filter" id="autoDev-info" style="background-color:#21bbf3;flex:1;text-align:center;">Info</li>' + '<li class="autoDev-filter" id="autoDev-json" style="background-color:#673AB7;flex:1;text-align:center;">Json</li>' + '<li class="autoDev-filter" id="autoDev-error" style="background-color:#FF5722;flex:1;text-align:center;">Error</li>' + '<li id="autoDev-clear" style="background-color:#9e9e9e;flex:1;text-align:center;">清空</li>' + '<li id="autoDev-refresh" style="background-color:#2196f3;flex:1;text-align:center;">刷新</li>' + '</ul><div id="autoDev-log" style="position:absolute;top:20px;bottom:0;left:0;right:0;padding:5px;overflow:scroll;"></div>';

		body.appendChild(this._container);

		this._container.innerHTML = navDom;

		this._logContainer = document.getElementById('autoDev-log');
		this._btnClear = document.getElementById('autoDev-clear');
		this._btnRefresh = document.getElementById('autoDev-refresh');
		this._btnFilter = document.querySelectorAll('.autoDev-filter');
	}

	/**
	 * 遮罩层显示
	 * @return {*}
	 */
	autoDevTool.prototype._show = function() {
		this._container.style.display = "block";
	}

	/**
	 * 遮罩层关闭
	 * @return {*}
	 */
	autoDevTool.prototype._hide = function() {
		this._container.style.display = "none";
	}

	/**
	 * 事件绑定
	 * @return {*}
	 */
	autoDevTool.prototype._eventBind = function() {
		var me = this;

		// 三指连点两次打开调试台
		window.addEventListener("touchend", function(e) {
			var nowTime = new Date();
			var touches = e.touches.length;

			if (me._times === 1) {
				me._times++;
				me._lastTapTime = nowTime;

				setTimeout(function() {
					me._times = 1;
				}, 1000);
				return;
			}

			if (touches === 2 && me._times === 2 && (nowTime - me._lastTapTime < 1000)) {
				if (me._container.style.display == "none") {
					me._show();
				} else {
					me._hide();
				}

				me._times = 1;
			}
		});

		this._btnClear.addEventListener("click", function(e) {
			me._logContainer.innerHTML = "";
		});

		this._btnRefresh.addEventListener("click", function(e) {
			location.href = location.href;
		});


		var length = this._btnFilter.length;

		for (var i = 0; i < length; i++) {
			var navLi = this._btnFilter[i];

			navLi.addEventListener("click", function(e) {
				var target = e.target;
				var id = target.getAttribute('id');
				var logs = me._logContainer.querySelectorAll('p');
				var logLength = logs.length;

				var idMapClass = {
					"autoDev-info": "autoDev-log-info",
					"autoDev-json": "autoDev-log-json",
					"autoDev-error": "autoDev-log-error"
				};

				for (var j = 0; j < logLength; j++) {
					var elem = logs[j];

					if (id === "autoDev-all") {
						elem.style.display = "block";
					} else {
						if (idMapClass[id] === elem.getAttribute("class")) {
							elem.style.display = "block";
						} else {
							elem.style.display = "none";
						}
					}
				}
			});
		}
	}

	/**
	 * 打印 log
	 * @param {Number} type 1 - 非object对象，2 - JSON对象或普通对象， 3 - Error对象
	 * @param {String} name 输出名字
	 * @param {String} data 输出数据
	 * @return {*}
	 */
	autoDevTool.prototype._log = function(type, name, data) {
		var p = document.createElement('p');
		var date = new Date();
		var curTime = date.getHours() + ':' + date.getSeconds();
		var timeString = "<span style='color:#795548'>[" + curTime + "]</span>";
		var logType = "";
		var typeArr = ["", "autoDev-log-info", "autoDev-log-json", "autoDev-log-error"];

		switch (true) {
			case type === 1:
				logType = "<span style='color:#21bbf3'>[Info] </span>";
				break;
			case type === 2:
				logType = "<span style='color:#673AB7'>[Json] </span>";
				break;
			case type === 3:
				logType = "<span style='color:#FF5722'>[Error] </span>";
				break;
		}

		p.style.cssText = "font-size:12px;line-height:20px;color:#333;margin-bottom:0px;border-bottom:1px solid rgba(0,0,0,.2);"
		p.setAttribute('class', typeArr[type]);
		p.innerHTML = timeString + logType + name + "：" + data;

		this._logContainer.appendChild(p);
	}

	/**
	 * 打印 log 接口
	 * @param {String} name 输出名字
	 * @param  {String | JSON} data
	 * @return {*}
	 */
	autoDevTool.prototype.log = function(name, data) {
		var type = typeof data;

		switch (true) {
			case type === "object":
				if (data instanceof Error) {
					this._log(3, name, data);
				}

				this._log(2, name, JSON.stringify(data));
				break;
			default:
				this._log(1, name, data);
		}
	}

	/**
	 * 初始化方法
	 * @return {*}
	 */
	autoDevTool.prototype.init = function() {
		this._createWrap();
		this._eventBind();
	}


	/**
	 * export
	 */
	return autoDevTool;
});
