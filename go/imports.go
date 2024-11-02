package sdk

//go:wasm-module index
//export host.log
func hostLog(request uint32)

//go:wasm-module index
//export host.http_request
func hostHttpRequest(request uint32) uint32
