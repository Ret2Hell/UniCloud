import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt(10);
    return hash(data.toString(), salt);
  }
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data.toString(), encrypted);
  }
}
