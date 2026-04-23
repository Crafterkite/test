import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { RequestsModule } from './requests/requests.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    OrganizationModule,
    WorkspaceModule,
    RequestsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'api/v1/auth/(.*)', method: RequestMethod.ALL },
        { path: 'api/v1/organizations', method: RequestMethod.POST },
      )
      .forRoutes(
        { path: 'api/v1/organizations', method: RequestMethod.GET },
        { path: 'api/v1/organizations/:id', method: RequestMethod.ALL },
        { path: 'api/v1/workspaces', method: RequestMethod.ALL },
        { path: 'api/v1/workspaces/:id', method: RequestMethod.ALL },
        { path: 'api/v1/requests', method: RequestMethod.ALL },
        { path: 'api/v1/requests/:id', method: RequestMethod.ALL },
      );
  }
}
