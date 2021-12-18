export interface User {
    id?: number | null
    firstName: string
    lastName: string
    email: string
    password: string
    permissions: Permissions
}

export interface ApplicationSettings {
    //jwtSecret: string
    //if false - user can give the apikey to anyone. Usage of key regardless of issuer
    apiKeyValidOnlyForIssuer: boolean
}

export interface ApiKey {
    id?: number | null
    userId: number
    //tODO: arguable
    token?: string
    status: ApiKeyStatus
    permissions: Permissions
}

export interface TokenHistory {
    token?: string | null
    relatedApiKeyId: number
    //status : 
    lastUpdate: Date
}

/**
 * In order to not over complicate program,
 * we are going to write activity in plain string
 * instead of another description table
 */
export interface UserActivity {
    id?: number | null
    userId: number
    apiKeyId: number
    activity: string
    activityTime: Date
}

export enum Permissions {
    None,
    Read = 1 << 1,
    Modify = 1 << 3,
    Create = 1 << 2,
    Delete = 1 << 4
}

export enum ApiKeyStatus {
    Active,
    Revoked
}

export enum TokenStatus {
    Active,
    Expired
}
