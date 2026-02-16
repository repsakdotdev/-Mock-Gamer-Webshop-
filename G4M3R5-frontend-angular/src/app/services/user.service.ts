import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  admin: boolean;
  internationalUser: boolean;
}

export interface UserUpdateRequest {
  username: string;
  email: string;
  isInternational: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get the current user's profile information
   * @returns An observable of the user profile
   */
  getCurrentUser(): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.apiUrl}/users/current`);
  }

  /**
   * Update the current user's profile information
   * @param userData The updated user data
   * @returns An observable of the updated user profile
   */
  updateCurrentUser(userData: UserUpdateRequest): Observable<UserProfile> {
    return this.httpClient.put<UserProfile>(`${this.apiUrl}/users/current`, userData);
  }

  /**
   * Update a user's international status
   * @param userId The ID of the user to update
   * @param isInternational The new international status
   * @returns An observable of the updated user profile
   */
  updateUserInternationalStatus(userId: number, isInternational: boolean): Observable<UserProfile> {
    return this.httpClient.put<UserProfile>(
      `${this.apiUrl}/users/${userId}/international`, 
      null, 
      { params: { isInternational: isInternational.toString() } }
    );
  }

  /**
   * Grant admin rights to a user (admin only)
   * @param userId The ID of the user to grant admin rights to
   * @returns An observable of the updated user profile
   */
  grantAdminRights(userId: number): Observable<UserProfile> {
    return this.httpClient.put<UserProfile>(`${this.apiUrl}/users/${userId}/grant-admin`, {});
  }
}
