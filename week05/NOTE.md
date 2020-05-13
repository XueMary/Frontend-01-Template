# 每周总结可以写在这里

输入一个URL变成屏幕显示页面过程：

 1.浏览器首先使用http协议或者https协议，向服务端请求页面； 
 
 2.把请求回来的html代码经过解析，构建成DOM树；
 
 3.计算DOM树上的css属性； 4.最后根据css属性对元素逐个进行渲染，得到内存中的位图； 
 
 5.一个可选的步骤是对位图进行合成，这会极大地增加后续绘制的速度； 
 
 6.合成后，再绘制到界面上。


http Method方法： GET、 POST、 HEAD、 PUT、 DELETE 、CONNECT 、OPTIONS、 TRACE 

浏览器通过地址栏访问页面都是GET方法，表单提交产生POST方法。 

HEAD则是跟GET类似，只返回请求头，

多数由JavaScript发起 PUT和DELETE分别表示添加资源和删除资源，语义上的约定，并没有强约束。 

CONNECT现在多用于HTTPS和WebSocket。 

OTPTIONS和TRACE一般用于调试。


HTTP Request Body 常见body格式： 

application/json 

application/x-www-form-urlencoded （默认) 

multipart/form-data (文件上传时) text/html
