(function(name, definition) {
	if (typeof define === 'function') {
		define(definition);
	} else {
		this[name] = definition();
	}
})('autoDevTool', function() {

	function autoDevTool() {
		this._version = '1.0.0';
		this._isShow = false;
		this._times = 1;
		this._touchesFingerNum = 0;
		this._lastTapTime = null;
		this._container = null;
	}

	/**
	 * 创建记录遮罩
	 * @return {*}
	 */
	autoDevTool.prototype._createWrap = function() {
		var body = document.getElementsByTagName('body')[0];

		this._container = document.createElement('div');

		this._container.setAttribute('id', 'dev-tool');
		this._container.style.cssText = "position:fixed;bottom:0;left:0;width:100%;height:200px;padding:10px;background:rgba(0,0,0,.3);"

		body.appendChild(this._container);
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
        window.addEventListener("touchend", function(e){
        	var nowTime = new Date();
        	var touches = e.touches.length;

        	if(me._times === 1) {
        		me._times++;
        		me._lastTapTime = nowTime;

        		setTimeout(function(){
        			me._times = 1;
        		}, 1000);
                return;
        	}

        	if(touches === 2 && me._times === 2 && (nowTime - me._lastTapTime < 1000)) {
        		if(me._container.style.display == "none") {
        			me._show();
        		}else{
        			me._hide();
        		}

        		me._times = 1;
        	}
        })
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
