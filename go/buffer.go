package sdk

import (
	"encoding/binary"
	"unsafe"
)

var allocs = make(map[uintptr][]byte)

func WriteBuffer(buffer []byte) uint32 {
	bufferLen := uint32(len(buffer))
	ptr := heapAlloc(bufferLen + 4)
	binary.LittleEndian.PutUint32((*[4]byte)(unsafe.Pointer(uintptr(ptr)))[:], bufferLen)
	copyToPtr(unsafe.Pointer(uintptr(ptr)+4), buffer)
	return uint32(uintptr(ptr))
}

func copyToPtr(ptr unsafe.Pointer, buffer []byte) {
	destination := unsafe.Pointer(uintptr(ptr))
	source := unsafe.Pointer(&buffer[0])
	copy((*[1 << 30]byte)(destination)[:len(buffer)], (*[1 << 30]byte)(source)[:len(buffer)])
}

func ReadBuffer(ptr uint32) []byte {
	data := unsafe.Pointer(uintptr(ptr))
	length := binary.LittleEndian.Uint32((*[4]byte)(data)[:])
	return (*[1 << 30]byte)(unsafe.Add(data, 4))[:length:length]
}

// Reference source from TinyGo:
// https://github.com/tinygo-org/tinygo/blob/2a76ceb7dd5ea5a834ec470b724882564d9681b3/src/runtime/arch_tinygowasm_malloc.go#L15
//
//go:wasmexport allocate
//export allocate
func heapAlloc(size uint32) unsafe.Pointer {
	if size == 0 {
		return nil
	}
	buf := make([]byte, size)
	ptr := unsafe.Pointer(&buf[0])
	allocs[uintptr(ptr)] = buf
	return ptr
}

//go:wasmexport deallocate
//export deallocate
func heapDealloc(ptr unsafe.Pointer) {
	if ptr == nil {
		return
	}
	if _, ok := allocs[uintptr(ptr)]; ok {
		delete(allocs, uintptr(ptr))
	} else {
		panic("free: invalid pointer")
	}
}
