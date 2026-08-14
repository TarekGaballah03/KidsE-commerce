import { Controller, Post, Get, Patch, Body, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AdminLoginDto, CustomerLoginDto, CustomerRegisterDto, UpdateCustomerProfileDto } from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setAuthCookie(res: Response, token: string) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAuthCookie(res: Response) {
    res.cookie('auth_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
  }

  @Public()
  @Post('admin/login')
  async adminLogin(@Body() dto: AdminLoginDto, @Res({ passthrough: true }) res: any) {
    const result = await this.authService.adminLogin(dto);
    this.setAuthCookie(res, result.token);
    return result;
  }

  @Get('admin/me')
  async getAdminMe(@CurrentUser() user: any) {
    return this.authService.getAdminMe(user.userId);
  }

  @Public()
  @Post('customer/login')
  async customerLogin(@Body() dto: CustomerLoginDto, @Res({ passthrough: true }) res: any) {
    const result = await this.authService.customerLogin(dto);
    this.setAuthCookie(res, result.token);
    return result;
  }

  @Public()
  @Post('customer/register')
  async customerRegister(@Body() dto: CustomerRegisterDto, @Res({ passthrough: true }) res: any) {
    const result = await this.authService.customerRegister(dto);
    this.setAuthCookie(res, result.token);
    return result;
  }

  @Get('customer/me')
  async getCustomerMe(@CurrentUser() user: any) {
    return this.authService.getCustomerMe(user.userId);
  }

  @Patch('customer/profile')
  async updateCustomerProfile(@CurrentUser() user: any, @Body() dto: UpdateCustomerProfileDto) {
    return this.authService.updateCustomerProfile(user.userId, dto);
  }

  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    this.clearAuthCookie(res);
    return { message: 'Logged out successfully' };
  }
}
