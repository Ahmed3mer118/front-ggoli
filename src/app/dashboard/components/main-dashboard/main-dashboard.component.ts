import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../core/services/dashboard/reports.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// main-dashboard.component.ts
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css'],
})
export class MainDashboardComponent implements OnInit {
  report: any;
  isLoading = true;

  topCustomers: any[] = [];
  bestSellingProducts: any[] = [];
  overAllStatus: any = {};
  monthSales: any[] = [];

  constructor(private _reportService: ReportsService) {}

  ngOnInit(): void {
    this._reportService.getSalesReport().subscribe({
      next: (res) => {
        this.report = res.report[0];
        this.overAllStatus = this.report.overAllStatus[0] || {};
        this.topCustomers = this.report.topClients || [];
        this.bestSellingProducts = this.report.topProducts || [];
        this.monthSales = this.report.monthSales || [];
        this.isLoading = false;
        this.renderChart();
      },
      error: (err) => {
        console.error('Failed to load report:', err);
        this.isLoading = false;
      },
    });
 
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  downloadReport(period: 'month' | 'year') {
    this._reportService.getSalesReport(period).subscribe((res: any) => {
      const reportData = res?.report?.[0] || {};
      const overall = reportData.overAllStatus?.[0] || {};
      const topProducts = reportData.topProducts || [];
      const topClients = reportData.topClients || [];
      const monthSales = reportData.monthSales || [];
  
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString();
  
      doc.setFontSize(18);
      doc.text(`Sales Report for (${period === 'month' ? 'This Month' : 'This Year'})`, 14, 20);
      doc.setFontSize(12);
      doc.text(`History print: ${today}`, 14, 30);
  
      autoTable(doc, {
        startY: 35,
        head: [['Total Sales Amount', 'Total Quantity Sold', 'Number of Purchases']],
        body: [[
          ` ${overall.totalSaleAmount || 0} EGP`,
          overall.totalQuantitySold || 0,
          overall.numberOfPurchases || 0
        ]],
      });
  
      autoTable(doc, {
        startY: (doc as any).lastAutoTable?.finalY + 10 || 50,
        head: [['Product Name', 'Revenue', 'Quantity Sold']],
        body: topProducts.map((p: any) => [
          p.name,
          `${p.revenue} EGP`,
          p.soldQuantity
        ]),
      });
  
      autoTable(doc, {
        startY: (doc as any).lastAutoTable?.finalY + 10 || 80,
        head: [['Client Name', 'Email', 'Total Spent', 'Total Quantity']],
        body: topClients.map((c: any) => [
          c.username,
          c.email,
          `${c.totalSpent} EGP`,
          c.totalQuantity
        ]),
      });
  
      autoTable(doc, {
        startY: (doc as any).lastAutoTable?.finalY + 10 || 110,
        head: [['Year', 'Month', 'Total Revenue', 'Total Quantity']],
        body: monthSales.map((m: any) => [
          m._id?.year || '',
          m._id?.month || '',
          `${m.totalRevenue} EGP`,
          m.totalQuantity
        ]),
      });
  
      doc.save(`sales-report-${today}.pdf`);
    });
  }
  
  renderChart() {
    const labels = this.monthSales.map(
      (m) => `${m._id.month}/${m._id.year}`
    );
    const data = this.monthSales.map((m) => m.totalRevenue);
  
    new Chart('salesChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Monthly Revenue',
            data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      },
    });
  }
  
}




