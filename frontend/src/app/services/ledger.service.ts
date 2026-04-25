import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit, Timestamp } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { CatchData } from './bahari.service';

export interface CatchRecord extends CatchData {
  id?: string;
  timestamp: any;
}

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  private firestore = inject(Firestore);
  private catchesCollection = collection(this.firestore, 'catches');

  saveCatch(data: CatchData): Promise<any> {
    const record = {
      ...data,
      timestamp: Timestamp.now()
    };
    return addDoc(this.catchesCollection, record);
  }

  getHistory(): Observable<CatchRecord[]> {
    const q = query(this.catchesCollection, orderBy('timestamp', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<CatchRecord[]>;
  }

  getLatestCatch(): Observable<CatchRecord | null> {
    const q = query(this.catchesCollection, orderBy('timestamp', 'desc'), limit(1));
    return collectionData(q, { idField: 'id' }).pipe(
      map(catches => catches.length > 0 ? catches[0] as CatchRecord : null)
    );
  }
}
