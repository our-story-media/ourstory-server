git clone --branch rpi --depth 1  https://github.com/our-story-media/ourstory-resources.git
node docker/builddocs.js
cd ourstory-resources
npm i
npm run docs:build
mkdir -p ../assets/docs
cp -R ./docs/* ../assets/docs
cd ..
# rm -rf ourstory-resources