/**
 * autoDevTool v1.1.0
 * By Coco
 * Github: https://github.com/chokcoco/autoDevTools
 *
 * @License MIT
 */
(function(name, definition) {
    // 检测上下文环境是否为 AMD 或者 CMD
    if (typeof define === 'function') {
        define(definition);
    // 定义为普通 node 模块
    }else if(typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    // 将模块的执行结果挂载在 window 变量中，在浏览器中 this 指向 window 对象
    } else {
        this[name] = definition();
    }
})('autoDevTool', function() {

    function autoDevTool() {
        this._version = '1.1.0';
        this._times = 1;
        this._lastTapTime = null;
        this._container = null;
        this._isShow = false;
        this._position = true;
        this._isPause = false;

        this._logContainer = null;

        this._btnFilter = null;
        this._btnClear = null;
        this._btnRefresh = null;
        this._btnSwitch = null;
        this._btnPause = null;
        this._closeBtn = null;
    }

    /**
     * 创建记录遮罩
     * @return {}
     */
    autoDevTool.prototype._createWrap = function() {
        var body = document.getElementsByTagName('body')[0];

        this._container = document.createElement('div');
        this._container.setAttribute('id', 'dev-tool');
        this._container.style.cssText = "display:none;position:fixed;top:70%;bottom:0;left:0;width:100%;box-sizing:border-box;background:rgba(255,255,255,.9);z-index:9999;border:1px solid #ddd;"

        var navDom = '<ul style="height:24px;line-height:24px;display:flex;justify-content:space-around;color:#fff;">'
                        + '<li class="autoDev-filter" id="autoDev-all" style="background-color:#2196f3;flex:1;text-align:center;text-align:center;">All</li>'
                        + '<li class="autoDev-filter" id="autoDev-info" style="background-color:#21bbf3;flex:1;text-align:center;">Info</li>'
                        + '<li class="autoDev-filter" id="autoDev-json" style="background-color:#673AB7;flex:1;text-align:center;">Json</li>'
                        + '<li class="autoDev-filter" id="autoDev-error" style="background-color:#FF5722;flex:1;text-align:center;">Error</li>'
                        + '<li id="autoDev-clear" style="background-color:#9e9e9e;flex:1;text-align:center;">清空</li>'
                        + '<li id="autoDev-refresh" style="background-color:#2196f3;flex:1;text-align:center;">刷新</li>'
                        + '<li id="autoDev-close" style="background-color:#E91E63;flex:1;text-align:center;">关闭</li>'
                        + '</ul>'
                    +'<div id="autoDev-log" style="position:absolute;top:24px;bottom:0;left:0;right:0;padding:5px;overflow:scroll;"></div>'
                    +'<div id="btn-devtool-switch" style="width:24px;height:24px;line-height:24px;font-family:tohama,sans-serif;position:absolute;right:5px;bottom:20px;border-radius:50%;color:rgba(255,255,255,.7);font-size:18px;text-align:center;font-weight:bold;background-color:rgba(255,152,0,.6);background-clip:content-box;border:5px solid transparent;box-sizing:content-box;">&uarr;</div>'
                    +'<div id="btn-devtool-pause" style="width:24px;height:24px;line-height:24px;font-family:tohama,sans-serif;position:absolute;right:5px;bottom:65px;border-radius:50%;color:rgba(255,255,255,.7);font-size:12px;text-align:center;font-weight:bold;background-color:rgba(244,67,54,.6);background-clip:content-box;border:5px solid transparent;box-sizing:content-box;">停</div>';
        body.appendChild(this._container);

        this._container.innerHTML = navDom;

        this._logContainer = document.getElementById('autoDev-log');
        this._btnClear = document.getElementById('autoDev-clear');
        this._btnRefresh = document.getElementById('autoDev-refresh');
        this._btnFilter = document.querySelectorAll('.autoDev-filter');
        this._btnSwitch = document.getElementById('btn-devtool-switch');
        this._btnPause = document.getElementById('btn-devtool-pause');
        this._closeBtn = document.getElementById('autoDev-close');
    }

    /**
     * 初始化检测 URL ，查看是否开启控制台，查看控制台位置
     * @return {}
     */
    autoDevTool.prototype._checkInit = function() {
        var url = location.href;

        if (getCookie("isKeepTool") == 1) {
            this._show();
            setCookie("isKeepTool", 0, 1);
        }

        if(getCookie("positionLocation") == 1) {
            this._positionBottom();
        }else {
            this._positionTop();
        }
    }

    /**
     * 遮罩层显示
     * @return {}
     */
    autoDevTool.prototype._show = function() {
        this._container.style.display = "block";
        this._isShow = true;
    }

    /**
     * 遮罩层关闭
     * @return {}
     */
    autoDevTool.prototype._hide = function() {
        this._container.style.display = "none";
        this._isShow = false;
        this._clear();
    }

    /**
     * 日志内容清空
     * @return {}
     */
    autoDevTool.prototype._clear = function() {
        this._logContainer.innerHTML = "";
    }

    /**
     * 日志容器默认滚动到底部
     * @return {}
     */
    autoDevTool.prototype._scrollTop = function() {
        this._logContainer.scrollTop  = this._logContainer.scrollHeight;
    }

    /**
     * 默认定位在下方
     * @return {}
     */
    autoDevTool.prototype._positionBottom = function() {
        this._container.style.top = "70%";
        this._container.style.bottom = "0";
        this._position = !this._position;

        this._btnSwitch.innerHTML = "&uarr;";
    }

    /**
     * 默认定位在上方
     * @return {}
     */
    autoDevTool.prototype._positionTop = function() {
        this._container.style.top = "0";
        this._container.style.bottom = "70%";
        this._position = !this._position;

        this._btnSwitch.innerHTML = "&darr;";
    }

    /**
     * 事件绑定
     * @return {}
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

        // 清空按钮
        this._btnClear.addEventListener("click", function(e) {
            me._clear();
        });

        // 刷新按钮，保存控制台打开状态
        this._btnRefresh.addEventListener("click", function(e) {
            var url = location.href;

            setCookie("isKeepTool", "1", 1);

            location.href = url;
        });

        // 关闭按钮
        this._closeBtn.addEventListener("click", function(e) {
            me._hide();
        });

        // 定位切换按钮
        this._btnSwitch.addEventListener("click", function(e) {
            if(me._position) {
                me._positionTop();
                setCookie("positionLocation", "0", 24);
            } else {
                me._positionBottom();
                setCookie("positionLocation", "1", 24);
            }
        })

        // 暂停|播放按钮
        this._btnPause.addEventListener("click", function(e) {
            me._isPause = !me._isPause;
            me._btnPause.innerText = me._isPause ? "播" : "停";

            this.style.backgroundColor = me._isPause ? "rgba(139,195,74,.6)" : "rgba(244,67,54,.6)";
        })

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
     * @return {}
     */
    autoDevTool.prototype._log = function(type, name, data) {
        if(!this._isShow || this._isPause) {
            return;
        }

        var p = document.createElement('p');
        var date = new Date();
        var curTime = date.getHours() + ':' + date.getSeconds();
        var timeString = "<span style='color:#795548'>[" + curTime + "]</span>";
        var logType = "";
        var typeArr = ["", "autoDev-log-info", "autoDev-log-json", "autoDev-log-error"];
        var value = data !== undefined ? ("：" + data) : "";

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

        p.style.cssText = "font-size:14px;line-height:24px;color:#333;margin-bottom:0px;border-bottom:1px solid rgba(0,0,0,.2);word-break:break-all;"
        p.setAttribute('class', typeArr[type]);
        p.innerHTML = timeString + logType + "<strong>" + name + "</strong>" + value;

        this._logContainer.appendChild(p);

        this._scrollTop();
    }

    /**
     * 打印 log 接口
     * @param {String} name 输出名字
     * @param  {String | JSON} data
     * @return {}
     */
    autoDevTool.prototype.log = function(name, data) {
        var type = Object.prototype.toString.call(data || name);

        switch (true) {
            case type === "[object Object]":
                this._log(2, name, JSON.stringify(data));
                break;
            case type === "[object Error]":
                this._log(3, name, data);
                break;
            default:
                this._log(1, name, data);
        }
    }

    /**
     * 设置 Cookie 值
     * @return {}
     */
    function setCookie(name, value, Hours) {
        var d = new Date(),
            offset = 8,
            utc = d.getTime() + (d.getTimezoneOffset() * 60000),
            nd = utc + (3600000 * offset),
            exp = new Date(nd);

        exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
        document.cookie = name + "=" + decodeURIComponent(value) + ";path=/;expires=" + exp.toGMTString() + ";";
    }

    /**
     * 获取 cookie 值
     * @return {}
     */
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return encodeURIComponent(arr[2]);
        return null;
    }

    /**
     * 初始化方法
     * @return {}
     */
    autoDevTool.prototype.init = function() {
        this._createWrap();
        this._checkInit();
        this._eventBind();
    }

    /**
     * export
     */
    return autoDevTool;
});
