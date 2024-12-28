import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GeneralException } from 'src/modules/utility/exceptions/general.exception';
import { ErrorTypeEnum } from 'src/modules/utility/enums/error-type.enum';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { verifyProofDto } from '../dto/contract-dto';
import { ContractService } from '../services/contract.service';
import { UserService } from 'src/modules/user/services/user/user.service';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@ApiTags('Smart Contract')
@Controller('app/v1/contract')
export class contractController {
  constructor(
    private readonly contractService?: ContractService,
    private readonly userService?: UserService,
  ) {
    setTimeout(() => {
      this.contractService.syncAllServices();
      this.contractService.syncAllDevices();
    }, 4000);
  }

  @Post('/verify-zkp')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verifying the proof.',
    description: 'This api verifies then user proof code.',
  })
  async verifyProof(@Body() body: verifyProofDto, @Request() request) {
    console.log('We are in Verify Proof section', body);

    if (body.proof === null || body.proof === undefined || body.proof === '') {
      let errorMessage = 'proof is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.contractService.zpkProof(body.proof);
  }

  @Get('/get-wallet-balance')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Balance of wallet.',
    description: 'This api returns balance of entered wallet.',
  })
  async getWalletBalance(@Request() request) {
    const userRes = await this.userService.getUserProfileByIdFromUser(
      request.user.userId || '',
    );

    const walletAddress = userRes.walletAddress || '';

    if (
      walletAddress === null ||
      walletAddress === undefined ||
      walletAddress === ''
    ) {
      let errorMessage = 'walletAddress is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.contractService.getWalletBalance(walletAddress);
  }

  @Get('/admin-wallet')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin wallet address.',
    description: 'This api returns wallet address of admin.',
  })
  async adminWalletAddress() {
    return this.contractService.adminWalletData();
  }

  @Get('/chart-data')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get chart data',
    description: 'Fetches transaction counts for a given date range.',
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: true,
    description: 'The start date of the range in YYYY-MM-DD format.',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: true,
    description: 'The end date of the range in YYYY-MM-DD format.',
  })
  async getChartData(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD.');
    }

    return this.contractService.generateTransactionCounts(
      formatDate(start),
      formatDate(end),
    );
  }

  @Get('/faucet-wallet')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Faucet wallet address.',
    description: 'This api returns wallet address of faucet account.',
  })
  async faucetWalletAddress() {
    return this.contractService.faucetWalletData();
  }

  @Post('/request-faucet')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Requesting faucet.',
    description:
      'This api give some faucet to user wallet address entered in website.',
  })
  async requestFaucet(@Request() request) {
    const userRes = await this.userService.getUserProfileByIdFromUser(
      request.user.userId || '',
    );

    const walletAddress = userRes.walletAddress || '';

    if (
      walletAddress === null ||
      walletAddress === undefined ||
      walletAddress === ''
    ) {
      let errorMessage = 'walletAddress is not valid!';
      throw new GeneralException(
        ErrorTypeEnum.UNPROCESSABLE_ENTITY,
        errorMessage,
      );
    }

    return this.contractService.requestFaucet(walletAddress);
  }

  @Get('/search-data')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Searching data by string.',
    description:
      'This api return a search result between smart contract data by giving string.',
  })
  async searchInSmartContracts(@Query('search') search: string) {
    return await this.contractService.searchData(search);
  }

  @Post('/verify-proof')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Verifying an ZKP Proof.',
    description: 'This api return a boolean that proof is verified or not.',
  })
  async zkpVerifyProof(@Body() body: verifyProofDto) {
    return await this.contractService.zkpVerifyProofFromPython(body.proof);
  }

  @Get('/get-contract-data')
  @HttpCode(201)
  async getData(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const records = await this.contractService.getPaginatedRecords(
      Number(limit),
      Number(offset),
    );
    return records;
  }

  /* @Get('/fetch-service')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async fetchService() {
    return this.contractService.fetchAllServices();
  }

  @Post('/remove-service')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async removeService(@Body() body: removeServiceDto) {
    return this.contractService.removeService(body.nodeId, body.serviceId)
  }

  @Get('/fetch-device')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async fetchDevice() {
    return this.contractService.fetchAllDevices();
  }

  @Post('/remove-device')
  @HttpCode(201)
  @ApiOperation({
    summary: '',
    description: '',
  })
  async removeDevice(@Body() body: removeDeviceDto) {
    return this.contractService.removeSharedDevice(body.nodeId, body.deviceId)
  } */
}
