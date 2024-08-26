VERSION=0.82.0
FILES=("vhdl_ls-x86_64-pc-windows-msvc" "vhdl_ls-x86_64-unknown-linux-musl")
OUTPUT_FOLDER=vhdl_ls/$VERSION

rm -rf $(dirname $OUTPUT_FOLDER)
mkdir -p $OUTPUT_FOLDER

for FILE in "${FILES[@]}"
do
  wget https://github.com/VHDL-LS/rust_hdl/releases/download/v$VERSION/$FILE.zip
  unzip $FILE.zip
  mv $FILE $OUTPUT_FOLDER
  rm -rf $FILE.zip
done
