package main

import (
	asterai "github.com/asterai-io/sdk/go/protobuf"
	proto "google.golang.org/protobuf/proto"
	"reflect"
	"unsafe"
)

//export host.log
func hostLog(request uint32)

//export heap.alloc
func heapAlloc(len uint32) uint32

func LogTrace(content string) {
	log(content, "trace")
}

func LogDebug(content string) {
	log(content, "debug")
}

func LogError(content string) {
	log(content, "error")
}

func LogWarn(content string) {
	log(content, "error")
}

func LogInfo(content string) {
	log(content, "error")
}

func log(content string, level string) {
	request := asterai.HostLogRequest{
		Content: content,
		Level:   level,
	}
	bytes, _ := proto.Marshal(&request)
	ptr := writeBuffer(bytes)
	hostLog(ptr)
}

// TODO move to plugin, return PluginOutput (custom plugin type)
func processQuery_entry_point(input int32) asterai.HostHashStringRequest {
	hostLog(0)
	return asterai.HostHashStringRequest{
		Content: "test",
	}
}

func writeBuffer(buffer []byte) uint32 {
	ptr := heapAlloc(uint32(len(buffer)) + 4)
	copyToPtr(ptr, buffer)
	return ptr
}

func copyToPtr(ptr uint32, buffer []byte) {
	// Convert uint32 pointer to uintptr for use with unsafe operations.
	destination := unsafe.Pointer(uintptr(ptr))
	// Convert slice to a pointer to its underlying array.
	source := unsafe.Pointer((*reflect.SliceHeader)(unsafe.Pointer(&buffer)).Data)
	// Perform the copy.
	copy((*[1 << 30]byte)(destination)[:len(buffer)], (*[1 << 30]byte)(source)[:len(buffer)])
}

func readBuffer(ptr uint32, length int32) []byte {
	// Convert the uint32 pointer to a uintptr for use with unsafe operations.
	data := unsafe.Pointer(uintptr(ptr))
	// Create a Go slice from the memory at this pointer.
	// This assumes that 'length' bytes are valid starting from 'ptr'.
	return (*[1 << 30]byte)(data)[:length:length]
}

// main is required for TinyGo to compile to WASM.
func main() {}
