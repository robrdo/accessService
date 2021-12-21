import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ApiKey, ApiKeyStatus, ApplicationSettings, Permissions, TokenHistory, User } from "../../data/models/dto";

@Table(
    {
        tableName: "appSettings"
    }
)
export class ApplicationSettingsModel extends Model implements ApplicationSettings {
    @Column
    apiKeyValidOnlyForIssuer: boolean
}

@Table(
    {
        tableName: "user",
        timestamps: true
    }
)
//{primaryKey: true}
export class UserModel extends Model implements User {
    @Column
    firstName: string
    @Column
    lastName: string
    @Column
    email: string
    @Column
    password: string
    @Column
    permissions: Permissions
    @HasMany(() => ApiKeyModel)
    apiKeys: ApiKey[]
}

@Table(
    {
        tableName: "apiKey"
    }
)
export class ApiKeyModel extends Model implements ApiKey {
    @ForeignKey(() => UserModel)
    @Column
    userId: number
    @Column
    token?: string
    @Column
    status: ApiKeyStatus
    @Column
    permissions: Permissions
    @BelongsTo(() => UserModel)
    user: UserModel
    @HasMany(() => TokenHistoryModel)
    apiKeys: TokenHistory[]
}

@Table(
    {
        tableName: "tokenHistory"
    }
)
export class TokenHistoryModel extends Model implements TokenHistory {
    @Column
    token: string | null
    @ForeignKey(() => ApiKeyModel)
    @Column
    relatedApiKeyId: number
    @Column
    lastUpdate: Date
    @BelongsTo(() => ApiKeyModel)
    apiKey: ApiKey
}

/**
 * In order to not over complicate program,
 * we are going to write activity in plain string
 * instead of another description table
 */
/*@Table(
    {
        tableName: "userActivity"
    }
)
export class UserActivityModel extends Model implements UserActivity {
    @Column
    id?: number | null//DataTypes.UUID
    @ForeignKey(() => UserModel)
    @Column
    userId: number
    @ForeignKey(() => ApiKeyModel)
    @Column
    apiKeyId: number
    @Column
    activity: string
    @Column
    activityTime: Date
}
*/