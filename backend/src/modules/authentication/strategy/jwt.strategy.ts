import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  

  async validate(payload: any) {
    var util = require('util');
    /* console.log(
      'We are in validate function in authentication module and payload is: ' +
        util.inspect(payload, { showHidden: false, depth: null, colors: true }),
    ); */

    /* if(payload.exp < Math.floor(Date.now()/1000)){      // Math.floor(Date.now()/1000) Converts Date.now() from miliseconds to seconds.
            console.log("payload is expired!");
            throw new GeneralException(401, 'Entered access token is expired please get new token.');
        } */

    return { userId: payload.sub, email: payload.email };
  }
}
