package main

import (
	pb "github.com/asterai-io/sdk/go/protobuf"
)

//export host.log
func hostLog(request uint32)

func LogDebug(content string) {
	//request := pb.HostLogRequest{
	//	Content: content,
	//	Level:   "debug",
	//}
	// TODO serialize request
}

// TODO move to plugin, return PluginOutput (custom plugin type)
func processQuery_entry_point(input int32) pb.HostHashStringRequest {
	hostLog(0)
	return pb.HostHashStringRequest{
		Content: "test",
	}
}

// main is required for TinyGo to compile to WASM.
func main() {}
