import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, signInWithCustomToken, getIdToken } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private auth: Auth) {}

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password }).pipe(
      switchMap((response: any) => {
        return from(signInWithCustomToken(this.auth, response.token)).pipe(
          switchMap(() => from(getIdToken(this.auth.currentUser as any)))
        );
      })
    );
  }

  affiliate(token: string, name: string, gender: string, weight: number, height: number, birthdate: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/affiliate`, {
      token,
      name,
      gender,
      weight,
      height,
      birthdate
    });
  }
}
