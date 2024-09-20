#!/bin/bash
BASEDIR=$(dirname "$0")
echo $BASEDIR
rm -R $BASEDIR/examples
git clone https://github.com/TerosTechnology/teroshdl-examples $BASEDIR/teroshdl-examples
mkdir $BASEDIR/examples
cp -R $BASEDIR/teroshdl-examples/project_manager/* $BASEDIR/examples
cp -R $BASEDIR/teroshdl-examples/state_machine $BASEDIR/examples
cp -R $BASEDIR/teroshdl-examples/documenter/examples $BASEDIR/examples
mv $BASEDIR/examples/examples $BASEDIR/examples/documenter
rm -rf $BASEDIR/teroshdl-examples
