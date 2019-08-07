echo "Building Server"
docker buildx build --platform linux/arm/v7 -t bootlegger/ourstory-server:armv7 --push -f ../../Dockerfile.armv7  ../..

# echo "Building Proxy"
# docker buildx build --platform linux/arm/v7 -t bootlegger/nginx-local:armv7 --push -f ../../Dockerfile.nginx.local ../../

# echo "Building Beanstalkd"
# docker buildx build --platform linux/arm/v7 -t bootlegger/beanstalk:armv7 --push -f Dockerfile.beanstalkd .

# echo "Building Worker"
# docker buildx build --platform linux/arm/v7 -t bootlegger/ourstory-worker:armv7 --push ../../../ourstory-worker/