
type QuestionData = {
	[key: string]: string[]
	cats?: Categories
}

type Categories = {
	[key: string]: Category
}

type Category = {
	[key: string]: string
}

type Question = [string, ...string?]