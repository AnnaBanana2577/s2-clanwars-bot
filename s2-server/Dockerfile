FROM alpine:3.17
RUN apk add libc6-compat
RUN mkdir /app
WORKDIR /app
RUN wget https://dl.thd.vg/soldat2-linuxserver-release.tar.gz
RUN tar -zxf soldat2-linuxserver-release.tar.gz
COPY . soldat2-linuxserver-release
WORKDIR /app/soldat2-linuxserver-release
RUN chmod +x soldat2
CMD ["sh", "-c", "./soldat2"]