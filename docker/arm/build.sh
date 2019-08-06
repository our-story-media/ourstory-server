echo "Building Server"
docker buildx build --platform linux/arm64 -f ../../Dockerfile.dev  ../..

exit

echo "Building Proxy"
docker buildx build --platform linux/arm64,linux/arm/v7 -f ../../Dockerfile.nginx.local ../../

echo "Building Beanstalkd"
docker buildx build --platform linux/arm64,linux/arm/v7 -f Dockerfile.beanstalkd .

echo "Building Worker"
docker buildx build --platform linux/arm64,linux/arm/v7 ../../../ourstory-worker/
