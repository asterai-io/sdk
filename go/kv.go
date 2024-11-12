package sdk

import (
	asterai "github.com/asterai-io/sdk/go/protobuf"
)

func KvGetUserString(user string, key string) string {
	requestMessage := asterai.HostKvGetUserStringRequest{
		UserId: user,
		Key:    key,
	}
	requestBytes, _ := requestMessage.MarshalVT()
	requestPtr := WriteBuffer(requestBytes)
	responsePtr := hostKvGetUserString(requestPtr)
	responseBytes := ReadBuffer(responsePtr)
	response := &asterai.HostKvGetUserStringResponse{}
	_ = response.UnmarshalVT(responseBytes)
	return response.GetValue()
}

func KvSetUserString(user string, key string, value *string) {
	requestMessage := asterai.HostKvSetUserStringRequest{
		UserId: user,
		Key:    key,
		Value:  value,
	}
	requestBytes, _ := requestMessage.MarshalVT()
	requestPtr := WriteBuffer(requestBytes)
	hostKvSetUserString(requestPtr)
}
