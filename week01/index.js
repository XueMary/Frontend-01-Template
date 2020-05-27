/* eslint-disable */
var fs = require('fs');
var path = require('path');

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve('./week01/tx');

//调用文件遍历方法
fileDisplay(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err)
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var fileDir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(fileDir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            var isFile = stats.isFile();//是文件
            var isDir = stats.isDirectory();//是文件夹
            if (isFile) {
              /**
               * vue template <!-- eslint-disable -->
               * vue script /* eslint-disable *\/
               */
              if (fileDir === __dirname + '/eslint-display.js') {
                return
              }
              var data = fs.readFileSync(fileDir);
              let text = data.toString('utf8')
              const disableRex = /^\/\* eslint-disable \*\//
              const vueDisableRex = /^<!-- eslint-disable -->/
              const jsFile = /\.js$/
              const vueFile = /\.vue$/
              

              if(jsFile.test(fileDir)){
                if (disableRex.test(text) === false) {
                  fs.writeFile(fileDir, '/* eslint-disable */\r\n' + text, 'utf-8', function () { });
                }
              } else if(vueFile.test(fileDir)) {
                let isChange = false
                if (vueDisableRex.test(text) === false) {
                  text = '<!-- eslint-disable -->\r\n' + text
                  isChange = true
                }
                if (disableRex.test(text) === false) {
                  let rex = /(<\s*script\s*>)/
                  let searchObj = text.match(rex)
                  let value = searchObj[0]
                  text = text.replace(value, '/* eslint-disable */\r\n' + value)
                  isChange = true
                }
                if(isChange){
                  fs.writeFile(fileDir, text, 'utf-8', function () { });
                }
              }

              
            }
            if (isDir) {
              fileDisplay(fileDir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        })
      });
    }
  });
}