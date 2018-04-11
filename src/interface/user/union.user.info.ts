export type UnionUserInfo = TextInfo | ArrayInfo | FileInfo;
export interface TextInfo {
    name: string;
    value: string;
}

export interface ArrayInfo {
    name: string;
    array: Array<string>;
}

export interface FileInfo {
    name: string;
    base64: string;
    rawName: string;
    bucketName: string;
}
