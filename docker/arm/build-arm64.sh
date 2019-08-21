echo "Building Server"
docker build -t bootlegger/ourstory-server:arm64 -f ../../Dockerfile.arm  ../..

echo "Building Proxy"
docker build -t bootlegger/nginx-local:arm64 -f ../../Dockerfile.nginx.local ../../

echo "Building Beanstalkd"
docker build -t bootlegger/beanstalk:arm64 -f Dockerfile.beanstalkd .

echo "Building Worker"
docker build -t bootlegger/ourstory-worker:arm64 ../../../ourstory-worker/

docker push bootlegger/ourstory-server:arm64
docker push bootlegger/nginx-local:arm64
docker push bootlegger/beanstalk:arm64
docker push bootlegger/ourstory-worker:arm64