package sdk

import (
	asterai "github.com/asterai-io/sdk/go/protobuf"
)

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
	log(content, "warn")
}

func LogInfo(content string) {
	log(content, "info")
}

func log(content string, level string) {
	request := &asterai.HostLogRequest{
		Content: content,
		Level:   level,
	}
	bytes, _ := request.MarshalVT()
	ptr := WriteBuffer(bytes)
	hostLog(ptr)
}
