package sdk

import (
	asterai "github.com/asterai-io/sdk/go/protobuf"
)

func Sleep(milliseconds uint64) {
	request := &asterai.HostSleepRequest{
		Milliseconds: milliseconds,
	}
	bytes, _ := request.MarshalVT()
	ptr := WriteBuffer(bytes)
	hostSleep(ptr)
}
