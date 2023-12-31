import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService){}

    @Post("sign-up")
    singUp(@Body() signUpDto: SignUpDto){
        return this.authService.signUp(signUpDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post("sign-in")
    signIn(@Body() signInDto: SignInDto){
        return this.authService.signIn(signInDto)
    }
}
