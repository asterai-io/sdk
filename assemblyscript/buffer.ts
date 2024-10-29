export function readBufferFromPtr(ptr: u32): Uint8Array {
  const lengthBuffer = new Uint32Array(1);
  memory.copy(lengthBuffer.dataStart, ptr, 4);
  const length = lengthBuffer[0];
  const payloadBuffer = new Uint8Array(length);
  memory.copy(payloadBuffer.dataStart, ptr + 4, length);
  return payloadBuffer;
}

export function writeBufferToPr(buffer: Uint8Array): u32 {
  const ptr: usize = heap.alloc(buffer.length + 4);
  store<u32>(ptr, buffer.length);
  memory.copy(ptr + 4, buffer.dataStart, buffer.length);
  return ptr as u32;
}
