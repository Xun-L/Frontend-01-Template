# 每周总结可以写在这里
1，tool唤醒浏览器
2，server端拿到了github的token
3，拿到token之后传给tool。
   所以tool必须开一个端口监听，获取token数据
   拿到token之后，tool的监听server就可以关闭了  	
4，tool中header头带token上传文件()
5，server端根据token，调用github的api校验用户的信息，
   决定下一步操作