import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar / Drawer -->
      <aside 
        class="glass-dark w-72 h-full flex flex-col transition-all duration-300 ease-in-out z-50 fixed md:relative"
        [class.-translate-x-full]="!isSidebarOpen()"
        [class.translate-x-0]="isSidebarOpen()"
        [class.md:translate-x-0]="true"
      >
        <div class="p-8">
          <h1 class="text-3xl font-black text-coastal-sand tracking-tighter mb-1">Bahari</h1>
          <p class="text-[10px] text-coastal-seafoam font-bold uppercase tracking-[0.3em]">Connect Agent</p>
        </div>

        <nav class="flex-1 mt-8">
          <ul class="space-y-2 px-4">
            <li>
              <a 
                routerLink="/dashboard" 
                routerLinkActive="nav-link-active"
                class="flex items-center gap-4 px-4 py-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span class="text-xl group-hover:scale-110 transition-transform">📊</span>
                <span class="font-bold tracking-wide">Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                routerLink="/catch-report" 
                routerLinkActive="nav-link-active"
                class="flex items-center gap-4 px-4 py-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span class="text-xl group-hover:scale-110 transition-transform">🐚</span>
                <span class="font-bold tracking-wide">Catch Report</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="p-8 mt-auto">
          <div class="glass p-4 rounded-2xl flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-coastal-coral flex items-center justify-center text-coastal-blue font-black">
              M
            </div>
            <div>
              <p class="text-xs font-bold text-white">Mvuvi Likoni</p>
              <p class="text-[9px] text-white/40 uppercase tracking-widest font-black">Pro Member</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      @if (isSidebarOpen()) {
        <div 
          (click)="toggleSidebar()"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        ></div>
      }

      <!-- Main Content -->
      <div class="flex-1 flex flex-col h-full overflow-hidden relative">
        <!-- Top Bar (Mobile) -->
        <header class="md:hidden flex items-center justify-between p-4 glass-dark">
          <button (click)="toggleSidebar()" class="p-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <h1 class="text-xl font-black text-coastal-sand tracking-tighter">Bahari</h1>
          <div class="w-8"></div> <!-- Spacer -->
        </header>

        <main class="flex-1 overflow-y-auto p-4 md:p-12">
          <div class="max-w-5xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class Shell {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }
}
