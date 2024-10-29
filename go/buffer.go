package main

import (
	"reflect"
	"unsafe"
)

func writeBuffer(buffer []byte) uint32 {
	ptr := heapAlloc(uint32(len(buffer)) + 4)
	// TODO copy len to ptr+0
	copyToPtr(ptr+4, buffer)
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

// TODO: make new functionm that reads from a ptr alone, parsing the first
// 4 bytes as the uint32 length.
func readBuffer(ptr uint32, length int32) []byte {
	// Convert the uint32 pointer to a uintptr for use with unsafe operations.
	data := unsafe.Pointer(uintptr(ptr))
	// Create a Go slice from the memory at this pointer.
	// This assumes that 'length' bytes are valid starting from 'ptr'.
	return (*[1 << 30]byte)(data)[:length:length]
}
