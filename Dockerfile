# 使用官方的 Node.js 作为基础镜像，选择一个合适的版本
FROM paketobuildpacks/yarn-install AS build

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 yarn.lock 文件到工作目录
# 拷贝所有项目文件到工作目录
COPY . .

# 安装项目依赖（使用Yarn）
RUN yarn

# 构建 Vite 项目
RUN yarn build

# 使用 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 拷贝构建好的项目文件到 Nginx 的默认静态文件目录
COPY --from=build /app/packages/lowcoder/build /usr/share/nginx/html

# 拷贝自定义的Nginx配置文件到容器中
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 Nginx 默认端口（通常为 80）
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
