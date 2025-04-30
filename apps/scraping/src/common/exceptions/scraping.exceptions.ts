import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Base class for all scraping-related domain exceptions.
 */
export class ScrapingException extends Error {
  @ApiProperty({ description: 'HTTP 상태 코드', example: 500 })
  public readonly statusCode: number;

  @ApiProperty({ description: '에러 코드', example: 'SCRAPING_ERROR' })
  public readonly errorCode: string;

  @ApiProperty({ description: '에러 상세 정보', required: false })
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode = 'SCRAPING_ERROR',
    details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when a network error occurs during scraping.
 */
export class NetworkException extends ScrapingException {
  constructor(details?: any) {
    super(
      '네트워크 연결에 실패했습니다',
      HttpStatus.SERVICE_UNAVAILABLE,
      'NETWORK_ERROR',
      details,
    );
  }
}

/**
 * Thrown when an external request times out.
 */
export class TimeoutException extends ScrapingException {
  constructor(details?: any) {
    super(
      '요청 시간이 초과되었습니다',
      HttpStatus.GATEWAY_TIMEOUT,
      'REQUEST_TIMEOUT',
      details,
    );
  }
}

/**
 * Thrown when parsing of data fails.
 */
export class ParsingException extends ScrapingException {
  constructor(details?: any) {
    super(
      '데이터 파싱 중 오류가 발생했습니다',
      HttpStatus.BAD_REQUEST,
      'PARSE_ERROR',
      details,
    );
  }
}

/**
 * Thrown when the expected element cannot be found in the HTML.
 */
export class ElementNotFoundException extends ScrapingException {
  constructor(details?: any) {
    super(
      '필수 HTML 요소를 찾을 수 없습니다',
      HttpStatus.BAD_REQUEST,
      'ELEMENT_NOT_FOUND',
      details,
    );
  }
}

/**
 * Thrown when the website structure has changed and scraping is no longer valid.
 */
export class WebsiteStructureChangedException extends ScrapingException {
  constructor(details?: any) {
    super(
      '웹사이트 구조가 변경되어 스크래핑이 실패했습니다',
      HttpStatus.BAD_GATEWAY,
      'WEBSITE_STRUCTURE_CHANGED',
      details,
    );
  }
}

/**
 * Thrown when access is blocked by the target site.
 */
export class AccessBlockedException extends ScrapingException {
  constructor(details?: any) {
    super(
      '스크래핑 접근이 차단되었습니다',
      HttpStatus.FORBIDDEN,
      'ACCESS_BLOCKED',
      details,
    );
  }
}
