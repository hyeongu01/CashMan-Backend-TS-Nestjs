import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getMyAccounts() {}
}
