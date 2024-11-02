package sdk

//export index.host.log
func hostLog(request uint32)

//export index.host.http_request
func hostHttpRequest(request uint32) uint32
