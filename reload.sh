#! /bin/bash

display=$1

pkill -HUP -f nekowm.ts
sleep 1
DISPLAY=$display bun ./nekowm.ts &
