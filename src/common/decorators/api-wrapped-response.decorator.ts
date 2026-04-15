import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../response/api-response';
import { PaginatedResponse, PaginationMeta } from '../response/pagination.response';

export const ApiWrappedResponse = <T extends Type>(
  dataDto?: T,
  options?: { isArray?: boolean },
) => {
  if (!dataDto) {
    return applyDecorators(
      ApiExtraModels(ApiSuccessResponse),
      ApiOkResponse({ schema: { $ref: getSchemaPath(ApiSuccessResponse) } }),
    );
  }

  const dataSchema = options?.isArray
    ? { type: 'array', items: { $ref: getSchemaPath(dataDto) } }
    : { $ref: getSchemaPath(dataDto) };

  return applyDecorators(
    ApiExtraModels(ApiSuccessResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponse) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
};

export const ApiPaginatedResponse = <T extends Type>(itemDto: T) =>
  applyDecorators(
    ApiExtraModels(ApiSuccessResponse, PaginatedResponse, PaginationMeta, itemDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponse) },
          {
            properties: {
              data: {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(itemDto) },
                  },
                  meta: { $ref: getSchemaPath(PaginationMeta) },
                },
              },
            },
          },
        ],
      },
    }),
  );