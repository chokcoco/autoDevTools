# autoDevTools

一款简单的移动端调试插件，解决移动端无法看到打印的 log，上线后亦可使用。

## 使用方法

### 初始化方法

页面直接加载 autoDevTools.js，同时 autoDevTools.js 也支持 AMD 或 CMD 规范。

```HTML
<script type="text/javascript" src="autoDevTool.js"></script>
<script type="text/javascript">
    var devTool = new autoDevTool();
</script>
```

#### AMD:
```HTML
<script src="require.js"></script>
<script>
    require(['autoDevTool.js'], function(autoDevTool){
        var devTool = new autoDevTool();
    });
</script>
```
## 接口调用
+ `log`：定义需要输出的日志。
```
  var devTool = new autoDevTool();
  
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

三指双击屏幕两次（间隔小于1s），可以唤出日志控制台。

![](https://github.com/chokcoco/autoDevTools/blob/master/images/demo.jpg)

## MIT

License
