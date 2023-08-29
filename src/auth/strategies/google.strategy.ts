import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as GoogleTokenStrategy from 'passport-google-verify-token';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleTokenStrategy.Strategy,
  'google-token',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    console.log('in google strategy');
    super({
      clientID: [
        configService.get<string>('google.clientId'),
        configService.get<string>('google.clientId2'),
      ],
      clientSecret: configService.get<string>('google.clientSecret'),
      passReqToCallBack: true,
    });    
  }

  async validate(
    parsedToken: any,
    googleId: any,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    console.log('validating in strategy');
    console.log(parsedToken);
    console.log(googleId);

    const tokenData = {
      id: googleId,
      email: parsedToken.email,
      firstName: parsedToken.given_name,
      lastName: parsedToken.family_name,
      token: googleId,
    };

    const user = await this.authService.loginOrRegisterByGoogleAccount(
      tokenData.id,
      tokenData.email,
      tokenData.firstName,
      tokenData.lastName,
      tokenData.token,
    );

    console.log('user in strategy validate:');
    console.log(user);
    

    done(null, user);
  }
}
