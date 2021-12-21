import bcrypt from 'bcrypt';
import "reflect-metadata";
import { Sequelize } from 'sequelize-typescript';
import { Permissions } from '../data/models/dto';
import { Initializable } from '../infra/initializable';
import colors from "colors";
import { ApiKeyModel, ApplicationSettingsModel, TokenHistoryModel, UserModel } from './dbModels/dbmodels';
//import { requireInitialize } from "../infra/Initializable";

export default class DbProvider implements Initializable {
  private readonly _sequelize: Sequelize
  private _wasInit: boolean = false;

  constructor() {
    let envSettings = process.env;
    let logdb = !Boolean(envSettings.DB_OUTPUT_LOG) || (()=>{});
    this._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: envSettings.DB_PATH,
      logging: logdb,
      models: [UserModel, ApiKeyModel, TokenHistoryModel, ApplicationSettingsModel]
    });
    //this._sequelize.getRepository
  }
  isInit(): boolean {
    return this._wasInit;
  }

  async initialize(): Promise<boolean> {
    if (this._wasInit) {
      return new Promise(resolve => resolve(this._wasInit));
    }
    console.log(colors.yellow('Initing database...'));
    await this.checkConnection();
    await this.populateDb();
    this._wasInit = true;
    return new Promise(resolve => resolve(this._wasInit));
  }

  //@requireInitialize
  async checkConnection() {
    try {
      await this._sequelize.sync({ force: true });
      await this._sequelize.authenticate();
      console.log(colors.green('Connection has been established successfully.'));
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw new Error("Unable to connect to the database");
    }
  }

  //@requireInitialize
  //this method is for demo version only contains the info which is not suppose to be stored
  async populateDb() {

    let settings = new ApplicationSettingsModel({
      apiKeyValidOnlyForIssuer: true
    });

    let plainPasword = await bcrypt.hash('plainPasword', 10);

    let user = new UserModel({
      id: 777,
      firstName: 'User',
      lastName: 'Userovich',
      email: 'user@user.com',
      password: plainPasword,
      permissions: Permissions.Read | Permissions.Modify
    });

    await Promise.all([user.save(), settings.save()]);
  }
}

