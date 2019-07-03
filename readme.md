# sparkblog koa2项目 

---

## 启动 

#### 开发环境
```
npm run dev
```

#### 正式环境
```
npm run pro
```

<!-- 
> ctx 上下文中包含request与response方法

**ctx.request与ctx.req的区别**

前者是koa2封装好的，后者是node原生的req
> ctx.response与ctx.res同理 -->
---
## pm2 

#### 运行远程设置命令
```
pm2 deploy dev setup
```

#### 更新

```
pm2 deploy production update
```

#### 回滚

```shell
pm2 deploy production list //查看提交记录
pm2 deploy production revert 1
```



#### 强制提交 

```
pm2 deploy production --force
```