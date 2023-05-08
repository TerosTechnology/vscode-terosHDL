clean () {
    rm -rf ./packages/$1/node_modules
    rm -rf ./packages/$1/out
    rm -rf ./packages/$1/yarn.lock
    rm -rf ./packages/$1/package-lock.json
}

clean "colibri"
clean "teroshdl"
