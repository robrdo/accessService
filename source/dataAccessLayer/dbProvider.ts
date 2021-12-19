import { Sequelize } from 'sequelize-typescript'
import { Permissions } from '../data/models/dto';
import { ApiKeyModel, ApplicationSettingsModel, TokenHistoryModel, UserModel } from './dbModels/dbmodels';
import bcrypt, { } from 'bcrypt';
import { Initializable } from '../infra/initializable';
//import { requireInitialize } from "../infra/Initializable";

//singleton - put isinit check

export default class DbProvider implements Initializable {
  private readonly _sequelize: Sequelize
  private _wasInit: boolean = false;

  constructor() {
    //TODO: get from env
    let envSettings = process.env;

    this._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: envSettings.STORAGE,
      models: [UserModel, ApiKeyModel, TokenHistoryModel, ApplicationSettingsModel]
    });

    //this._sequelize.addModels([ApplicationSettingsModel]);
    // [__dirname + '/models'] // or [Player, Team],

    //this._sequelize.getRepository

    //this.sequelize = new Sequelize('sqlite::memory:');
  }
  isInit(): boolean {
    return this._wasInit;
  }

  //todo: turn into injection singleton!

  async initialize(): Promise<void> {
    if (this._wasInit) {
      return
    }
    //todo exception handling
    await this.checkConnection();
    await this.populateDb();
    this._wasInit = true;
  }

  //@requireInitialize
  async checkConnection() {
    try {
      await this._sequelize.sync({ force: true });
      await this._sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw new Error("ddddddddd");
      //TODO: STOP THE APP
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
      id: 789,
      firstName: 'User',
      lastName: 'Userovich',
      email: 'user@user.com',
      password: plainPasword,
      permissions: Permissions.Read | Permissions.Modify
    });

    await Promise.all([user.save(), settings.save()]);
    let g = await UserModel.findOne();
    console.log('!!settings!!');
    console.log(JSON.stringify(g));
  }
}

