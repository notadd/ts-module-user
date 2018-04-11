export interface InfoItemsData {
    code: number;

    message: string;

    infoItems: Array<{
        id: number,
        name: string,
        type: string,
        default: boolean,
        description: string,
        necessary: boolean,
        registerVisible: boolean,
        informationVisible: boolean,
        order: number
    }>;
}
