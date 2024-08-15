import { Injectable } from '@angular/core';
import { User } from '../data/User';

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  push,
  DataSnapshot,
} from 'firebase/database';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db: any;

  constructor() {
    this.setupFirebase(); // How we pass account and project info
    this.db = getDatabase(); // this is how we get a db object to use to access all the others functions
  }
  setupFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyA1Pb1G-eXWOvDkP_8AW59e7BuuzJc3FLY",
      authDomain: "fir-app-4fb9a.firebaseapp.com",
      databaseURL: "https://fir-app-4fb9a-default-rtdb.firebaseio.com",
      projectId: "fir-app-4fb9a",
      storageBucket: "fir-app-4fb9a.appspot.com",
      messagingSenderId: "4375361106",
      appId: "1:4375361106:web:219cbb5a008f8f2eec118b",
      measurementId: "G-1E2WGK8THK"
    };
    initializeApp(firebaseConfig);
  }

  // CRUD: Create, Retrieve, Update, Delete 
  create(path: string, data: any): Promise<void>{ // Create
    return set(ref(this.db, path), data);
  }
  async retrieve(path: string, key:string): Promise<DataSnapshot>{
    return await get(ref(this.db, path+'/'+key));
  }
  update(path: string, key: string, data: any): Promise<void>{ 
    return update(ref(this.db, path + "/" + key), data);
  }
  delete(path: string, key: string): Promise<void>{ 
    return remove(ref(this.db, path+"/"+key));
  }
  async pushToList(path: string, data: User): Promise<number | null> {
    const snapshot = await get(ref(this.db, path));
    let nextKey = 1;

    if (snapshot.exists()) {
      const users = snapshot.val();

      for (const key in users) {
        if (users.hasOwnProperty(key)) {
          const existingUser: User = users[key];
          if (
            existingUser.name === data.name ||
            existingUser.email === data.email ||
            existingUser.phone === data.phone
          ) {
            window.alert('User with either same name, email, or number already exists.');
            return null;
          }
          else{window.alert('success')}
        }
      }
      const keys = Object.keys(users).map(Number);
      const lastKey = Math.max(...keys);
      nextKey = lastKey + 1;
    }

    await set(ref(this.db, path + '/' + nextKey), data);
    return nextKey;
  }
  
  async deleteFromList(path: string, userName: string) {
    this.delete(path, userName);
    
    const snapshot = await get(ref(this.db, path));
    if (snapshot.exists()) {
      const cars = snapshot.val();
      const updatedCars: { [key: string]: User } = {};
      let Lkey = 1;

      for (const key in cars) {
        if (cars.hasOwnProperty(key)) {
          updatedCars[Lkey] = cars[key];
          Lkey++;
        }
      }
      await set(ref(this.db, path), updatedCars);
    }
  }
  
  // Get List Once 
  async getList(path: string){
    const dblist = await get(ref(this.db, path));
    let locallist: any[] = [];
    dblist.forEach( item =>{locallist.push(item.val());});
    return locallist; 
  }
  reset(){
    this.delete("","");
  }
  getDB(){
    return this.db; 
  }

}

