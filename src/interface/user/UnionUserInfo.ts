export type UnionUserInfo = SingleRowText | MultiRowText | Radio | CheckBox | Date | PulldownMenu | File

type SingleRowText = {
    name: string
    value: string
}

type MultiRowText = {
    name: string
    value: string
}

type Radio = {
    name: string
    value: string
}

type CheckBox = {
    name: string
    value: string[]
}

type Date = {
    name: string
    value: string
}

type PulldownMenu = {
    name: string
    value: string
}

type File = {
    name: string
    value: string
    rawName: string
}
