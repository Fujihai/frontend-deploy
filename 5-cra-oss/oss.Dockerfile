FROM node:14-alpine as builder

# 运行参数配置
ARG ACCESS_KEY_ID
ARG ACCESS_KEY_SECRET
ARG ENDPOINT
ENV PUBLIC_URL=https://fujihai-cra.oss-cn-shenzhen.aliyuncs.com/

# 执行的 npm script 名称
# ARG NPM_SCRIPT=cli
# ARG NPM_SCRIPT=rclone
ARG NPM_SCRIPT=script
# ARG NPM_SCRIPT=prune

WORKDIR /code

# 在 Linux 镜像中获取 OSSUtil 并从参数中获取 ACCESS_KEY_ID 等相关信息
RUN wget http://gosspublic.alicdn.com/ossutil/1.7.7/ossutil64 -O /usr/local/bin/ossutil \
  && chmod 755 /usr/local/bin/ossutil \
  && ossutil config -i $ACCESS_KEY_ID -k $ACCESS_KEY_SECRET -e $ENDPOINT

ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
# oss:cli 使用 ossutil 上传至 OSS
# oss:rclone 使用 rclone 上传至 OSS
# oss:script 通过脚本命令上传至 OSS
# oss:prune 通过脚本命令与定时任务自动清理冗余的 OSS 资源
RUN npm run build && npm run oss:${NPM_SCRIPT}

# 使用 nginx 镜像
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/build /usr/share/nginx/html