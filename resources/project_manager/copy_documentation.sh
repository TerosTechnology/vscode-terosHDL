#!/bin/bash
BASEDIR=$(dirname "$0")
OUTPUT_DIR=$BASEDIR/help
REPO_DIR=$BASEDIR/terosHDLdoc


rm -rf $OUTPUT_DIR
git clone https://github.com/TerosTechnology/terosHDLdoc.git -b master $REPO_DIR

cd $REPO_DIR/doc/
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1v0P0A3Qa1Ht8gPcaq8r9OmxEboT-1CBt' -O theme.tar.gz
tar -zxvf theme.tar.gz
mv sphinx.theme-0 _theme
make html

cd ../../
mv $REPO_DIR/doc/_build/html ./help
rm -rf $REPO_DIR

