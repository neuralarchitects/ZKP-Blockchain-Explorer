import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';
import { join } from 'path';
import { Inject, Logger } from '@nestjs/common';
import { TestService } from './modules/broker/services/test.service';
import { MqttLogService } from './modules/broker/services/mqtt-log.service';
import { readFileSync } from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('/etc/nginx/ssl/privkey.pem'),
    cert: readFileSync('/etc/nginx/ssl/fullchain.pem'),
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  const config = new DocumentBuilder()
    .setTitle('FidesInnova')
    .setDescription('The FidesInnova API description')
    .setVersion('2.1.0')
    .addTag('FidesInnova')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('app/api', app, document);

  app.useStaticAssets(join(__dirname, '../uploads'));

  // app.enableCors();
  app.enableCors({
    origin: [
      'https://fidesf2-explorer.fidesinnova.io',
      'http://localhost:3000',
    ],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    credentials: true, // Enable credentials (cookies, authorization headers) cross-origin

    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  await app.listen(process.env.HOST_PORT);
  console.log(
    '\x1B[32m \nApplication successfully started on port \x1B[0m',
    process.env.HOST_PORT,
  );

  // Launching broker
  // console.log('\x1B[33m \nLaunching broker... \x1B[0m');
  // const broker = require('./modules/broker/server/mqtt-server');

  // const tset = require('./modules/broker/server/test');
  // const test = require('./modules/broker/server/test-class');
  // test.startup();

  // let testService: TestService = new TestService();
  let mqttLogService: MqttLogService = new MqttLogService();
  let testService: TestService = new TestService(mqttLogService);
  testService.printMsg();
  testService.callDeviceModule();

  // Run MQTT Server.
  const mqttServerRunner = require('./modules/broker/server/mqtt-server');

  // Run Blockly Server.
  const blocklyServerRunner = require('./modules/blockly/server/blockly-server');
}
bootstrap();
