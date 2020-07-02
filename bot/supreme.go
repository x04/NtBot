package bot

import (
	"NtBot/utils"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"time"
)

var (
	errBanned      = errors.New("task banned")
	errRateLimited = errors.New("task rate limited")

	errAtcBody    = errors.New("failed to read response body")
	errAtcInvalid = errors.New("invalid atc request")
	errAtcMarshal = errors.New("failed to marshal atc response body")
	errAtcStock   = errors.New("failed to add item to cart")

	UpdateStatus = func(info Info) {}
)

type AtcResponse []struct {
	SizeID  string `json:"size_id"`
	InStock bool   `json:"in_stock"`
}

type SupremeBot struct {
	Info   *Info
	client http.Client
}

func CreateSupremeBot(info *Info) *Base {
	var bot Base
	bot = &SupremeBot{Info: info}
	return &bot
}

func (bot *SupremeBot) GetInfo() *Info {
	return bot.Info
}

func (bot *SupremeBot) SetStatus(status string) {
	if bot.GetInfo().Status == status {
		return
	}
	bot.GetInfo().Status = status
	UpdateStatus(*bot.GetInfo())
}

func (bot *SupremeBot) SetCompleted(completed string) {
	bot.GetInfo().Completed = completed
	UpdateStatus(*bot.GetInfo())
}

func (bot *SupremeBot) Run() {
	start := time.Now()
	var err error
	bot.client, err = utils.NewHttpClient(bot.GetInfo().Proxy)
	if err != nil {
		log.Fatal(err)
		return
	}

	bot.SetStatus("Adding product to cart")
	for {
		err = bot.addToCart()
		if err != nil {
			bot.SetStatus(fmt.Sprintf("Error: %s", err))
			continue
		}
		break
	}
	bot.SetStatus("Item carted")

	bot.SetCompleted(time.Since(start).String())
}

func (bot *SupremeBot) addToCart() error {
	values := make(url.Values)
	values.Add("st", "25561")
	values.Add("s", "73247")
	values.Add("qty", "1")

	request, err := utils.NewPostRequest("https://www.supremenewyork.com/shop/x29fpqkwu/add.json", values)
	if err != nil {
		return err
	}

	response, err := bot.client.Do(request)
	if err != nil {
		return err
	}

	defer response.Body.Close()

	switch response.StatusCode {
	case http.StatusOK:
		break
	case http.StatusMovedPermanently:
		return errAtcInvalid
	case http.StatusForbidden:
		return errBanned
	case http.StatusTooManyRequests:
		return errRateLimited
	default:
		return fmt.Errorf("invalid response status code %d", response.StatusCode)
	}

	bodyBytes, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return errAtcBody
	}

	var atcResponse AtcResponse
	err = json.Unmarshal(bodyBytes, &atcResponse)
	if err != nil {
		return errAtcMarshal
	}

	if atcResponse[0].InStock != true {
		return errAtcStock
	}

	return nil
}
