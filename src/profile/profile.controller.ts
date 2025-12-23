import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MessagePattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import * as avro from 'avro-js';
import * as fs from 'fs';
import * as path from 'path';
const profileSchemaPath = path.join(__dirname, '..', 'schemas', 'profile.avsc');
const profileSchema = avro.parse(JSON.parse(fs.readFileSync(profileSchemaPath, 'utf8')));

@Controller('Profile')
export class ProfileController {
  logger = new Logger();
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('profile-topic') // название вашего Kafka-топика
  async handlePayment(@Payload() message: any, @Ctx() context: KafkaContext) {
    // message.value приходит в бинарном виде, декодируем
    const kafkaMessage = context.getMessage();
    const raw = kafkaMessage.value; // Buffer
    const decoded = await profileSchema.fromBuffer(message.value);

    this.logger.log('Received profile:', decoded);
    this.logger.log(`topic, ${context.getTopic()}`);
  }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
