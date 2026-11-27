#!/bin/bash
# usage: dlm.sh QUERYSTRING  then lines "SLUG NN OBJ/NAME SIG"
Q=$1; t=$(mktemp); cat > $t
for s in $(awk '{print $1}' $t | sort -u); do awk -v s=$s '$1==s{print $2,$3,$4}' $t | ./dl.sh $s "$Q"; done
