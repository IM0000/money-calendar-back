import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-discord';
export default function CustomOauthStrategy(strategy: Strategy, name) {
  return class extends PassportStrategy(strategy, name) {
    readonly config: any;

    constructor(config) {
      super({
        ...config,
        callbackURL: '',
        passToReqCallback: true,
      });
      this.config = config;
    }

    authenticate(req: Request, options: any) {
      const newOptions = { ...this.config, ...options };
      const callbackURL = this.getCallbackURL(req.query.oauthMethod as string);
      newOptions.callbackURL = callbackURL;

      super.authenticate(req, newOptions);
    }

    getCallbackURL(oauthMethod: string) {
      if (oauthMethod === 'connect') {
        return this.config.connectCallbackURL;
      }
      return this.config.callbackURL;
    }
  };
}
