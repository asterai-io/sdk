package main

import (
	"fmt"
	asterai "github.com/asterai-io/sdk/go/protobuf"
	"google.golang.org/protobuf/proto"
	"io"
	"net/http"
	"net/url"
	"strings"
)

func HttpRequest(
	method string,
	baseUrl string,
	query map[string]string,
	headers map[string]string,
	body string,
) asterai.HostHttpResponse {
	req, _ := buildRequest(method, baseUrl, query, headers, body)
	requestString := requestToRawString(req)
	requestMessage := asterai.HostHttpRequest{
		Request: requestString,
	}
	requestBytes, _ := proto.Marshal(&requestMessage)
	requestPtr := writeBuffer(requestBytes)
	responsePtr := hostHttpRequest(requestPtr)
	responseBytes := readBuffer(responsePtr)
	var response asterai.HostHttpResponse
	_ = proto.Unmarshal(responseBytes, &response)
	return response
}

func buildRequest(
	method string,
	baseUrl string,
	query map[string]string,
	headers map[string]string,
	body string,
) (*http.Request, error) {
	parsedUrl := buildUrlWithQueryString(baseUrl, query)
	req, err := http.NewRequest(method, parsedUrl, strings.NewReader(body))
	if err != nil {
		return nil, err
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	return req, nil
}

func buildUrlWithQueryString(baseURL string, query map[string]string) string {
	u, err := url.Parse(baseURL)
	if err != nil {
		return ""
	}
	q := u.Query()
	for key, value := range query {
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
