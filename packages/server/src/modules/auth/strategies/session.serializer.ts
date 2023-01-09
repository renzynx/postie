import { PassportSerializer } from '@nestjs/passport';

export class SessionSerializer extends PassportSerializer {
  serializeUser(user: unknown, done: (...args) => void) {
    done(null, user);
  }

  deserializeUser(payload: unknown, done: (...args) => void) {
    done(null, payload);
  }
}
