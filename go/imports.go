package sdk

//go:wasm-module index
//export host.log
//go:wasmimport index host.log
func hostLog(request uint32)

//go:wasm-module index
//export host.http_request
//go:wasmimport index host.http_request
func hostHttpRequest(request uint32) uint32

//go:wasm-module index
//export host.plugin_env_get_string
//go:wasmimport index host.plugin_env_get_string
func hostPluginEnvGetString(request uint32) uint32

//go:wasm-module index
//export host.kv_get_user_string
//go:wasmimport index host.kv_get_user_string
func hostKvGetUserString(request uint32) uint32

//go:wasm-module index
//export host.kv_set_user_string
//go:wasmimport index host.kv_set_user_string
func hostKvSetUserString(request uint32)
