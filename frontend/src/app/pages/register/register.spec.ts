import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../components/toast/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceMock: any;
  let routerMock: any;
  let toastServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      register: vi.fn()
    };
    routerMock = {
      navigate: vi.fn()
    };
    toastServiceMock = {
      error: vi.fn(),
      success: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    });

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty fields', () => {
    expect(component.name).toBe('');
    expect(component.email).toBe('');
    expect(component.birthdate).toBe('');
    expect(component.cpf).toBe('');
    expect(component.telephone).toBe('');
    expect(component.password).toBe('');
  });

  describe('Form Validation', () => {
    it('should show error if fields are empty', () => {
        component.onRegister();
        expect(toastServiceMock.error).toHaveBeenCalledWith('Preencha todos os campos obrigatórios.');
    });

    it('should validate birthdate format', () => {
        component.name = 'Test';
        component.email = 'test@example.com';
        component.password = '123';
        component.birthdate = 'invalid';
        
        component.onRegister();
        expect(toastServiceMock.error).toHaveBeenCalledWith('Data de nascimento inválida. Use o formato dd/mm/aaaa.');
    });

    it('should validate birthdate year range', () => {
        component.name = 'Test';
        component.email = 'test@example.com';
        component.password = '123';
        component.birthdate = '01/01/1900'; // Too old
        
        component.onRegister();
        expect(toastServiceMock.error).toHaveBeenCalledWith('O ano de nascimento deve ser entre 1920 e 2020.');
    });

    it('should validate birthdate logic (day/month)', () => {
        component.name = 'Test';
        component.email = 'test@example.com';
        component.password = '123';
        component.birthdate = '40/13/2000'; // Invalid day/month
        
        component.onRegister();
        expect(toastServiceMock.error).toHaveBeenCalledWith('Data de nascimento inválida.');
    });
  });

  describe('Input Formatting', () => {
    // Helper to simulate input event
    function triggerInput(field: string, value: string) {
        let methodName = '';
        if (field === 'cpf') methodName = 'onCpfInput';
        if (field === 'telephone') methodName = 'onPhoneInput';
        if (field === 'birthdate') methodName = 'onBirthdateInput';
        
        const input = { value, target: { value } };
        // @ts-ignore
        component[methodName]({ target: input });
        return input.value;
    }

    it('should only allow digits in CPF', () => {
        component.onCpfInput({ target: { value: '123abc456' } });
        expect(component.cpf).toBe('123456');
    });

    it('should format telephone with mask', () => {
        component.onPhoneInput({ target: { value: '11987654321' } });
        expect(component.telephone).toBe('(11)98765-4321');
    });

    it('should format birthdate with mask', () => {
        component.onBirthdateInput({ target: { value: '01012000' } });
        expect(component.birthdate).toBe('01/01/2000'); // Assuming mask logic adds slashes
    });
  });

  describe('Registration Submission', () => {
    beforeEach(() => {
        // Setup valid data
        component.name = 'Valid User';
        component.email = 'valid@example.com';
        component.password = 'pass123';
        component.birthdate = '01/01/2000';
        component.cpf = '12345678900';
        component.telephone = '(11)99999-9999';
    });

    it('should call register service and navigate on success', () => {
        authServiceMock.register.mockReturnValue(of({}));
        
        component.onRegister();
        
        // Since the observable is synchronous (of({})), it completes immediately.
        // Therefore, isLoading will be set to true and then immediately back to false.
        // We cannot check for true here unless we use a delay or async scheduler.
        
        expect(authServiceMock.register).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Valid User',
            email: 'valid@example.com',
            birthDate: '01/01/2000'
        }));
        
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        expect(component.isLoading()).toBe(false);
    });

    it('should handle registration error', () => {
        const errorResponse = { error: { message: 'Email already in use' } };
        authServiceMock.register.mockReturnValue(throwError(() => errorResponse));
        
        component.onRegister();
        
        expect(component.errorMessage()).toBe('Email already in use');
        expect(component.isLoading()).toBe(false);
        expect(routerMock.navigate).not.toHaveBeenCalled();
    });
    
    it('should handle generic registration error', () => {
        authServiceMock.register.mockReturnValue(throwError(() => new Error('Network error')));
        
        component.onRegister();
        
        expect(component.errorMessage()).toBe('Falha ao realizar cadastro. Verifique os dados e tente novamente.');
    });
  });
});
