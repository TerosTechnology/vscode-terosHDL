version="0.25.0"

rm -rf ../../server
rm -rf *.zip

mkdir ../../server
mkdir ../../server/vhdl_ls
mkdir ../../server/vhdl_ls/$version

wget https://github.com/VHDL-LS/rust_hdl/releases/download/v$version/vhdl_ls-x86_64-pc-windows-msvc.zip -O vhdl_ls-x86_64-pc-windows-msvc.zip
wget https://github.com/VHDL-LS/rust_hdl/releases/download/v$version/vhdl_ls-x86_64-unknown-linux-musl.zip -O vhdl_ls-x86_64-unknown-linux-musl.zip

unzip vhdl_ls-x86_64-pc-windows-msvc.zip -d ../../server/vhdl_ls/$version
unzip vhdl_ls-x86_64-unknown-linux-musl.zip -d ../../server/vhdl_ls/$version

rm -rf ./*.zip