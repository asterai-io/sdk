package sdk

import (
	"bufio"
	"bytes"
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
	if req.Header.Get("Content-Length") == "" {
		req.Header.Set("Content-Length", fmt.Sprintf("%v", len(body)))
	}
	if req.Header.Get("Connection") == "" {
		req.Header.Set("Connection", "close")
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
	reqBytes, err := dumpRequest(req, true)
	if err != nil {
		LogError(err.Error())
		return ""
	}
	return string(reqBytes)
}

// Copied over from https://pkg.go.dev/net/http/httputil
// as it is not included in TinyGo.
func dumpRequest(req *http.Request, body bool) ([]byte, error) {
	var err error
	save := req.Body
	if !body || req.Body == nil {
		req.Body = nil
	} else {
		save, req.Body, err = drainBody(req.Body)
		if err != nil {
			return nil, err
		}
	}

	var b bytes.Buffer

	// By default, print out the unmodified req.RequestURI, which
	// is always set for incoming server requests. But because we
	// previously used req.URL.RequestURI and the docs weren't
	// always so clear about when to use dumpRequest vs
	// DumpRequestOut, fall back to the old way if the caller
	// provides a non-server Request.
	reqURI := req.RequestURI
	if reqURI == "" {
		reqURI = req.URL.RequestURI()
	}

	fmt.Fprintf(&b, "%s %s HTTP/%d.%d\r\n", valueOrDefault(req.Method, "GET"),
		reqURI, req.ProtoMajor, req.ProtoMinor)

	absRequestURI := strings.HasPrefix(req.RequestURI, "http://") || strings.HasPrefix(req.RequestURI, "https://")
	if !absRequestURI {
		host := req.Host
		if host == "" && req.URL != nil {
			host = req.URL.Host
		}
		if host != "" {
			fmt.Fprintf(&b, "Host: %s\r\n", host)
		}
	}

	chunked := len(req.TransferEncoding) > 0 && req.TransferEncoding[0] == "chunked"
	if len(req.TransferEncoding) > 0 {
		fmt.Fprintf(&b, "Transfer-Encoding: %s\r\n", strings.Join(req.TransferEncoding, ","))
	}

	err = req.Header.WriteSubset(&b, reqWriteExcludeHeaderDump)
	if err != nil {
		return nil, err
	}

	io.WriteString(&b, "\r\n")

	if req.Body != nil {
		var dest io.Writer = &b
		if chunked {
			dest = NewChunkedWriter(dest)
		}
		_, err = io.Copy(dest, req.Body)
		if chunked {
			dest.(io.Closer).Close()
			io.WriteString(&b, "\r\n")
		}
	}

	req.Body = save
	if err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

func drainBody(b io.ReadCloser) (r1, r2 io.ReadCloser, err error) {
	if b == nil || b == http.NoBody {
		// No copying needed. Preserve the magic sentinel meaning of NoBody.
		return http.NoBody, http.NoBody, nil
	}
	var buf bytes.Buffer
	if _, err = buf.ReadFrom(b); err != nil {
		return nil, b, err
	}
	if err = b.Close(); err != nil {
		return nil, b, err
	}
	return io.NopCloser(&buf), io.NopCloser(bytes.NewReader(buf.Bytes())), nil
}

var reqWriteExcludeHeaderDump = map[string]bool{
	"Host":              true, // not in Header map anyway
	"Transfer-Encoding": true,
	"Trailer":           true,
}

func NewChunkedWriter(w io.Writer) io.WriteCloser {
	return &chunkedWriter{w}
}

type chunkedWriter struct {
	Wire io.Writer
}

func (cw *chunkedWriter) Write(data []byte) (n int, err error) {

	// Don't send 0-length data. It looks like EOF for chunked encoding.
	if len(data) == 0 {
		return 0, nil
	}

	if _, err = fmt.Fprintf(cw.Wire, "%x\r\n", len(data)); err != nil {
		return 0, err
	}
	if n, err = cw.Wire.Write(data); err != nil {
		return
	}
	if n != len(data) {
		err = io.ErrShortWrite
		return
	}
	if _, err = io.WriteString(cw.Wire, "\r\n"); err != nil {
		return
	}
	if bw, ok := cw.Wire.(*FlushAfterChunkWriter); ok {
		err = bw.Flush()
	}
	return
}

func (cw *chunkedWriter) Close() error {
	_, err := io.WriteString(cw.Wire, "0\r\n")
	return err
}

type FlushAfterChunkWriter struct {
	*bufio.Writer
}

func valueOrDefault(value, def string) string {
	if value != "" {
		return value
	}
	return def
}
