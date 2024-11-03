package sdk

import (
	"encoding/binary"
	"unsafe"
)

var allocatedBytes = map[uint32][]byte{}

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
	ptr := &slice[0]
	unsafePtr := uint32(uintptr(unsafe.Pointer(ptr)))
	allocatedBytes[unsafePtr] = slice
	return unsafePtr
}

//export deallocate
//go:wasmexport deallocate
func heapDealloc(ptr uint32) {
	delete(allocatedBytes, ptr)
}
