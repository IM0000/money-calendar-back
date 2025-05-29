import { Test, TestingModule } from '@nestjs/testing';
import { IngestService } from './ingest.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  IngestDto,
  SourceName,
  CompanyDto,
  EconomicIndicatorDto,
  EarningsDto,
  DividendDto,
  ReleaseTiming,
} from './dto/ingest.dto';
import { BadRequestException } from '@nestjs/common';

describe('IngestService', () => {
  let service: IngestService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      company: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
      },
      economicIndicator: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        findMany: jest.fn(),
      },
      earnings: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        findMany: jest.fn(),
      },
      dividend: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<IngestService>(IngestService);
    jest.clearAllMocks();
  });

  describe('handleScrapedData', () => {
    it('should upsert company data when new', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Company,
        data: [
          { ticker: 'AAPL', name: 'Apple', country: 'US', marketValue: '1000' },
        ] as CompanyDto[],
      };
      mockPrisma.company.upsert.mockResolvedValue({} as any);

      await service.handleScrapedData(dto);

      expect(mockPrisma.company.upsert).toBeCalledWith({
        where: {
          ticker_country: { ticker: 'AAPL', country: 'US' },
        },
        create: {
          ticker: 'AAPL',
          country: 'US',
          name: 'Apple',
          marketValue: '1000',
        },
        update: {
          name: 'Apple',
          marketValue: '1000',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should upsert company data when existing', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Company,
        data: [
          { ticker: 'AAPL', name: 'Apple', country: 'US', marketValue: '1000' },
        ] as CompanyDto[],
      };
      mockPrisma.company.upsert.mockResolvedValue({} as any);

      await service.handleScrapedData(dto);

      expect(mockPrisma.company.upsert).toBeCalled(); // logic handles both create/update
    });

    it('should upsert economic indicator data', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.EconomicIndicator,
        data: [
          {
            country: 'US',
            releaseDate: 123n,
            name: 'CPI',
            importance: 5,
            actual: '3.0',
            forecast: '2.9',
          },
        ] as EconomicIndicatorDto[],
      };
      mockPrisma.economicIndicator.upsert.mockResolvedValue({} as any);

      await service.handleScrapedData(dto);

      expect(mockPrisma.economicIndicator.upsert).toBeCalledWith({
        where: {
          releaseDate_name_country: {
            name: 'CPI',
            country: 'US',
            releaseDate: 123n,
          },
        },
        create: {
          country: 'US',
          releaseDate: 123n,
          name: 'CPI',
          importance: 5,
          actual: '3.0',
          forecast: '2.9',
          previous: '',
        },
        update: {
          country: 'US',
          releaseDate: 123n,
          name: 'CPI',
          importance: 5,
          actual: '3.0',
          forecast: '2.9',
          previous: '',
        },
      });
    });

    it('should handle earnings data with transaction and upsert new', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Earnings,
        data: [
          {
            ticker: 'AAPL',
            country: 'US',
            releaseDate: 123n,
            releaseTiming: ReleaseTiming.UNKNOWN,
            actualEPS: '1.0',
            forecastEPS: '0.9',
            actualRevenue: '100',
            forecastRevenue: '90',
          },
        ] as EarningsDto[],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));
      mockPrisma.company.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.earnings.upsert.mockResolvedValue({} as any);
      mockPrisma.earnings.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.earnings.upsert).toBeCalledWith({
        where: {
          releaseDate_companyId: { companyId: 1, releaseDate: 123n },
        },
        create: expect.any(Object),
        update: expect.any(Object),
      });
    });

    it('should skip earnings when company not found', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Earnings,
        data: [
          { ticker: 'GOOG', country: 'US', releaseDate: 111n } as EarningsDto,
        ],
      };
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));
      mockPrisma.company.findFirst.mockResolvedValue(null);
      mockPrisma.earnings.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.earnings.upsert).not.toBeCalled();
    });

    it('should handle dividend data with transaction and upsert new', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Dividend,
        data: [
          {
            ticker: 'AAPL',
            country: 'US',
            exDividendDate: 123n,
            dividendAmount: '1.0',
            paymentDate: 456n,
            dividendYield: '2%',
          },
        ] as DividendDto[],
      };
      mockPrisma.$transaction.mockImplementation(async (cb) => cb(mockPrisma));
      mockPrisma.company.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.dividend.upsert.mockResolvedValue({} as any);
      mockPrisma.dividend.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.dividend.upsert).toBeCalledWith({
        where: {
          exDividendDate_companyId: { companyId: 1, exDividendDate: 123n },
        },
        create: expect.any(Object),
        update: expect.any(Object),
      });
    });

    it('should throw BadRequestException for unknown source', async () => {
      const dto: IngestDto = { sourceName: 'unknown' as any, data: [] };
      await expect(service.handleScrapedData(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
