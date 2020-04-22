# 每周总结可以写在这里

ASCII 编码 包含基础 128 位 拉丁文

UCS 包含 0x0000 - 0xFFFF 的基础符号

UNICODE 与 UCS 属于同一时期 出现的 字符集

于是兼容合并 为 现在的 UNICODE 

UCS-2 UCS-4 属于 UCS 编码方式

UTF-8 UTF-16 UTF-32 为 UNICODE 编码方式

JavaScript 采用了 UCS-2 的编码格式 

当 超出 0xFFFF 时 以 UTF-16 的编码方式进行编码

然后拆分成 两个 UCS-2 的编码