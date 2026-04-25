import { Routes } from '@angular/router';
import { ReportShell } from './components/report-shell/report-shell';
import { LedgerView } from './components/ledger-view/ledger-view';

export const routes: Routes = [
  { path: '', component: ReportShell },
  { path: 'ledger', component: LedgerView }
];
