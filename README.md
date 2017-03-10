# autoDevTools![npm_version](https://img.shields.io/npm/v/auto_dev_tool.svg)

移动端控制台插件，解决移动端无法看到打印的 log ，上线后亦可使用，用于快速定位问题。


## Install NPM

```
$ npm install auto_dev_tool --save-dev
```

或者页面直接加载 autoDevTools.js，同时 autoDevTools.js 也支持 AMD 或 CMD 规范。

```HTML
<script type="text/javascript" src="autoDevTool.js"></script>
<script type="text/javascript">
    var devTool = new autoDevTool();
    devTool.init();
</script>
```


### AMD:
```HTML
<script src="require.js"></script>
<script>
    require(['autoDevTool.js'], function(autoDevTool){
        var devTool = new autoDevTool();
        devTool.init();
    });
</script>
```
## API

- `log`：定义需要输出的日志。
```javascript
  var devTool = new autoDevTool();
  devTool.init();

  var name = "自定义日志title";
  var data = {
    value:""
  }

  devTool.log(name, data);
```
适用如下场景：

#### 普通变量输出

```javascript
var a = 10;
devTool.log("a", a);
```

#### error输出
```javascript
try{
  ...
}catch(error) {
  devTool.log("error", error);
}
```

#### json对象输出
```javascript
var json = {
  a: "dev",
  b: "tool"
}
devTool.log("json", json);
```
## 控制调试台唤出方法：

三指双击屏幕两次（间隔小于1s），可以唤出控制台。

![](https://github.com/chokcoco/autoDevTools/blob/master/images/example-demo.jpg)

## 优化

+ 为保证性能，不污染 DOM 结构，控制台隐藏状态下，日志不会输出，要看到完整日志可以呼出控制台之后，点击刷新。此刷新功能页面刷新时控制台默认打开

+ 为保证页面所有操作都可以进行，提供控制台定位控制，如果控制台挡住了页面下方的某些交互按钮，可以点击上移按钮

+ 增加暂停、输出按钮，可以暂停日志打印，高频日志打印状态下，可以暂停观看日志；

## MIT

License
