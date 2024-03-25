#! /bin/bash

clean() {
    rm -rf "$(dirname "$0")/packages/$1/node_modules"
    rm -rf "$(dirname "$0")/packages/$1/out"
    rm -rf "$(dirname "$0")/packages/$1/yarn.lock"
    rm -rf "$(dirname "$0")/packages/$1/package-lock.json"
}

# clean "colibri"
# clean "teroshdl"

# cd packages/colibri
# yarn install
# yarn build

# cd ../teroshdl
# yarn install

# cd ../..

# npm install -g @vscode/vsce
# cd packages/teroshdl
# yarn package