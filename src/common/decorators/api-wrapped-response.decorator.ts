import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../response/api-response';

export const ApiWrappedResponse = <T extends Type>(dataDto?: T) => {
  if (!dataDto) {
    return applyDecorators(
      ApiExtraModels(ApiSuccessResponse),
      ApiOkResponse({ schema: { $ref: getSchemaPath(ApiSuccessResponse) } }),
    );
  }

  return applyDecorators(
    ApiExtraModels(ApiSuccessResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );
};