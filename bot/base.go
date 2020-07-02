package bot

type Type string

const (
	Supreme Type = "Supreme"
	Shopify Type = "Shopify"
)

type Base interface {
	Run()
	GetInfo() *Info
}

type SearchProduct struct {
	ProductKeywords []string
	StyleKeywords   []string
	SizeKeywords    []string
}

type BillingProfile struct {
	Name      string
	FirstName string
	LastName  string
	Email     string
	Phone     string
	Address   string
	Address2  string
	Address3  string
	City      string
	Zip       string
	Country   string
	CcNumber  string
	CcExpir   string
	CcCvv     string
}

type Info struct {
	Id             string
	Type           Type
	SearchProduct  SearchProduct
	BillingProfile BillingProfile
	Proxy          string
	Status         string
	Completed      string
}
