package uiMngr

import (
	"NtBot/bot"
	"github.com/asticode/go-astilectron"
	bootstrap "github.com/asticode/go-astilectron-bootstrap"
)

var (
	Window *astilectron.Window
)

func Init() {
	bot.UpdateStatus = func(info bot.Info) {
		if Window != nil {
			_ = Window.SendMessage(bootstrap.MessageOut{Name: "updateTask", Payload: info})
		}
	}
}
