# utilities working with quasar vuejs firebase cordova

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```
## build set up
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ quasar dev

# build for production with minification
$ quasar build

# lint code
$ quasar lint
```

## building for release
```bash
# adding a platform
cordova platform add android

# check requirements
cordova requirements

# build release
first change the verion
cordova build android --release
```