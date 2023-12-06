import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  SignInDto,
  SignUpDokterDto,
  SignUpDto,
  SignUpPerawatDto,
  SignUpStafDto,
} from './dto';
import { AbilityFactory, Actions } from '../ability/ability.factory';
import { ForbiddenError } from '@casl/ability';
import { Dokter, Staf } from '../ability/entities/rules.entitiy';

@Controller()
export class AuthController {
  private abilityFactory: AbilityFactory;

  constructor(
    private authService: AuthService,
    abilityFactory: AbilityFactory,
  ) {
    this.abilityFactory = abilityFactory;
  }

  /** allow for role -> SUPERADMIN **/
  @Post('signup')
  signUp(@Req() req: Request, @Body() dto: SignUpDto, @Res() res: Response) {
    const ability = this.abilityFactory.defineAbility(req['user']);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, Dokter);
      return this.authService.signUp(dto, res);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new HttpException(
          {
            message: e.message,
            error: 'Forbidden',
            status: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  @Post('signup/dokter')
  signUpDokter(
    @Req() req: Request,
    @Body() dto: SignUpDokterDto,
    @Res() res: Response,
  ) {
    const ability = this.abilityFactory.defineAbility(req['user']);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, Dokter);
      return this.authService.signUpDokter(dto, res);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new HttpException(
          {
            message: e.message,
            error: 'Forbidden',
            status: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  @Post('signup/perawat')
  signUpPerawat(@Body() dto: SignUpPerawatDto, @Res() res: Response) {
    return this.authService.signUpPerawat(dto, res);
  }

  @Post('signup/staf')
  signUpStaf(
    @Req() req: Request,
    @Body() dto: SignUpStafDto,
    @Res() res: Response,
  ) {
    const ability = this.abilityFactory.defineAbility(req['user']);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Create, Staf);
      return this.authService.signUpStaf(dto, res);
    } catch (e) {
      if (e instanceof ForbiddenError) {
        throw new HttpException(
          {
            message: e.message,
            error: 'Forbidden',
            status: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  /** allow for role -> all role **/
  @Post('signin')
  logIn(@Body() dto: SignInDto, @Res() res: Response) {
    return this.authService.signin(dto, res);
  }

  /** allow for role -> all role **/
  @Delete('signout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req, res);
  }

  /** free endpoint **/
  @Get('token')
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }
}
