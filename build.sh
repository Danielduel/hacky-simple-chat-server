docker build \
  -f ./docker/Dockerfile \
  -t danielduel/simple-websocket-chat-server:latest \
  .

docker push danielduel/simple-websocket-chat-server:latest
