echo "Building Server"
# docker buildx build --platform linux/arm/v7 -t bootlegger/ourstory-server:armv7 --push -f ../../Dockerfile.armv  ../..

# echo "Building Proxy"
docker buildx build --no-cache --platform=linux/arm/v7,linux/arm64,linux/amd64 -t bootlegger/nginx --push -f ../../Dockerfile.nginx ../../
docker buildx build --no-cache --platform=linux/arm/v7,linux/amd64,linux/arm64 -t bootlegger/nginx-local --push -f ../../Dockerfile.nginx.local ../../

# echo "Building Beanstalkd"
# docker buildx build --platform linux/arm/v7 -t bootlegger/beanstalk:armv7 --push -f Dockerfile.beanstalkd .

# echo "Building Worker"
# docker buildx build --platform linux/arm/v7 -t bootlegger/ourstory-worker:armv7 --push ../../../ourstory-worker/