import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerService, CatchRecord } from '../../services/ledger.service';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ledger-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen p-4 md:p-8 flex flex-col items-center justify-start max-w-6xl mx-auto">
      <!-- Header -->
      <header class="w-full mb-12 flex justify-between items-center animate-in fade-in slide-in-from-top duration-700">
        <div>
          <h1 class="text-3xl md:text-5xl font-black text-white drop-shadow-md">
            Digital <span class="text-coastal-seafoam">Ledger</span>
          </h1>
          <p class="text-coastal-coral font-bold tracking-widest uppercase text-[10px]">Verified Catch History</p>
        </div>
        
        <a routerLink="/" class="glass px-6 py-3 rounded-full text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
          <span>← Back to Agent</span>
        </a>
      </header>

      <main class="w-full">
        <div class="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white/5 border-b border-white/10">
                  <th class="p-6 text-coastal-seafoam text-[10px] font-black uppercase tracking-widest">Date</th>
                  <th class="p-6 text-coastal-seafoam text-[10px] font-black uppercase tracking-widest">Species</th>
                  <th class="p-6 text-coastal-seafoam text-[10px] font-black uppercase tracking-widest">Weight</th>
                  <th class="p-6 text-coastal-seafoam text-[10px] font-black uppercase tracking-widest">Location</th>
                  <th class="p-6 text-coastal-seafoam text-[10px] font-black uppercase tracking-widest text-right">Trust</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (record of history$ | async; track record.id) {
                  <tr class="hover:bg-white/5 transition-colors group">
                    <td class="p-6">
                      <span class="text-white/60 text-xs font-medium">{{ record.timestamp?.toDate() | date:'mediumDate' }}</span>
                    </td>
                    <td class="p-6">
                      <div class="flex items-center gap-3">
                        <span class="text-2xl">🐟</span>
                        <span class="text-white font-black capitalize">{{ record.species }}</span>
                      </div>
                    </td>
                    <td class="p-6">
                      <span class="text-white font-bold">{{ record.weight_kg }} <small class="text-white/40">KG</small></span>
                    </td>
                    <td class="p-6">
                      <span class="text-white/80 font-medium capitalize">{{ record.location }}</span>
                    </td>
                    <td class="p-6 text-right">
                      <span class="bg-coastal-coral/10 text-coastal-coral px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        ★ {{ record.trust_score }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="p-20 text-center">
                      <div class="flex flex-col items-center gap-4">
                        <span class="text-5xl opacity-20 text-white">📭</span>
                        <p class="text-white/30 font-bold uppercase tracking-widest text-sm">No catches recorded yet</p>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer class="mt-20 py-8 opacity-20">
        <p class="text-[10px] font-black uppercase tracking-[0.5em]">Bahari-Connect Financial Agent • 2026</p>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LedgerView {
  private ledgerService = inject(LedgerService);
  history$: Observable<CatchRecord[]> = this.ledgerService.getHistory();
}
