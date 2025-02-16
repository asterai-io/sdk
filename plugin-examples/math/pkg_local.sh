#!/bin/bash
npx mkdirp build && asterai_local pkg -o build/package.wasm -e http://localhost:3003 && wasm-tools component wit ./build/package.wasm -o build/package.full.wit

