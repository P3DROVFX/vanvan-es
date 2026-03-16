import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TripService, TripHistoryDTO } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { inject } from '@angular/core';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-faturamento',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './faturamento.html',
  styleUrls: ['./faturamento.css']
})
export class Faturamento implements OnInit {
  isBrowser = false;
  isLoading = false;

  private tripService = inject(TripService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ===== Summary Data =====
  summary = {
    totalMonth: 0,
    totalWeek: 0,
    totalToday: 0,
    tripsMonth: 0,
    tripsWeek: 0,
    avgRating: 4.8,
    percentChange: 0
  };

  // ===== Block Chart Data (stacked blocks per month — equal size, faded opacity) =====
  blockChartData = [
    { label: 'Jan', value: 'R$ 2.800', blocks: 3, highlight: false },
    { label: 'Fev', value: 'R$ 3.200', blocks: 4, highlight: false },
    { label: 'Mar', value: 'R$ 2.950', blocks: 3, highlight: false },
    { label: 'Abr', value: 'R$ 3.800', blocks: 4, highlight: false },
    { label: 'Mai', value: 'R$ 4.100', blocks: 4, highlight: false },
    { label: 'Jun', value: 'R$ 3.600', blocks: 4, highlight: false },
    { label: 'Jul', value: 'R$ 4.200', blocks: 5, highlight: false },
    { label: 'Ago', value: 'R$ 4.520', blocks: 5, highlight: true },
  ];

  hoveredBlockIndex: number | null = null;

  getBlockOpacities(numBlocks: number, highlight: boolean): number[] {
    const opacities: number[] = [];
    for (let i = 0; i < numBlocks; i++) {
      const base = highlight ? 0.5 : 0.2;
      const step = highlight ? 0.5 / numBlocks : 0.8 / numBlocks;
      opacities.push(Math.min(base + step * (i + 1), 1));
    }
    return opacities;
  }

  hoveredTypeIndex: number | null = null;
  hoveredHourIndex: number | null = null;

  // ===== Monthly Goal =====
  monthlyGoal = 6000.00;

  get monthlyGoalPercent(): number {
    return Math.min(Math.round((this.summary.totalMonth / this.monthlyGoal) * 100), 100);
  }

  get ringCircumference(): number {
    return 2 * Math.PI * 80; // r=80 (larger ring)
  }

  get ringOffset(): number {
    const percent = this.monthlyGoalPercent / 100;
    return this.ringCircumference * (1 - percent);
  }

  // ===== Quick Metrics =====
  metrics = {
    totalKm: 0,
    totalPassengers: 0,
    avgPerTrip: 0,
    totalHours: 0,
    maxKm: 5000,
    maxPassengers: 200,
    maxPerTrip: 150,
    maxHours: 100,
  };

  // ===== Efficiency Ring =====
  efficiencyPercent = 78;

  get efficiencyCircumference(): number {
    return 2 * Math.PI * 52;
  }

  get efficiencyOffset(): number {
    return this.efficiencyCircumference * (1 - this.efficiencyPercent / 100);
  }

  // ===== Peak Hours (flattened for 4x4 grid = 16 items) =====
  peakHours = [
    { label: '06h', intensity: 0 },
    { label: '08h', intensity: 0 },
    { label: '10h', intensity: 0 },
    { label: '12h', intensity: 0 },
    { label: '07h', intensity: 0 },
    { label: '09h', intensity: 0 },
    { label: '11h', intensity: 0 },
    { label: '13h', intensity: 0 },
    { label: '14h', intensity: 0 },
    { label: '16h', intensity: 0 },
    { label: '18h', intensity: 0 },
    { label: '20h', intensity: 0 },
    { label: '15h', intensity: 0 },
    { label: '17h', intensity: 0 },
    { label: '19h', intensity: 0 },
    { label: '21h', intensity: 0 },
  ];

  // ===== Earnings by Type =====
  earningsByType = [
    { label: 'Passageiros', value: 0, percent: 100, color: '#F66B0E' },
    { label: 'Encomendas', value: 0, percent: 0, color: '#557D96' },
    { label: 'Frete', value: 0, percent: 0, color: '#31D0AA' },
  ];

  // ===== Recent Trips =====
  recentTrips: any[] = [];

  // ===== Monthly Comparison =====
  monthComparison = [
    {
      label: 'Faturamento',
      current: 'R$ 4.520',
      previous: 'R$ 4.018',
      change: '+12,5%',
      changePositive: true,
      currentPercent: 100,
      previousPercent: 89,
    },
    {
      label: 'Viagens',
      current: '32',
      previous: '28',
      change: '+14,3%',
      changePositive: true,
      currentPercent: 100,
      previousPercent: 87,
    },
    {
      label: 'Passageiros',
      current: '384',
      previous: '312',
      change: '+23,1%',
      changePositive: true,
      currentPercent: 100,
      previousPercent: 81,
    },
    {
      label: 'Cancelamentos',
      current: '2',
      previous: '5',
      change: '-60%',
      changePositive: true,
      currentPercent: 40,
      previousPercent: 100,
    },
  ];

  // ===== Destinations Data (top 3 only for visual legend) =====
  activeDestination: string | null = null;
  destinations: any[] = [];

  // ===== Line Chart — Monthly Revenue =====
  lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
    datasets: [
      {
        data: [2800, 3200, 2950, 3800, 4100, 3600, 4200, 4520],
        label: 'Faturamento (R$)',
        fill: true,
        tension: 0.45,
        borderColor: '#F66B0E',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(246, 107, 14, 0.1)';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(246, 107, 14, 0.3)');
          gradient.addColorStop(0.5, 'rgba(246, 107, 14, 0.08)');
          gradient.addColorStop(1, 'rgba(246, 107, 14, 0.0)');
          return gradient;
        },
        pointBorderColor: '#FAFAFA',
        pointBorderWidth: 3,
        pointRadius: [3, 3, 3, 3, 3, 3, 3, 6],
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#F66B0E',
        pointHoverBorderWidth: 4,
        pointBackgroundColor: '#F66B0E',
        borderWidth: 3,
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 43, 60, 0.92)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 14,
        cornerRadius: 14,
        displayColors: false,
        callbacks: {
          label: (context) => `R$ ${(context.parsed.y ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#94A3B8',
          font: { size: 11, weight: 500 as any }
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.04)',
          drawTicks: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          padding: 8,
          callback: (value) => `R$ ${Number(value).toLocaleString('pt-BR')}`
        }
      }
    }
  };

  // ===== Bar Chart — Trips per Day =====
  barChartData: ChartData<'bar'> = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [2, 3, 1, 4, 3, 5, 2],
        label: 'Viagens',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#F66B0E';
          const values = [2, 3, 1, 4, 3, 5, 2];
          const maxVal = Math.max(...values);
          if (context.dataIndex !== undefined && values[context.dataIndex] === maxVal) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, '#557D96');
            gradient.addColorStop(1, '#6F9DB8');
            return gradient;
          }
          // Create hatching pattern for non-peak bars using primary color
          const patternCanvas = document.createElement('canvas');
          patternCanvas.width = 8;
          patternCanvas.height = 8;
          const pctx = patternCanvas.getContext('2d')!;
          pctx.fillStyle = '#F66B0E';
          pctx.fillRect(0, 0, 8, 8);
          pctx.strokeStyle = 'rgba(255,255,255,0.4)';
          pctx.lineWidth = 1.5;
          pctx.beginPath();
          pctx.moveTo(0, 8);
          pctx.lineTo(8, 0);
          pctx.stroke();
          pctx.beginPath();
          pctx.moveTo(-2, 2);
          pctx.lineTo(2, -2);
          pctx.stroke();
          pctx.beginPath();
          pctx.moveTo(6, 10);
          pctx.lineTo(10, 6);
          pctx.stroke();
          return ctx.createPattern(patternCanvas, 'repeat')!;
        },
        hoverBackgroundColor: '#F66B0E',
        borderRadius: 999,
        borderSkipped: false,
        barPercentage: 0.75,
        categoryPercentage: 0.65,
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 43, 60, 0.92)',
        padding: 14,
        cornerRadius: 14,
        displayColors: false,
        titleFont: { weight: 'bold' },
        callbacks: {
          label: (context) => `${context.parsed.y} viagens`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#94A3B8',
          font: { size: 11, weight: 500 as any }
        }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
        border: { display: false },
        ticks: {
          color: '#94A3B8',
          font: { size: 11 },
          stepSize: 1,
          padding: 8,
        }
      }
    }
  };

  // ===== Doughnut Chart — Popular Destinations =====
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Recife', 'Garanhuns', 'Caruaru', 'Petrolina', 'Outros'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        borderColor: '#F66B0E',
        backgroundColor: [
          '#F66B0E',
          '#557D96',
          '#31D0AA',
          '#9333EA',
          '#94A3B8'
        ],
        borderWidth: 0,
        hoverOffset: 12,
        spacing: 3,
      }
    ]
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 43, 60, 0.92)',
        padding: 14,
        cornerRadius: 14,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  // ===== Period selector =====
  selectedPeriod: 'week' | 'month' | 'year' = 'month';

  ngOnInit(): void {
    this.fetchDriverTrips();
  }

  private fetchDriverTrips(): void {
    this.isLoading = true;
    const user = this.authService.currentUser();
    if (!user || !user.id) {
       this.isLoading = false;
       return;
    }

    this.tripService.getTripHistory(undefined, undefined, user.id, undefined, undefined, undefined, 0, 500).subscribe({
      next: (page) => {
        this.processTrips(page.content);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching driver faturamento', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private processTrips(trips: TripHistoryDTO[]): void {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Calculate week start (Sunday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const completedTrips = trips.filter(t => t.status === 'COMPLETED');

    // 1. Summary
    let monthTotal = 0;
    let weekTotal = 0;
    let todayTotal = 0;
    let monthCount = 0;
    let weekCount = 0;

    completedTrips.forEach(t => {
      const tripDate = new Date(t.date + 'T00:00:00');
      const amount = t.totalAmount || 0;

      if (t.date === todayStr) todayTotal += amount;
      if (tripDate >= weekStart) {
        weekTotal += amount;
        weekCount++;
      }
      if (tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear()) {
        monthTotal += amount;
        monthCount++;
      }
    });

    this.summary = {
      ...this.summary,
      totalMonth: monthTotal,
      totalWeek: weekTotal,
      totalToday: todayTotal,
      tripsMonth: monthCount,
      tripsWeek: weekCount
    };

    // 2. Metrics
    const totalKm = completedTrips.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
    const totalPass = completedTrips.reduce((sum, t) => sum + (t.passengerCount || 0), 0);
    const totalHours = completedTrips.length * 2.5; // Mocking duration if not available (e.g., 2.5h avg)

    this.metrics = {
      ...this.metrics,
      totalKm: Math.round(totalKm),
      totalPassengers: totalPass,
      avgPerTrip: monthCount > 0 ? monthTotal / monthCount : 0,
      totalHours: Math.round(totalHours),
      maxKm: Math.max(5000, totalKm * 1.5),
      maxPassengers: Math.max(200, totalPass * 1.5),
      maxHours: Math.max(100, totalHours * 1.5)
    };

    // 3. Peak Hours
    const hourCounts = new Array(24).fill(0);
    trips.forEach(t => {
      if (t.time) {
        const hour = parseInt(t.time.split(':')[0]);
        hourCounts[hour]++;
      }
    });
    const maxHour = Math.max(...hourCounts) || 1;
    this.peakHours = this.peakHours.map(ph => {
      const h = parseInt(ph.label);
      return { ...ph, intensity: Math.round((hourCounts[h] / maxHour) * 100) };
    });

    // 4. Destinations
    const destMap = new Map<string, number>();
    trips.forEach(t => {
      if (t.arrivalCity) {
        destMap.set(t.arrivalCity, (destMap.get(t.arrivalCity) || 0) + 1);
      }
    });
    const sortedDests = Array.from(destMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const colors = ['#F66B0E', '#557D96', '#31D0AA'];
    this.destinations = sortedDests.map(([name, count], i) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      percent: Math.round((count / trips.length) * 100),
      color: colors[i % colors.length]
    }));

    // Update Doughnut Chart
    this.doughnutChartData = {
      labels: sortedDests.map(d => d[0]),
      datasets: [{
        ...this.doughnutChartData.datasets[0],
        data: sortedDests.map(d => Math.round((d[1] / trips.length) * 100)),
        backgroundColor: colors.slice(0, sortedDests.length)
      }]
    };

    // 5. Monthly Revenue Chart (Line)
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const revenueByMonth = new Array(12).fill(0);
    completedTrips.forEach(t => {
       const d = new Date(t.date + 'T00:00:00');
       revenueByMonth[d.getMonth()] += (t.totalAmount || 0);
    });

    // Show last 8 months
    const currentMonth = now.getMonth();
    const chartLabels = [];
    const chartData = [];
    for (let i = 7; i >= 0; i--) {
       const idx = (currentMonth - i + 12) % 12;
       chartLabels.push(months[idx]);
       chartData.push(revenueByMonth[idx]);
    }

    this.lineChartData = {
      labels: chartLabels,
      datasets: [{
        ...this.lineChartData.datasets[0],
        data: chartData
      }]
    };

    // 6. Trips per Day Chart (Bar)
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const tripsByDay = new Array(7).fill(0);
    // Use only last 7 days of trips for this chart? or all history aggregated by weekday?
    // Aggregating by weekday for "standard performance"
    trips.forEach(t => {
       const d = new Date(t.date + 'T00:00:00');
       tripsByDay[d.getDay()]++;
    });
    // Shift to start from Seg
    const reorderedDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const reorderedData = [tripsByDay[1], tripsByDay[2], tripsByDay[3], tripsByDay[4], tripsByDay[5], tripsByDay[6], tripsByDay[0]];

    this.barChartData = {
      labels: reorderedDays,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: reorderedData
      }]
    };

    // 7. Recent Trips
    this.recentTrips = trips.slice(0, 5).map(t => {
       const d = new Date(t.date + 'T00:00:00');
       const isToday = t.date === todayStr;
       const label = isToday ? `Hoje, ${t.time}` : `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}, ${t.time}`;
       return {
          route: `${t.departureCity} → ${t.arrivalCity}`,
          date: label,
          earnings: t.totalAmount || 0,
          passengers: t.passengerCount || 0
       };
    });

    // 8. Earnings by Type
    this.earningsByType[0].value = monthTotal;
    this.earningsByType[0].percent = 100;
  }

  goBack(): void {
    this.location.back();
  }

  goToTrips(): void {
    this.router.navigate(['/viagens-motorista']);
  }

  setPeriod(period: 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
    // Calculation currently uses all history, but we could filter here
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ===== Sparkline helpers =====
  getSparklinePath(data: number[], width: number = 80, height: number = 28): string {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);

    return data.map((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  getSparklineAreaPath(data: number[], width: number = 80, height: number = 28): string {
    const linePath = this.getSparklinePath(data, width, height);
    if (!linePath) return '';
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  }

  getMetricPercent(value: number, max: number): number {
    return Math.min(Math.round((value / max) * 100), 100);
  }

  getSmallRingCircumference(): number {
    return 2 * Math.PI * 18;
  }

  getSmallRingOffset(percent: number): number {
    return this.getSmallRingCircumference() * (1 - percent / 100);
  }

  getHeatColor(intensity: number): string {
    if (intensity >= 80) return 'rgba(246, 107, 14, 0.9)';
    if (intensity >= 60) return 'rgba(246, 107, 14, 0.6)';
    if (intensity >= 40) return 'rgba(246, 107, 14, 0.35)';
    if (intensity >= 20) return 'rgba(246, 107, 14, 0.15)';
    return 'rgba(246, 107, 14, 0.06)';
  }

  getIntensityOpacity(intensity: number): number {
    return Math.max(0.25, intensity / 100);
  }
}
