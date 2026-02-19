import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock = { navigate: vi.fn() };

  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token', () => {
      const mockToken = 'fake-jwt-token';
      const mockUser = { role: 'driver', id: '1', name: 'Test', email: 'test@example.com' };
      
      service.login('test@example.com', 'password').subscribe(res => {
        expect(res.token).toBe(mockToken);
        expect(res.role).toBe('driver');
      });

      // Expect login request
      const reqLogin = httpMock.expectOne('http://localhost:8080/api/auth/login');
      expect(reqLogin.request.method).toBe('POST');
      reqLogin.flush({ token: mockToken });

      // Expect getMe request (triggered by switchMap in login)
      const reqMe = httpMock.expectOne('http://localhost:8080/api/user/me');
      expect(reqMe.request.method).toBe('GET');
      reqMe.flush(mockUser);
      
      // Verify local storage was updated
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(localStorage.getItem('auth_role')).toBe('driver');
    });
  });

  describe('register', () => {
    it('should register a new user', () => {
      const mockData = { 
        name: 'New User', 
        email: 'new@example.com', 
        password: 'pass', 
        role: 'passenger' 
      };

      service.register(mockData).subscribe(res => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expect.objectContaining({
        email: 'new@example.com',
        role: 'passenger'
      }));
      req.flush({ success: true });
    });

    it('should handle admin registration logic', () => {
        const mockData = { 
          name: 'Admin User', 
          email: 'admin@email.com', // Contains 'admin'
          password: 'pass'
        };
  
        service.register(mockData).subscribe();
  
        const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
        expect(req.request.body.role).toBe('admin');
        req.flush({ success: true });
    });
  });

  describe('getMe', () => {
    it('should retrieve user profile', () => {
      const mockProfile = { id: '1', name: 'User', email: 'user@example.com', role: 'client' };
      
      service.getMe().subscribe(profile => {
        expect(profile).toEqual(mockProfile);
      });
      
      const req = httpMock.expectOne('http://localhost:8080/api/user/me');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });
  });

  describe('logout', () => {
    it('should clear session and navigate to login', () => {
      localStorage.setItem('auth_token', 'token');
      service.logout();
      
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(service.currentUser()).toBeNull();
    });
  });
});
