import { Component, signal, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BahariService, CatchData } from '../../services/bahari.service';
import { LedgerService, CatchRecord } from '../../services/ledger.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-report-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <!-- Premium Header -->
      <header class="w-full flex justify-between items-center animate-in fade-in slide-in-from-top duration-700">
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-2xl bg-coastal-coral flex items-center justify-center shadow-lg shadow-coastal-coral/20">
            <span class="text-2xl">⛵</span>
          </div>
          <div class="text-left">
            <h1 class="text-3xl md:text-4xl font-black text-white leading-tight">
              Bahari <span class="text-coastal-seafoam">Connect</span>
            </h1>
            <p class="text-white/40 font-bold tracking-tighter uppercase text-[10px]">Financial Intelligence for Cooperatives</p>
          </div>
        </div>

        <nav class="flex items-center gap-3">
          <a routerLink="/ledger" class="glass px-6 py-3 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5">
            <span class="opacity-60 text-sm italic">Archive</span>
            <span>📋 Ledger</span>
          </a>
        </nav>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Sidebar: Stats & Insights (4 cols) -->
        <aside class="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <h2 class="text-xs font-black uppercase tracking-[0.3em] text-coastal-seafoam/60 px-2">Market Insights</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="stat-card">
              <span class="text-2xl">⚖️</span>
              <span class="text-white font-black text-2xl leading-none mt-2">{{ totalWeight() }}<small class="text-xs text-white/40 ml-1">KG</small></span>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Catch</span>
            </div>
            <div class="stat-card">
              <span class="text-2xl">📈</span>
              <span class="text-white font-black text-2xl leading-none mt-2">{{ reliability() }}%</span>
              <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">Reliability</span>
            </div>
          </div>

          <div class="glass p-6 rounded-[2.5rem] border border-white/5 space-y-4">
             <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/40">Catch Trend</span>
                <span class="text-coastal-seafoam text-[10px] font-bold">LIVE DATA</span>
             </div>
             <div class="chart-container">
               <canvas #trendChart></canvas>
             </div>
          </div>
        </aside>

        <!-- Main Content: Input & Result (8 cols) -->
        <main class="lg:col-span-8 space-y-8 order-1 lg:order-2">
          
          <!-- Refined Input Area -->
          <div class="glass-card p-1 relative group border-beam overflow-hidden">
            <div class="bg-coastal-blue/40 rounded-[1.9rem] p-6 md:p-10 backdrop-blur-3xl">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-black text-white flex items-center gap-3">
                  <span class="text-coastal-coral">●</span> Submit Report
                </h3>
                
                <button 
                  (click)="toggleVoiceInput()"
                  [class.bg-red-500]="isRecording()"
                  class="flex items-center gap-2 px-6 py-3 rounded-2xl glass-dark hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white border border-white/5"
                >
                  {{ isRecording() ? '🔴 Listening...' : '🎙️ Voice Input' }}
                </button>
              </div>

              <textarea
                [(ngModel)]="reportText"
                class="w-full bg-white/5 text-white border-b-2 border-white/10 p-0 py-4 text-xl md:text-3xl focus:border-coastal-seafoam outline-none transition-all placeholder:text-white/10 resize-none min-h-[120px] font-medium placeholder:font-serif italic"
                placeholder="Describe your catch today..."
              ></textarea>
              
              <div class="flex flex-col md:flex-row items-center gap-4 mt-8">
                <button
                  (click)="submitReport()"
                  [disabled]="isLoading() || !reportText"
                  class="flex-1 bg-white hover:bg-coastal-seafoam text-coastal-blue font-black py-6 rounded-2xl text-xl transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-20"
                >
                  @if (isLoading()) {
                    <div class="animate-spin h-6 w-6 border-4 border-coastal-blue border-t-transparent rounded-full"></div>
                  } @else {
                    <span class="uppercase tracking-widest text-sm font-black">Verify & Record</span>
                    <span class="text-2xl">→</span>
                  }
                </button>
                
                <div class="flex items-center gap-2 px-4 py-2 opacity-40">
                   <span class="h-2 w-2 rounded-full bg-coastal-seafoam animate-pulse"></span>
                   <span class="text-[10px] font-bold uppercase tracking-widest">AI Agent Online</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Result Card (Refined) -->
          @if (result()) {
            <div class="animate-in slide-in-from-bottom duration-700">
              <div class="glass rounded-[3rem] border border-white/10 overflow-hidden shadow-3xl">
                <div class="p-10 space-y-8">
                   <div class="flex justify-between items-start">
                     <div>
                       <span class="text-coastal-seafoam text-[10px] font-black uppercase tracking-[0.4em]">Extracted Ledger</span>
                       <h2 class="text-5xl font-black text-white mt-2 capitalize">{{ result()?.species }}</h2>
                     </div>
                     <div class="bg-white/5 px-6 py-4 rounded-3xl border border-white/10 text-center">
                        <span class="text-coastal-coral text-2xl font-black">{{ result()?.trust_score }}</span>
                        <p class="text-[8px] font-bold text-white/40 uppercase mt-1">Trust Score</p>
                     </div>
                   </div>

                   <div class="grid grid-cols-2 gap-10">
                      <div class="stat-card !p-0 !bg-transparent !border-0">
                         <span class="text-[10px] font-black uppercase text-white/30 tracking-widest">Net Weight</span>
                         <p class="text-4xl font-black text-white">{{ result()?.weight_kg }}<small class="text-lg opacity-40 ml-1">KG</small></p>
                      </div>
                      <div class="stat-card !p-0 !bg-transparent !border-0 text-right">
                         <span class="text-[10px] font-black uppercase text-white/30 tracking-widest">Landing Point</span>
                         <p class="text-4xl font-black text-white capitalize">{{ result()?.location }}</p>
                      </div>
                   </div>

                   <div class="p-8 bg-coastal-coral rounded-3xl text-coastal-blue">
                      <div class="flex gap-4">
                        <span class="text-3xl">💡</span>
                        <div>
                           <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Intelligence</p>
                           <p class="text-xl font-bold leading-tight mt-1">{{ result()?.market_advice }}</p>
                        </div>
                      </div>
                   </div>
                </div>
                
                <button (click)="reset()" class="w-full py-6 bg-white/5 hover:bg-white/10 transition-colors text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">
                   Start New Entry
                </button>
              </div>
            </div>
          }
        </main>
      </div>

      <footer class="mt-auto py-12 flex justify-between items-center border-t border-white/5 opacity-30">
        <p class="text-[10px] font-black uppercase tracking-[0.5em]">Bahari-Connect Financial Agent • Mombasa 2026</p>
        <div class="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
           <span>Privacy</span>
           <span>Protocols</span>
           <span>Help</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ReportShell implements AfterViewInit {
  private bahariService = inject(BahariService);
  private ledgerService = inject(LedgerService);
  
  @ViewChild('trendChart') trendChartCanvas!: ElementRef;
  
  reportText = '';
  isLoading = signal(false);
  isRecording = signal(false);
  result = signal<CatchData | null>(null);
  
  // Computed Stats
  totalWeight = signal(0);
  reliability = signal(98); // Mock reliability
  
  private chart?: Chart;
  private recognition: any;

  constructor() {
    this.initVoiceRecognition();
    
    // Automatically load the latest catch
    this.ledgerService.getLatestCatch().subscribe(latest => {
      if (!this.result()) {
        this.result.set(latest);
      }
    });

    // Fetch history for stats and charts
    this.ledgerService.getHistory().subscribe(history => {
      this.calculateStats(history);
      this.updateChart(history);
    });
  }

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    const ctx = this.trendChartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Catch Weight',
          data: [],
          borderColor: '#a8dadc',
          backgroundColor: 'rgba(168, 218, 220, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    });
  }

  private updateChart(history: CatchRecord[]) {
    if (!this.chart) return;
    
    const last7 = history.slice(0, 7).reverse();
    this.chart.data.labels = last7.map(h => h.species);
    this.chart.data.datasets[0].data = last7.map(h => h.weight_kg);
    this.chart.update();
  }

  private calculateStats(history: CatchRecord[]) {
    const total = history.reduce((acc, h) => acc + h.weight_kg, 0);
    this.totalWeight.set(Math.round(total));
  }

  private initVoiceRecognition() {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'sw-KE';
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.reportText = (this.reportText + ' ' + transcript).trim();
        this.isRecording.set(false);
      };
      this.recognition.onend = () => this.isRecording.set(false);
    }
  }

  toggleVoiceInput() {
    if (!this.recognition) return;
    if (this.isRecording()) {
      this.recognition.stop();
    } else {
      this.isRecording.set(true);
      this.recognition.start();
    }
  }

  submitReport() {
    if (!this.reportText) return;
    this.isLoading.set(true);
    this.bahariService.processReport(this.reportText).subscribe({
      next: (res: CatchData) => {
        this.result.set(res);
        this.ledgerService.saveCatch(res).catch(err => console.error('Firestore save failed', err));
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Submission failed', err);
        this.isLoading.set(false);
      }
    });
  }

  reset() {
    this.result.set(null);
    this.reportText = '';
  }
}
