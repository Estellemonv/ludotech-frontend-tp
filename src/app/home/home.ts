import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
import { Kpi } from '../shared/model/Kpi';
import { KpiService } from '../shared/service/kpi-service';

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  readonly kpi = signal<Kpi | null>(null);
  readonly error = signal(false);

  private readonly kpiService = inject(KpiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private charts: Chart[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyCharts());
  }

  ngAfterViewInit(): void {
    this.kpiService.getKpi().subscribe({
      next: (kpi) => {
        this.kpi.set(kpi);
        this.changeDetectorRef.detectChanges();
        this.createCharts(kpi);
      },
      error: (err) => {
        this.error.set(true);
        console.error('Erreur lors du chargement des indicateurs', err);
      },
    });
  }

  total(emprunte: number, disponible: number): number {
    return emprunte + disponible;
  }

  private createCharts(kpi: Kpi): void {
    this.destroyCharts();
    this.charts = [
      this.createChart('books-chart', kpi.nbLivreEmprunte, kpi.nbLivreDispo),
      this.createChart('movies-chart', kpi.nbFilmEmprunte, kpi.nbFilmDispo),
      this.createChart('games-chart', kpi.nbJeuEmprunte, kpi.nbJeuDispo),
    ];
  }

  private createChart(canvasId: string, borrowed: number, available: number): Chart {
    return new Chart(canvasId, {
      type: 'doughnut',
      data: {
        labels: ['Empruntés', 'Disponibles'],
        datasets: [{
          data: [borrowed, available],
          backgroundColor: ['#dc2626', '#16a34a'],
          borderColor: '#ffffff',
          borderWidth: 4,
          hoverOffset: 8,
        }],
      },
      options: {
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 18 } },
          tooltip: { callbacks: { label: (item) => `${item.label}: ${item.parsed}` } },
        },
      },
    });
  }

  private destroyCharts(): void {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }
}
