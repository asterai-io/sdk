package main

//export host.log
func hostLog(request uint32)

//export heap.alloc
func heapAlloc(len uint32) uint32

//export host.http_request
func hostHttpRequest(request uint32) uint32
