import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('kpis')
  @Permissions(PERMISSIONS.REPORT_VIEW, PERMISSIONS.DASHBOARD_VIEW)
  async getKpis(@Query('dateRange') dateRange?: string) {
    return this.reportsService.getKpis(dateRange);
  }

  @Get('sales-chart')
  @Permissions(PERMISSIONS.REPORT_VIEW, PERMISSIONS.DASHBOARD_VIEW)
  async getSalesChart(@Query('dateRange') dateRange?: string) {
    return this.reportsService.getSalesChart(dateRange);
  }

  @Get('export')
  @Permissions(PERMISSIONS.REPORT_VIEW, PERMISSIONS.ORDER_EXPORT)
  async exportCsv(
    @Query('type') type: 'sales' | 'orders' | 'inventory' | 'customers',
    @Res() res: any,
  ) {
    const csvContent = await this.reportsService.generateCsvReport(type || 'orders');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="report-${type}-${Date.now()}.csv"`);
    return res.send(csvContent);
  }
}
