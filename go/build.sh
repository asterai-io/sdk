# The build file is not used for any purpose other than
# verifying that the code is valid.
mkdir -p build
tinygo build -o build/sdk.wasm -target=wasi -buildmode=c-shared -no-debug -panic=trap
