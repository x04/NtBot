package utils

import (
	"fmt"
	"golang.org/x/net/publicsuffix"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"
	"time"
)

const (
	UserAgent string = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/75.0.3770.85 Mobile/15E148 Safari/605.1"
	Patch     string = "PATCH"
	Post      string = "POST"
	Get       string = "GET"
)

type UserAgentTransport struct {
	RoundTripper http.RoundTripper
}

func (transport *UserAgentTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	req.Header.Add("User-Agent", UserAgent)
	return transport.RoundTripper.RoundTrip(req)
}

func NewTransport(proxyString string) (*UserAgentTransport, error) {
	if proxyString == "" {
		return &UserAgentTransport{http.DefaultTransport}, nil
	}

	if !strings.HasPrefix(proxyString, "http://") {
		proxyString = fmt.Sprintf("http://%s", proxyString)
	}

	proxyURL, err := url.Parse(proxyString)

	if err != nil {
		return nil, err
	}

	return &UserAgentTransport{&http.Transport{Proxy: http.ProxyURL(proxyURL)}}, nil
}

func NewHttpClient(proxyString string) (http.Client, error) {
	jar, err := cookiejar.New(&cookiejar.Options{PublicSuffixList: publicsuffix.List})
	if err != nil {
		return http.Client{
			Timeout: time.Second * 2,
		}, err
	}

	transport, err := NewTransport(proxyString)

	if err != nil {
		return http.Client{
			Jar:     jar,
			Timeout: time.Second * 2,
		}, err
	}

	return http.Client{
		Jar:       jar,
		Timeout:   time.Second * 2,
		Transport: transport,
	}, nil
}

func NewPostRequest(url string, values url.Values) (*http.Request, error) {
	return http.NewRequest(Post, url, strings.NewReader(values.Encode()))
}

func NewGetRequest(url string) (*http.Request, error) {
	return http.NewRequest(Get, url, nil)
}
