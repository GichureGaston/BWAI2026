import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CatchData {
    species: string;
    weight_kg: number;
    location: string;
    market_advice: string;
    trust_score?: number;
}

@Injectable({ providedIn: 'root' })
export class BahariService {
    private http = inject(HttpClient);
    // Change this to your Cloud Run URL later!
    private apiUrl = '/process-catch';

    processReport(text: string): Observable<CatchData> {
        return this.http.post<CatchData>(this.apiUrl, { raw_text: text });
    }
}