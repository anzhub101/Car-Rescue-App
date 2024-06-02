import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, update, remove, push, child, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService { 
 db: any;

    constructor() {
      this.setupFirebase();  
      this.db = getDatabase();    
      }
      getFirebaseDatabase(){
        return this.db;
      }
      setupFirebase(){
        const firebaseConfig = {
          apiKey: "AIzaSyDqwbmTw1DYzmMdTDW6rzBn8q1Y1fn31uk",
          authDomain: "persistenceapp-bd2b6.firebaseapp.com",
          databaseURL: "https://persistenceapp-bd2b6-default-rtdb.firebaseio.com",
          projectId: "persistenceapp-bd2b6",
          storageBucket: "persistenceapp-bd2b6.appspot.com",
          messagingSenderId: "939998039217",
          appId: "1:939998039217:web:aaefb864c54541d0816690"
        };
        
        initializeApp(firebaseConfig);
      }
      createObject(path: string, data: any) {
        return set(ref(this.db, path), data);
      }

      async readObject(path: string, key: string): Promise<string>{
        return get(child(ref(this.db), `${path}/${key}`)).then((snapshot) => {
          if (snapshot.exists()) return snapshot.val();
        })      
       }
      updateObject(path: string, key: string, data: any) {
        update(ref(this.db, `${path}/${key}`), data);
      }
      deleteObject(path: string, key: string){
        remove(ref(this.db, `${path}/${key}`));
      }

      async readList(path: string): Promise<any[]> {
        const snapshot = await get(ref(this.db, path));
        const list: any[] = [];
        snapshot.forEach(childSnapshot => {
          list.push(childSnapshot.val());
        });
        return list;
      }
    
      addToList(path: string, data: any){
        return push(ref(this.db, path), data).key;
      }
    
      removeFromList(path: string, key: string){
        remove(ref(this.db, `${path}/${key}`));
      }

     getDataContinuosly(field: string): Observable<[]>{
      return new Observable((observer) => {
        onValue(ref(this.db, field), (data) => {
          if(data.valueOf()!= null)
            observer.next(data.val());
        });
      });
     }
     
     reset(){
        remove(ref(this.db, '/'));
     }

}