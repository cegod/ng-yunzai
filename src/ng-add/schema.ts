export interface Schema {
    project: string;
    systemCode: string;
    clientType: 'CAS' | 'OPEN';
    stompPlugin: boolean;
}
