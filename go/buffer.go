package sdk

import (
	"encoding/binary"
	"reflect"
	"unsafe"
)

func WriteBuffer(buffer []byte) uint32 {
	bufferLen := uint32(len(buffer))
	ptr := heapAlloc(bufferLen + 4)
	binary.LittleEndian.PutUint32((*[4]byte)(unsafe.Pointer(uintptr(ptr)))[:], bufferLen)
	copyToPtr(ptr+4, buffer)
	return ptr
}

func copyToPtr(ptr uint32, buffer []byte) {
	destination := unsafe.Pointer(uintptr(ptr))
	source := unsafe.Pointer(&buffer[0])
	copy((*[1 << 30]byte)(destination)[:len(buffer)], (*[1 << 30]byte)(source)[:len(buffer)])
}

func ReadBuffer(ptr uint32) []byte {
	data := unsafe.Pointer(uintptr(ptr))
	length := binary.LittleEndian.Uint32((*[4]byte)(data)[:])
	return (*[1 << 30]byte)(unsafe.Add(data, 4))[:length:length]
}

//export allocate
//go:wasmexport allocate
func heapAlloc(len uint32) uint32 {
	slice := make([]byte, len)
	// Convert the slice header to get the actual memory address
	sliceHeader := (*reflect.SliceHeader)(unsafe.Pointer(&slice))
	// Return the address as uint32. Note: This assumes that the address can fit in 32 bits,
	// which might not always be true on all systems but should be fine for WASM.
	return uint32(sliceHeader.Data)
}

//export deallocate
//go:wasmexport deallocate
func heapDealloc(_len uint32) {
	// This is just a placeholder.
	// The GC deallocs.
}
