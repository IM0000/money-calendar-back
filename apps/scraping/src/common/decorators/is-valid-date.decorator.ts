import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * YYYYMMDD 형식의 문자열이 실제 유효한 날짜인지 검사하는 커스텀 데코레이터
 */
export function IsValidDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // 우선 형식이 8자리 숫자 문자열인지 체크
          if (typeof value !== 'string' || !/^\d{8}$/.test(value)) {
            return false;
          }
          const year = parseInt(value.substr(0, 4), 10);
          const month = parseInt(value.substr(4, 2), 10);
          const day = parseInt(value.substr(6, 2), 10);

          // JS Date를 이용해 실제 존재하는 날짜인지 확인
          const date = new Date(year, month - 1, day);
          return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid calendar date in YYYYMMDD format`;
        },
      },
    });
  };
}
