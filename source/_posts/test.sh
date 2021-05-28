#!/bin/bash

for line in `ls | grep -i vue`; do
typora $line
done