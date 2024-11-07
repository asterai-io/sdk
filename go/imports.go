package sdk

//go:wasm-module index
//export host.log
//go:wasmimport index host.log
func hostLog(request uint32)

//go:wasm-module index
//export host.http_request
//go:wasmimport index host.http_request
func hostHttpRequest(request uint32) uint32

//go:wasmimport plugin_env_get_string
//go:wasm-module index
func hostPluginEnvGetString(request uint32) uint32
