#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

VERSION=0.88.0
FILES=("vhdl_ls-x86_64-pc-windows-msvc" "vhdl_ls-x86_64-unknown-linux-musl")
# sha256 of the release zips, in the same order as FILES
# from https://github.com/VHDL-LS/rust_hdl/releases/tag/v$VERSION
SHA256=(
  999f644aeb86bba19ab1b4bcda7460925186a3a5ca287d2f2f865cb4c1f4579d
  5cb90333e5f93e11d83d4f980b7c7ff204b11283c854efcafe2ff0b5cf41f7ec
)
OUTPUT_FOLDER=vhdl_ls/$VERSION

# Download and verify into a scratch directory so a failure leaves the
# current binaries untouched and no stray zip behind.
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

for i in "${!FILES[@]}"
do
  FILE=${FILES[$i]}
  wget --no-verbose -O "$TMP/$FILE.zip" "https://github.com/VHDL-LS/rust_hdl/releases/download/v$VERSION/$FILE.zip"
  echo "${SHA256[$i]}  $TMP/$FILE.zip" | sha256sum -c -
  unzip -q "$TMP/$FILE.zip" -d "$TMP"
done

rm -rf vhdl_ls
mkdir -p "$OUTPUT_FOLDER"
for FILE in "${FILES[@]}"
do
  mv "$TMP/$FILE" "$OUTPUT_FOLDER"
done
