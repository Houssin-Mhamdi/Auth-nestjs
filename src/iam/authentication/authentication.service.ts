import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
    constructor
    (@InjectRepository(User) private usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    ){}
    async signUp(SignUpDto: SignUpDto){
       try {
        const user = new User();
        user.email = SignUpDto.email
        user.password = await this.hashingService.hash(SignUpDto.password)
        await this.usersRepository.save(user);
       } catch (error) {
        const phUniqueViolationErrorCode = "23505"
        if(error.code === phUniqueViolationErrorCode) {
            throw new ConflictException()
       }
       throw error
    }

}

    async signIn(signInDto: SignInDto){
        const user = await this.usersRepository.findOneBy({
            email: signInDto.email
        })
        if(!user){
            throw new UnauthorizedException("User not found")
        }
        const isEqual = this.hashingService.compare(signInDto.password,user.password)
        
        if(!isEqual){
            throw new UnauthorizedException("Password not Match")

        }

        return true
 
    }
}