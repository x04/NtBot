package uiMngr

import (
	"NtBot/taskMngr"
	"NtBot/utils"
	"github.com/asticode/go-astilectron"
	"github.com/asticode/go-astilectron-bootstrap"
	"strings"
)

// HandleMessages handles messages
func HandleMessages(w *astilectron.Window, m bootstrap.MessageIn) (payload interface{}, err error) {
	switch m.Name {
	case "maximize":
		_ = w.Maximize()
		break
	case "minimize":
		_ = w.Minimize()
		break
	case "close":
		_ = w.Close()
		_ = w.Destroy()
		break
	case "addTask":
		botInfo := taskMngr.StructTest()
		_, _ = taskMngr.AddTaskFromInfo(botInfo)
		payload = botInfo
		break
	case "duplicateTask":
		botInfo, _ := taskMngr.GetTaskInfo(strings.ReplaceAll(string(m.Payload), "\"", ""))
		botInfo.Id = utils.RandomString(6)
		_, _ = taskMngr.AddTaskFromInfo(&botInfo)
		payload = &botInfo
		break
	case "runTask":
		_ = taskMngr.RunTask(strings.ReplaceAll(string(m.Payload), "\"", ""))
		break
	case "deleteTask":
		_ = taskMngr.DeleteTaskFromId(strings.ReplaceAll(string(m.Payload), "\"", ""))
		break
	}
	return
}
