import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    // Mock AuthService
    authServiceMock = {
      login: vi.fn(),
      currentUser: signal(null)
    };

    // Mock Router
    routerMock = {
      navigate: vi.fn()
    };
    
    TestBed.configureTestingModule({
      imports: [Login], // Standalone component
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} } // Provide empty ActivatedRoute
      ]
    });

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty fields', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  describe('onLogin', () => {
    it('should not call login if fields are empty', () => {
      component.email = '';
      component.password = '';
      component.onLogin();
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should call login and navigate on success (admin)', () => {
      component.email = 'admin@example.com';
      component.password = 'password';
      
      const mockResponse = { token: 'token', role: 'admin' };
      authServiceMock.login.mockReturnValue(of(mockResponse));

      component.onLogin();

      expect(authServiceMock.login).toHaveBeenCalledWith('admin@example.com', 'password');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/admin']);
      expect(component.isLoading()).toBe(false);
    });

    it('should call login and navigate on success (user)', () => {
      component.email = 'user@example.com';
      component.password = 'password';

      const mockResponse = { token: 'token', role: 'client' };
      authServiceMock.login.mockReturnValue(of(mockResponse));

      component.onLogin();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should handle login error (401/403)', () => {
      component.email = 'wrong@example.com';
      component.password = 'wrong';

      const errorResponse = { status: 401 };
      authServiceMock.login.mockReturnValue(throwError(() => errorResponse));

      component.onLogin();

      expect(component.errorMessage()).toBe('E-mail ou senha incorretos.');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle showPassword state', () => {
      expect(component.showPassword()).toBe(false);
      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(true);
      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(false);
    });
  });
});
