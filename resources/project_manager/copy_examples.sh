#!/bin/bash
BASEDIR=$(dirname "$0")
echo $BASEDIR
rm -R $BASEDIR/examples
git clone https://github.com/TerosTechnology/teroshdl-examples $BASEDIR/teroshdl-examples
cp -R $BASEDIR/teroshdl-examples/project_manager $BASEDIR
mv $BASEDIR/project_manager $BASEDIR/examples
rm -rf $BASEDIR/teroshdl-examples
