import { Authorized, Query, Resolver, Arg } from 'type-graphql';

import { ETemplate } from '../entities/Template.entity';
import { TemplateService } from '../services/Template.service';


@Resolver(ETemplate)
export class TemplateResolver {
  @Authorized()
  @Query(() => ETemplate, { nullable: true })
  async template(@Arg('url') url: string) {
    return TemplateService.findByUrl(url);
  }

  @Authorized()
  @Query(() => [ETemplate])
  async templateList() {
    return TemplateService.findAll();
  }
}
