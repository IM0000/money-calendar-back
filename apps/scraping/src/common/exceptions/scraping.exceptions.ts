import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 스크래핑 작업 중 발생하는 모든 예외의 기본 클래스
 */
export class ScrapingException extends HttpException {
  constructor(
    message = '스크래핑 중 오류가 발생했습니다',
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly errorCode = 'SCRAPING_ERROR',
    public readonly details?: any,
  ) {
    super(
      {
        message,
        error: 'Scraping Error',
        errorCode,
        details,
      },
      statusCode,
    );
  }
}

/**
 * 네트워크 연결 오류 클래스
 */
export class NetworkException extends ScrapingException {
  constructor(message = '네트워크 연결에 실패했습니다', details?: any) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, 'NETWORK_ERROR', details);
  }
}

/**
 * 웹페이지 요소를 찾을 수 없는 경우의 오류 클래스
 */
export class ElementNotFoundException extends ScrapingException {
  constructor(
    message = '웹페이지에서 필요한 요소를 찾을 수 없습니다',
    details?: any,
  ) {
    super(message, HttpStatus.BAD_REQUEST, 'ELEMENT_NOT_FOUND', details);
  }
}

/**
 * 타임아웃 오류 클래스
 */
export class TimeoutException extends ScrapingException {
  constructor(message = '요청 시간이 초과되었습니다', details?: any) {
    super(message, HttpStatus.GATEWAY_TIMEOUT, 'REQUEST_TIMEOUT', details);
  }
}

/**
 * 데이터 파싱 오류 클래스
 */
export class ParsingException extends ScrapingException {
  constructor(message = '데이터 파싱 중 오류가 발생했습니다', details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'PARSE_ERROR', details);
  }
}

/**
 * 웹사이트 구조 변경으로 인한 오류 클래스
 */
export class WebsiteStructureChangedException extends ScrapingException {
  constructor(
    message = '웹페이지 구조가 변경되어 데이터를 찾을 수 없습니다',
    details?: any,
  ) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      'WEBSITE_STRUCTURE_CHANGED',
      details,
    );
  }
}

/**
 * 웹사이트의 접근이 차단된 경우의 오류 클래스
 */
export class AccessBlockedException extends ScrapingException {
  constructor(message = '웹사이트에서 접근이 차단되었습니다', details?: any) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, 'ACCESS_BLOCKED', details);
  }
}
