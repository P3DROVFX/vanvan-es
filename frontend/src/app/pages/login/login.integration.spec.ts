import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Login } from './login'; // Ensure correct import path
import { AuthService } from '../../services/auth.service';

describe('Login Component Integration (with AuthService)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpMock: HttpTestingController;
  let routerMock = { navigate: vi.fn() };

  beforeEach(() => {
    // Clear localStorage to avoid side effects from AuthService constructor
    if (typeof localStorage !== 'undefined') {
        localStorage.clear();
    }

    TestBed.configureTestingModule({
      imports: [Login], // Standalone
      providers: [
        AuthService, // Real service
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('should call AuthService.login and navigate on successful login', () => {
    component.email = 'integration@test.com';
    component.password = 'pass123';
    
    // Trigger login
    component.onLogin();
    
    // Expect loading state
    expect(component.isLoading()).toBe(true);
    
    // Expect HTTP request from AuthService
    const reqLogin = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(reqLogin.request.method).toBe('POST');
    expect(reqLogin.request.body).toEqual({ email: 'integration@test.com', password: 'pass123' });
    
    // Respond (backend simulation)
    reqLogin.flush({ token: 'mock-token' });
    
    // Expect getMe request (triggered by switchMap in AuthService)
    const reqMe = httpMock.expectOne('http://localhost:8080/api/user/me');
    expect(reqMe.request.method).toBe('GET');
    reqMe.flush({ id: '123', role: 'driver', name: 'Driver User', email: 'integration@test.com' });
    
    // Expect navigation
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    // Verify component state updated
    expect(component.isLoading()).toBe(false);
  });

  it('should handle error from AuthService', () => {
    component.email = 'fail@test.com';
    component.password = 'wrong';
    
    component.onLogin();
    
    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    
    expect(component.errorMessage()).toBe('E-mail ou senha incorretos.');
    expect(component.isLoading()).toBe(false);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
