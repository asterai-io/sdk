package sdk

import (
	asterai "github.com/asterai-io/sdk/go/protobuf"
	proto "google.golang.org/protobuf/proto"
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
