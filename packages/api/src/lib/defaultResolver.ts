import { Resolver, Query, Field, ObjectType } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Readable } from 'stream';

export class Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}

// TODO: Remove
@ObjectType()
export class DefaultEntity {
  @Field(() => GraphQLUpload)
  working: Upload;
}


@Resolver()
export class DefaultResolver {
  @Query(() => DefaultEntity)
  async default() {
    return { working: true };
  }
}
