import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  Auth,
  signInWithCustomToken,
  getIdToken,
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private auth: Auth) {}
  signin(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(() => from(getIdToken(this.auth.currentUser as any)))
    );
  }
  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password }).pipe(
      switchMap((response: any) => {
        return from(signInWithCustomToken(this.auth, response.token)).pipe(
          switchMap(() => from(getIdToken(this.auth.currentUser as any)))
        );
      })
    );
  }

  affiliate(token: string, name: string, gender: string, weight: number | null, height: number | null, age: number | null): Observable<any> {
    return this.http.post(`${this.apiUrl}/affiliate`, {
      token,
      name,
      gender,
      weight,
      height,
      age
    });
  }

  getMetrics(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/metrics`, { params: { token } });
  }

  saveMetrics(token: string, weight: number | null, measurementDate: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/metrics`, { token, weight, measurementDate });
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events`);
  }

  getInterestedEvents(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/interested-events`, { headers });
  }

  addInterestedEvent(token: string, eventId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/interested-events`, { eventId }, { headers });
  }

  removeInterestedEvent(token: string, eventId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/interested-events/${eventId}`, { headers });
  }

  markEventAsAttended(token: string, eventId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/attended-events`, { eventId }, { headers });
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      switchMap(user => of(!!user))
    );
  }
  logout(): Observable<any> {
    return from(signOut(this.auth));
  }
}
