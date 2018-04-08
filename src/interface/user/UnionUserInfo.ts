export type UnionUserInfo = TextInfo | ArrayInfo | FileInfo
export type TextInfo = {
    name: string
    value: string
}

export type ArrayInfo = {
    name: string
    array: string[]
}

export type FileInfo = {
    name: string
    base64: string
    rawName: string
    bucketName: string
}
