// Global module compiled with every plugin.
// This module exports functions necessary for the host to communicate
// with the WASM module via AssemblyScript-specific interfaces.

// TODO: remove this so it's broken and ensure asterai API handles it gracefully.
export function allocate(size: usize): usize {
  return heap.alloc(size);
}

export function deallocate(ptr: usize): void {
  heap.free(ptr);
}
