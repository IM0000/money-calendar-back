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
        update: jest.fn(),
        create: jest.fn(),
      },
      economicIndicator: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      earnings: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
      dividend: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
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
    it('should save company data', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Company,
        data: [
          { ticker: 'AAPL', name: 'Apple', country: 'US', marketValue: '1000' },
        ] as CompanyDto[],
      };
      mockPrisma.company.findFirst.mockResolvedValue(null);
      mockPrisma.company.create.mockResolvedValue({} as any);
      await service.handleScrapedData(dto);
      expect(mockPrisma.company.create).toBeCalledWith({ data: dto.data[0] });
    });

    it('should update existing company', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Company,
        data: [
          { ticker: 'AAPL', name: 'Apple', country: 'US', marketValue: '1000' },
        ] as CompanyDto[],
      };
      mockPrisma.company.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.company.update.mockResolvedValue({} as any);
      await service.handleScrapedData(dto);
      expect(mockPrisma.company.update).toBeCalledWith({
        where: { id: 1 },
        data: {
          name: 'Apple',
          marketValue: '1000',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should save economic indicator data', async () => {
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
      mockPrisma.economicIndicator.findFirst.mockResolvedValue(null);
      mockPrisma.economicIndicator.create.mockResolvedValue({} as any);
      await service.handleScrapedData(dto);
      expect(mockPrisma.economicIndicator.create).toBeCalledWith({
        data: {
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

    it('should update existing economic indicator', async () => {
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
      mockPrisma.economicIndicator.findFirst.mockResolvedValue({
        id: 1,
      } as any);
      mockPrisma.economicIndicator.update.mockResolvedValue({} as any);
      await service.handleScrapedData(dto);
      expect(mockPrisma.economicIndicator.update).toBeCalledWith({
        where: { id: 1 },
        data: {
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

    it('should handle earnings data with transaction and create new', async () => {
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

      mockPrisma.$transaction.mockImplementation(async (cb) => {
        await cb(mockPrisma);
      });
      mockPrisma.company.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.earnings.findFirst.mockResolvedValue(null);
      mockPrisma.earnings.create.mockResolvedValue({} as any);
      mockPrisma.earnings.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.earnings.create).toBeCalledWith({
        data: expect.objectContaining({
          country: 'US',
          releaseDate: 123n,
          releaseTiming: ReleaseTiming.UNKNOWN,
        }),
      });
    });

    it('should skip earnings when company not found', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Earnings,
        data: [
          { ticker: 'GOOG', country: 'US', releaseDate: 111n } as EarningsDto,
        ],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => {
        await cb(mockPrisma);
      });
      mockPrisma.company.findFirst.mockResolvedValue(null);
      mockPrisma.earnings.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.earnings.create).not.toBeCalled();
      expect(mockPrisma.earnings.update).not.toBeCalled();
    });

    it('should update previous earnings values correctly', async () => {
      const records = [
        {
          id: 10,
          companyId: 1,
          releaseDate: 100n,
          actualEPS: '1',
          actualRevenue: '10',
        },
        {
          id: 11,
          companyId: 1,
          releaseDate: 200n,
          actualEPS: '2',
          actualRevenue: '20',
        },
      ];
      mockPrisma.earnings.findMany.mockResolvedValue(records as any);
      mockPrisma.earnings.findFirst
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(records[0] as any);
      mockPrisma.earnings.update.mockResolvedValue({} as any);

      await service['updateEarningsPreviousValues'](mockPrisma as any);

      expect(mockPrisma.earnings.update).toBeCalledWith({
        where: { id: 11 },
        data: { previousEPS: '1', previousRevenue: '10' },
      });
    });

    it('should handle dividend data with transaction and create new', async () => {
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

      mockPrisma.$transaction.mockImplementation(async (cb) => {
        await cb(mockPrisma);
      });
      mockPrisma.company.findFirst.mockResolvedValue({ id: 1 } as any);
      mockPrisma.dividend.findFirst.mockResolvedValue(null);
      mockPrisma.dividend.create.mockResolvedValue({} as any);
      mockPrisma.dividend.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.dividend.create).toBeCalledWith({
        data: expect.objectContaining({
          country: 'US',
          exDividendDate: 123n,
        }),
      });
    });

    it('should skip dividend when company not found', async () => {
      const dto: IngestDto = {
        sourceName: SourceName.Dividend,
        data: [
          {
            ticker: 'GOOG',
            country: 'US',
            exDividendDate: 111n,
          } as DividendDto,
        ],
      };

      mockPrisma.$transaction.mockImplementation(async (cb) => {
        await cb(mockPrisma);
      });
      mockPrisma.company.findFirst.mockResolvedValue(null);
      mockPrisma.dividend.findMany.mockResolvedValue([]);

      await service.handleScrapedData(dto);

      expect(mockPrisma.dividend.create).not.toBeCalled();
    });

    it('should update previous dividend values correctly', async () => {
      const records = [
        { id: 20, companyId: 1, exDividendDate: 100n, dividendAmount: '5' },
        { id: 21, companyId: 1, exDividendDate: 200n, dividendAmount: '6' },
      ];
      mockPrisma.dividend.findMany.mockResolvedValue(records as any);
      mockPrisma.dividend.findFirst
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(records[0] as any);
      mockPrisma.dividend.update.mockResolvedValue({} as any);

      await service['updateDividendPreviousValues'](mockPrisma as any);

      expect(mockPrisma.dividend.update).toBeCalledWith({
        where: { id: 21 },
        data: { previousDividendAmount: '5' },
      });
    });

    it('should throw BadRequestException for unknown source', async () => {
      const dto: IngestDto = {
        sourceName: 'unknown' as any,
        data: [],
      };

      await expect(service.handleScrapedData(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
