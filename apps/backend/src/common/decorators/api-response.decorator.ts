import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponse } from '../types/api-response';

export function ApiResponseWrapper<TModel extends Type<any>>(
  model: TModel,
  isArray = false,
) {
  const schema = {
    allOf: [
      { $ref: getSchemaPath(ApiResponse) },
      {
        properties: {
          data: isArray
            ? { type: 'array', items: { $ref: getSchemaPath(model) } }
            : { $ref: getSchemaPath(model) },
        },
      },
    ],
  };

  return applyDecorators(
    ApiExtraModels(ApiResponse, model),
    ApiOkResponse({ schema }),
  );
}
