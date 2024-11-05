package sdk

import (
	"fmt"
	asterai "github.com/asterai-io/sdk/go/protobuf"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func SendNewHttpRequest(
	method string,
	baseUrl string,
	query *map[string]string,
	headers *map[string]string,
	body string,
) *asterai.HostHttpResponse {
	req, _ := NewHttpRequest(method, baseUrl, query, headers, body)
	return SendHttpRequest(req)
}

func SendHttpRequest(req *http.Request) *asterai.HostHttpResponse {
	requestString := requestToRawString(req)
	requestMessage := asterai.HostHttpRequest{
		Request: requestString,
	}
	requestBytes, _ := requestMessage.MarshalVT()
	requestPtr := WriteBuffer(requestBytes)
	responsePtr := hostHttpRequest(requestPtr)
	responseBytes := ReadBuffer(responsePtr)
	response := &asterai.HostHttpResponse{}
	_ = response.UnmarshalVT(responseBytes)
	return response
}

func NewHttpRequest(
	method string,
	baseUrl string,
	query *map[string]string,
	headers *map[string]string,
	body string,
) (*http.Request, error) {
	parsedUrl := buildUrlWithQueryString(baseUrl, query)
	req, err := http.NewRequest(method, parsedUrl, strings.NewReader(body))
	if err != nil {
		return nil, err
	}
	for key, value := range *headers {
		req.Header.Set(key, value)
	}
	return req, nil
}

func buildUrlWithQueryString(baseURL string, query *map[string]string) string {
	u, err := url.Parse(baseURL)
	if err != nil {
		return ""
	}
	q := u.Query()
	for key, value := range *query {
		q.Set(key, value)
	}
	u.RawQuery = q.Encode()
	return u.String()
}

func requestToRawString(req *http.Request) string {
	var rawRequest string
	rawRequest += fmt.Sprintf("%s %s HTTP/1.1\r\n", req.Method, req.URL.String())
	for name, values := range req.Header {
		for _, value := range values {
			rawRequest += fmt.Sprintf("%s: %s\r\n", name, value)
		}
	}
	if req.Body != nil {
		// Note: This operation should be done carefully as it closes the body.
		body, _ := io.ReadAll(req.Body)
		rawRequest += "\r\n" + string(body)
	}
	return rawRequest
}
