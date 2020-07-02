package taskMngr

import (
	"NtBot/bot"
	"NtBot/utils"
	"errors"
	"sync"
)

var (
	errInvalidBotType = errors.New("invalid bot type")
	errExists         = errors.New("task id already exists")
	errNotExists      = errors.New("task does not exist")

	tasks     = make(map[string]*bot.Base)
	taskMutex = sync.Mutex{}
)

func GetTasks() *map[string]*bot.Base {
	return &tasks
}

func AddTaskFromInfo(info *bot.Info) (string, error) {
	taskMutex.Lock()
	defer taskMutex.Unlock()
	if _, ok := tasks[info.Id]; ok {
		return "", errExists
	}

	switch info.Type {
	case bot.Supreme:
		tasks[info.Id] = bot.CreateSupremeBot(info)
		return info.Id, nil
	case bot.Shopify:
		return "", nil
	default:
		return "", errInvalidBotType
	}
}

func AddTaskFromBot(task *bot.Base) (string, error) {
	taskInfo := (*task).GetInfo()
	taskMutex.Lock()
	defer taskMutex.Unlock()
	if _, ok := tasks[taskInfo.Id]; ok {
		return "", errExists
	}

	tasks[taskInfo.Id] = task
	return taskInfo.Id, nil
}

func DeleteTaskFromId(id string) error {
	taskMutex.Lock()
	defer taskMutex.Unlock()
	if 	_, ok := tasks[id]; !ok {
		return errNotExists
	}

	delete(tasks, id)
	return nil
}

func GetTaskInfo(id string) (bot.Info, error) {
	taskMutex.Lock()
	defer taskMutex.Unlock()
	if task, ok := tasks[id]; ok {
		return *(*task).GetInfo(), nil
	}

	return bot.Info{}, errNotExists
}

func RunTask(id string) error {
	taskMutex.Lock()
	defer taskMutex.Unlock()
	if task, ok := tasks[id]; ok {
		go (*task).Run()
		return nil
	}

	return errNotExists
}

func StructTest() *bot.Info {
	return &bot.Info{
		Id:   utils.RandomString(8),
		Type: bot.Supreme,
		SearchProduct: bot.SearchProduct{
			ProductKeywords: []string{
				"box",
				"logo",
				"-tee",
			},
			StyleKeywords: []string{
				"white",
			},
			SizeKeywords: []string{
				"small",
			},
		},
		BillingProfile: bot.BillingProfile{
			Name:      "Default",
			FirstName: "John",
			LastName:  "Doe",
			Email:     "cc@ring3.io",
			Phone:     "123-456-7890",
			Address:   "1342 Lane St",
			Address2:  "",
			Address3:  "",
			City:      "New York",
			Zip:       "12345",
			Country:   "NY",
			CcNumber:  "4242 4242 4242 4242",
			CcExpir:   "09/25",
			CcCvv:     "123",
		},
		Proxy:     "",
		Status:    "Idle",
		Completed: "n/a",
	}
}
