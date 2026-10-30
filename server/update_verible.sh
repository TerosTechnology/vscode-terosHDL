VERSION="v0.0-3958-g7aae5c08"
FILES=("verible-$VERSION-win64.zip" "verible-$VERSION-linux-static-x86_64.tar.gz")
OUTPUT_FOLDER=verible/$VERSION

rm -rf $(dirname $OUTPUT_FOLDER)
mkdir -p $OUTPUT_FOLDER

for FILE in "${FILES[@]}"
do
  wget https://github.com/chipsalliance/verible/releases/download/$VERSION/$FILE
  
  if [[ $FILE == *.zip ]]; then
    unzip $FILE
    mv verible-$VERSION-win64/verible-verilog-ls.exe $OUTPUT_FOLDER/
    rm -rf verible-$VERSION-win64
  elif [[ $FILE == *.tar.gz ]]; then
    tar -xzf $FILE
    mv verible-$VERSION/bin/verible-verilog-ls $OUTPUT_FOLDER/
    rm -rf verible-$VERSION
  fi
  
  rm -rf $FILE
done
