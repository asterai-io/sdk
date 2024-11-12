#protoc --proto_path=../../assemblyscript/protobuf --go_out=. asterai.proto  --experimental_allow_proto3_optional
# protoc-gen-go-lite is used as it does not need reflection
# and is therefore compatible with TinyGo.
protoc \
      --proto_path=../../assemblyscript/protobuf \
      --plugin protoc-gen-go-lite="$GOBIN/protoc-gen-go-lite" \
      --go-lite_out=.  \
      --go-lite_opt=features=marshal+unmarshal+size+equal+clone \
      --experimental_allow_proto3_optional \
    asterai.proto
