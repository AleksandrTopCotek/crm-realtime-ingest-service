import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HandleConfigService {
  logger = new Logger();
  envPort = process.env.PORT;
  envKFUsername = process.env.KF_USERNAME;
  envKFPassword = process.env.KF_PASSWORD;
  envKFSSL = process.env.KF_SSL_MECH;
  envKFSecProt = process.env.KF_SEC_PROT;
  envKFConsumerGroupName = process.env.KF_CONS_GROUP_NAME;
  envKFTopicName = process.env.KF_TOPIC_NAME;
  envKFBroker1 = process.env.KF_BROKER_ONE;
  envKFBroker2 = process.env.KF_BROKER_TWO;
  envKFBroker3 = process.env.KF_BROKER_THREE;
  envKFsslMech = process.env.KF_SSL_MECH;
  envGCPrunAud = process.env.GCP_RUN_AUDIENCE;
  envTopicSportRound = process.env.KF_SPORT_ROUND_TOPIC_NAME;
  envTopicProfileVerification = process.env.KF_PROFILE_VERIFICATION_TOPIC_NAME;
  envTopicBonusGameName = process.env.KF_BONUS_GAME_TOPIC_NAME;
  envWorkerUrl = process.env.WORKER_URL;
  getConfig(Key: ConfigKey): string {
    const value = this[Key];
    if (!value) {
      throw new Error(`Config ${Key} is not set`);
    }
    return value;
  }
  configExisting(): boolean {
    const keys = Object.keys(this)?.filter((k) => k.startsWith('env')) as ConfigKey[];
    for (const key of keys) {
      const value = this.getConfig(key);

      if (!value) {
        this.logger.error(`${keys[key]} is ${value}`);
        return false;
      }
    }
    return true;
  }
}
type ConfigKey = Extract<keyof HandleConfigService, `env${string}`>;
