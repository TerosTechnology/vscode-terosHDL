OUTPUT_DIR=/tmp/vscode-terosHDL
CURRENT_DIR=$(pwd)

rm -rf $OUTPUT_DIR
cp -R . $OUTPUT_DIR

cd $OUTPUT_DIR
./clean.sh

# Colibri
cd packages/colibri
yarn install

# TerosHDL
cd ../teroshdl
yarn install
yarn package
cp -f ./*.vsix $CURRENT_DIR