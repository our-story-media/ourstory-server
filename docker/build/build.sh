DOCKER_BUILDKIT=1

docker build --platform=linux/amd64 -t bootlegger/nginx:latest -f ../../Dockerfile.nginx ../..

docker push bootlegger/nginx:latest

docker build --platform=linux/amd64 -t bootlegger/nginx-local:latest -f ../../Dockerfile.nginx.local ../..

docker push bootlegger/nginx-local:latest