package sdk

import (
	asterai "github.com/asterai-io/sdk/go/protobuf"
)

func GetEnvVar(key string) string {
	requestMessage := asterai.HostPluginEnvGetStringRequest{
		Key: key,
	}
	requestBytes, _ := requestMessage.MarshalVT()
	requestPtr := WriteBuffer(requestBytes)
	responsePtr := hostPluginEnvGetString(requestPtr)
	responseBytes := ReadBuffer(responsePtr)
	response := &asterai.HostPluginEnvGetStringResponse{}
	_ = response.UnmarshalVT(responseBytes)
	return response.GetValue()
}
