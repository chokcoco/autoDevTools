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
    require(['autoDevTool'], function(autoDevTool){
        var devTool = new autoDevTool();
    });
</script>
```

### 调用接口进行log输出
#### 普通变量输出

```script
var a = 10;
devTool.log("a", a);
```

#### error输出
```script
try{
  ...
}catch(error) {
  devTool.log("error", error);
}
```

#### json对象输出
```script
var json = {
  a: "dev",
  b: "tool"
}
devTool.log("json", json);
```

## MIT

License
