import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTestService } from './notification-test.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NotificationTestService', () => {
  let service: NotificationTestService;
  let prismaService: PrismaService;

  // Mock Date.now()
  const dateSpy = jest.spyOn(Date, 'now');
  const mockNow = 1623456789000;

  const mockPrismaService = {
    economicIndicator: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    earnings: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationTestService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationTestService>(NotificationTestService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Setup mock Date.now()
    dateSpy.mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testIndicatorActual', () => {
    it('should update indicator actual value with timestamp', async () => {
      const mockIndicator = {
        id: 1,
        name: 'GDP',
        actual: '',
        forecast: '2.2%',
      };
      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
        mockIndicator,
      );
      mockPrismaService.economicIndicator.update.mockResolvedValue({
        ...mockIndicator,
        actual: mockNow.toString(),
      });

      const result = await service.testIndicatorActual(1);

      expect(prismaService.economicIndicator.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.economicIndicator.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actual: mockNow.toString() },
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if indicator not found', async () => {
      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(null);

      await expect(service.testIndicatorActual(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.economicIndicator.update).not.toHaveBeenCalled();
    });
  });

  describe('restoreIndicatorActual', () => {
    it('should restore indicator actual value to empty string', async () => {
      const mockIndicator = {
        id: 1,
        name: 'GDP',
        actual: '2.5%',
        forecast: '2.2%',
      };
      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
        mockIndicator,
      );
      mockPrismaService.economicIndicator.update.mockResolvedValue({
        ...mockIndicator,
        actual: '',
      });

      const result = await service.restoreIndicatorActual(1);

      expect(prismaService.economicIndicator.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.economicIndicator.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actual: '' },
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if indicator not found', async () => {
      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(null);

      await expect(service.restoreIndicatorActual(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.economicIndicator.update).not.toHaveBeenCalled();
    });
  });

  describe('testEarningsActual', () => {
    it('should update earnings actualEPS with timestamp', async () => {
      const mockEarnings = { id: 1, actualEPS: '', forecastEPS: '1.2' };
      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.earnings.update.mockResolvedValue({
        ...mockEarnings,
        actualEPS: mockNow.toString(),
      });

      const result = await service.testEarningsActual(1);

      expect(prismaService.earnings.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.earnings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actualEPS: mockNow.toString() },
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if earnings not found', async () => {
      mockPrismaService.earnings.findUnique.mockResolvedValue(null);

      await expect(service.testEarningsActual(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.earnings.update).not.toHaveBeenCalled();
    });
  });

  describe('restoreEarningsActual', () => {
    it('should restore earnings actualEPS to "--"', async () => {
      const mockEarnings = { id: 1, actualEPS: '1.5', forecastEPS: '1.2' };
      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.earnings.update.mockResolvedValue({
        ...mockEarnings,
        actualEPS: '--',
      });

      const result = await service.restoreEarningsActual(1);

      expect(prismaService.earnings.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.earnings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { actualEPS: '--' },
      });
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if earnings not found', async () => {
      mockPrismaService.earnings.findUnique.mockResolvedValue(null);

      await expect(service.restoreEarningsActual(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.earnings.update).not.toHaveBeenCalled();
    });
  });
});
