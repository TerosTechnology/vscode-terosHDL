pwd=${PWD}

build () {
    cd ${pwd}
    cd ${1}
    echo "Building ${1}"
    NODE_ENV=production node ./esbuild.js
    cd ${pwd}
}

build "timing"
build "logs"
