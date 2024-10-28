import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { Auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwt: Jwt,
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>
    ) {}

  //Decode token
  public async decode(token: string): Promise<Auth> {
    return await this.jwt.decode(token, null);
  }

  //Generate Token
  public async generateToken(auth: Auth): Promise<string> {
    return this.jwt.sign({
      id: auth.id,
      username: auth.username,
      roleId: auth.roleId}); 
  }

  //vertify token
  public async verifyToken(token: string): Promise<Auth> {
    try{
        return await this.jwt.verify(token);
    }
    catch (e) {
        throw new Error("Invalid token");
        console.log(e.message);
    }
}
  //Validate user password
  async isPasswordValid(password: string, userPassword: string): Promise<boolean>{
    try{
      return await bcrypt.compare(password, userPassword);
    }
    catch(e){
      throw new Error("Password invalid");
      console.log(e.message);
      
    }
  }
  //validate user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validateUser(decoded: any): Promise<Auth>{
    try{
      return await this.repository.findOneBy({id: decoded.id})
    }
    catch(e){
      throw new Error("User Not Found");
      console.log(e.message);
      
    }
  }

  //hash password
  async hashPassword(password: string): Promise<string>{
    try{
      const salt = await bcrypt.getSalt(10);
      return await bcrypt.hash(password, salt);
    }
    catch(e){
      throw new Error("Password invalid");
      console.log(e.message);
    }
  }
}