export declare type UnionUserInfo = TextInfo | ArrayInfo | FileInfo;
export declare type TextInfo = {
    name: string;
    value: string;
};
export declare type ArrayInfo = {
    name: string;
    array: string[];
};
export declare type FileInfo = {
    name: string;
    base64: string;
    rawName: string;
    bucketName: string;
};
