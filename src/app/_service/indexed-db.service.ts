import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// const dbPromise = openDB('my-db', 1, {
//   upgrade(db) {
//     db.createObjectStore('user-store');
//   },
// });

@Injectable({
  providedIn: 'root'
})

export class IndexedDBService {
  private db: IDBPDatabase<MyDB>;

  constructor() {
    this.ConnectToDB();
  }

  async ConnectToDB() {
    this.db = await openDB<MyDB>('my-db', 1, {
      upgrade(db) {
        db.createObjectStore("user-store", { keyPath: "myKey" });
      },
    });

  }
  addUser(name: string) {
      return this.db.put('user-store', name, 'name');
  }

  deleteUser(key: string) {
    return this.db.delete('user-store', key);
  }

}


interface MyDB extends DBSchema {
  'user-store': {
    key: string;
    value: string;
  };
}
