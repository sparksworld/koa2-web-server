module.exports = {
    apps: [{
        name: 'blog-server',
        script: './bin/www',
        watch: false, // 默认关闭watch 可替换为 ['src']
        ignore_watch: ['node_modules', 'logs'],
        out_file: './logs/out.log', // 日志输出
        error_file: './logs/error.log', // 错误日志
        max_memory_restart: '2G', // 超过多大内存自动重启，仅防止内存泄露有意义，需要根据自己的业务设置
        env: {
            NODE_ENV: 'production',
            "pm2_EXTRA_DISPLAY": "true"
        },
        exec_mode: 'cluster', // 开启多线程模式，用于负载均衡
        instances: 'max', // 启用多少个实例，可用于负载均衡
        autorestart: true // 程序崩溃后自动重启
    }],

    deploy: {
        production: {
            user: 'root',
            host: '144.34.168.7',
            port: '26246',
            ref: 'origin/master',
            repo: 'git@github.com:sparksworld/koa2-web-server.git',
            path: '/www',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        },
        dev: {
            user: 'root',
            host: '127.0.0.1',
            ref: 'origin/master',
            repo: 'git@github.com:sparksworld/koa2-web-server.git',
            path: '/www/koa2-web-server',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};