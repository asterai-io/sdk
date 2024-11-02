package sdk

import (
	"encoding/binary"
	"reflect"
	"unsafe"
)

func WriteBuffer(buffer []byte) uint32 {
	ptr := heapAlloc(uint32(len(buffer)) + 4)
	// Write the length as a uint32 at the start of the allocated memory.
	binary.LittleEndian.PutUint32(
		(*[1 << 30]byte)(unsafe.Pointer(uintptr(ptr)))[:], uint32(len(buffer)),
	)
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

func ReadBuffer(ptr uint32) []byte {
	// Convert the uint32 pointer to a uintptr for use with unsafe operations.
	data := unsafe.Pointer(uintptr(ptr))
	// Read the length (uint32).
	length := binary.LittleEndian.Uint32((*[4]byte)(data)[:])
	// Now read the actual data, skipping the first 4 bytes used for length.
	return (*[1 << 30]byte)(unsafe.Add(data, 4))[:length:length]
}

//export allocate
func heapAlloc(len uint32) uint32 {
	slice := make([]byte, len)
	return *(*uint32)(unsafe.Pointer(&slice))
}

//export deallocate
func heapDealloc(_len uint32) {
	// This is just a placeholder.
	// The GC deallocs.
}
