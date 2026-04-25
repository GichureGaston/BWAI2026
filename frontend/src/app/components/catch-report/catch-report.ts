import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-catch-report',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="p-6 max-w-lg mx-auto pb-20">
      <header class="mb-12 text-center pt-8">
        <h1 class="text-5xl font-black text-coastal-sand mb-2 tracking-tighter drop-shadow-sm">Bahari-Connect</h1>
        <div class="flex items-center justify-center gap-2">
          <span class="h-px w-8 bg-coastal-seafoam/30"></span>
          <p class="text-coastal-seafoam font-semibold tracking-widest uppercase text-xs">Coastal Intelligence Agent</p>
          <span class="h-px w-8 bg-coastal-seafoam/30"></span>
        </div>
      </header>

      <main>
        <!-- Stylish Input Box -->
        <div class="glass rounded-3xl p-8 mb-10 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 h-32 w-32 bg-coastal-seafoam/10 rounded-full blur-3xl group-focus-within:bg-coastal-seafoam/20 transition-all"></div>
          
          <label for="report" class="block text-xl font-bold text-coastal-sand mb-6 flex items-center gap-3">
            <span class="text-2xl">🐚</span> Ripoti Catch Yako
          </label>
          
          <textarea
            id="report"
            [(ngModel)]="rawText"
            class="w-full bg-transparent text-white border-b-2 border-white/10 p-0 py-2 text-xl focus:border-coastal-coral outline-none transition-all placeholder:text-white/20 resize-none font-medium"
            placeholder="Nimevua kilo ngapi leo?..."
            rows="3"
          ></textarea>
          
          <button
            (click)="processCatch()"
            [disabled]="isLoading() || !rawText"
            class="w-full mt-10 bg-coastal-coral hover:bg-white hover:text-coastal-blue disabled:bg-white/5 disabled:text-white/20 text-coastal-blue font-black py-5 rounded-2xl text-xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-4 group"
          >
            @if (isLoading()) {
              <div class="animate-spin h-6 w-6 border-4 border-current border-t-transparent rounded-full"></div>
              <span class="uppercase tracking-widest">Inachakata...</span>
            } @else {
              <span class="uppercase tracking-widest">Tuma Ripoti</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
          </button>
        </div>

        <!-- Stylish Result Cards -->
        @if (result()) {
          <div class="animate-in fade-in zoom-in duration-500 ease-out">
            <div class="flex items-center gap-4 mb-6">
               <h2 class="text-3xl font-black text-coastal-sand">Resultati</h2>
               <div class="h-px flex-1 bg-white/10"></div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-8">
              <!-- Species -->
              <div class="glass p-6 rounded-2xl border-l-4 border-coastal-seafoam">
                <span class="text-coastal-seafoam/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Species</span>
                <p class="text-2xl font-black text-white capitalize leading-none">{{ result().species }}</p>
              </div>
              
              <!-- Weight -->
              <div class="glass p-6 rounded-2xl border-l-4 border-coastal-coral">
                <span class="text-coastal-coral/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Weight (KG)</span>
                <p class="text-3xl font-black text-white leading-none">{{ result().weight_kg }}</p>
              </div>

              <!-- Location -->
              <div class="glass p-6 rounded-2xl border-l-4 border-white/20">
                <span class="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Location</span>
                <p class="text-2xl font-black text-white capitalize leading-none">{{ result().location }}</p>
              </div>

              <!-- Trust Score -->
              <div class="glass p-6 rounded-2xl bg-coastal-coral/10 border-l-4 border-coastal-coral">
                <span class="text-coastal-coral text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Trust Score</span>
                <p class="text-3xl font-black text-coastal-coral leading-none">★ {{ result().trust_score }}</p>
              </div>
            </div>

            <!-- Market Advice -->
            <div class="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </div>
              <span class="text-coastal-seafoam text-xs font-black uppercase tracking-[0.3em] mb-4 block">Market Insight</span>
              <p class="text-xl font-bold text-white leading-tight italic">"{{ result().market_advice }}"</p>
            </div>

            <button
              (click)="result.set(null); rawText = ''"
              class="w-full mt-10 text-coastal-seafoam/40 hover:text-coastal-seafoam font-bold tracking-widest uppercase text-xs transition-colors"
            >
              Andika ripoti mpya — Start Over
            </button>
          </div>
        }
      </main>

      <footer class="mt-20 text-center">
        <p class="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">Bahari-Connect Mombasa • 2026</p>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class CatchReport {
  rawText = '';
  isLoading = signal(false);
  result = signal<any>(null);

  constructor(private http: HttpClient) {}

  processCatch() {
    this.isLoading.set(true);
    // Hardcoded for local dev
    this.http.post('http://localhost:8000/process-catch', { 
      raw_text: this.rawText,
      user_id: 'mvuvi_likoni_001' 
    })
      .subscribe({
        next: (res) => {
          this.result.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
          alert('Error: ' + (err.error?.detail || 'Connectivity failed. Check server status.'));
        }
      });
  }
}
