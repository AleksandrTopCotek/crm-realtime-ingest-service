import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleConfigService {
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
  getConfig(Key: ConfigKey): string | undefined {
    return this[Key];
  }
}
type ConfigKey = Extract<keyof HandleConfigService, `env${string}`>;
