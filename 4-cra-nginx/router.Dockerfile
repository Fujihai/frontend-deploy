From node:14-alpine as builder

WORKDIR /code

# npm 没有缓存机制，yarn 有
ADD package.json yarn.lock /code/
RUN yarn

ADD . /code
RUN npm run build

# 使用 nginx 镜像
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/build /usr/share/nginx/html