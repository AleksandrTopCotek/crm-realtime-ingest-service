import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import * as avro from 'avro-js';
import * as fs from 'fs';
import * as path from 'path';

const paymentSchemaPath = path.join(__dirname, '..', 'schemas', 'payment.avsc');
const paymentSchema = avro.parse(JSON.parse(fs.readFileSync(paymentSchemaPath, 'utf8')));

@Controller('deposit')
export class DepositController {
  logger = new Logger();
  constructor(private readonly depositService: DepositService) {}
  @MessagePattern('payment-topic') // название вашего Kafka-топика
  async handlePayment(@Payload() message: any, @Ctx() context: KafkaContext) {
    // message.value приходит в бинарном виде, декодируем
    const kafkaMessage = context.getMessage();
    const raw = kafkaMessage.value; // Buffer
    const decoded = await paymentSchema.fromBuffer(message.value);

    this.logger.log('Received payment:', decoded);
    this.logger.log(`topic, ${context.getTopic()}`);
  }
  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }

  @Get()
  findAll() {
    return this.depositService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositService.update(+id, updateDepositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositService.remove(+id);
  }
}
