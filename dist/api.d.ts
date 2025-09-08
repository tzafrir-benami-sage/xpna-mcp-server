export declare const getSharedVersions: () => Promise<{
    id: string;
    name: string;
    description: string;
}[]>;
export declare const getUsers: () => Promise<{
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    accessLevel: string;
}[]>;
export declare const shareVersionWithUser: (userId: string, versionId: string) => Promise<boolean>;
//# sourceMappingURL=api.d.ts.map