import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  hot,
  cold,
} from 'jasmine-marbles';
import {
  Observable ,
  of,
} from 'rxjs';

import {
  DaffLoginInfo,
  DaffAuthToken,
  DaffAccountRegistration,
  DaffAuthStorageService,
  DaffAuthenticationFailedError,
  DaffAuthInvalidAPIResponseError,
} from '@daffodil/auth';
import {
  DaffLoginDriver,
  DaffRegisterDriver,
  DaffAuthDriver,
} from '@daffodil/auth/driver';
import {
  DaffAuthStorageFailure,
  DaffAuthGuardCheck,
  DaffAuthGuardCheckCompletion,
  DaffAuthLogin,
  DaffAuthLoginSuccess,
  DaffAuthLoginFailure,
  DaffAuthCheck,
  DaffAuthCheckSuccess,
  DaffAuthCheckFailure,
  DaffAuthLogout,
  DaffAuthLogoutSuccess,
  DaffAuthLogoutFailure,
  DaffAuthRegister,
  DaffAuthRegisterSuccess,
  DaffAuthRegisterFailure,
} from '@daffodil/auth/state';
import {
  DaffAccountRegistrationFactory,
  DaffAuthTokenFactory,
} from '@daffodil/auth/testing';
import { DaffStorageServiceError } from '@daffodil/core';
import { daffTransformErrorToStateError } from '@daffodil/core/state';

import { DaffAuthEffects } from './auth.effects';

describe('DaffAuthEffects', () => {
  let actions$: Observable<any>;
  let effects: DaffAuthEffects<
  DaffLoginInfo,
  DaffAuthToken,
  DaffAccountRegistration
  >;

  let daffLoginDriver;
  let daffRegisterDriver;
  let daffAuthDriver;
  let daffAuthStorageService: DaffAuthStorageService;
  let setAuthTokenSpy: jasmine.Spy;

  const registrationFactory: DaffAccountRegistrationFactory = new DaffAccountRegistrationFactory();
  const authFactory: DaffAuthTokenFactory = new DaffAuthTokenFactory();

  const authStorageFailureAction = new DaffAuthStorageFailure(daffTransformErrorToStateError(
    new DaffStorageServiceError('Storage of auth token has failed.')),
  );
  const throwStorageError = () => {
    throw new DaffStorageServiceError('Storage of auth token has failed.');
  };

  let mockAuth: DaffAuthToken;
  let mockLoginInfo: DaffLoginInfo;
  let token: string;
  let email: string;
  let password: string;
  let firstName: string;
  let lastName: string;
  let mockRegistration: DaffAccountRegistration;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DaffAuthEffects,
        provideMockActions(() => actions$),
        {
          provide: DaffLoginDriver,
          useValue: jasmine.createSpyObj('DaffLoginService', ['login', 'logout']),
        },
        {
          provide: DaffRegisterDriver,
          useValue: jasmine.createSpyObj('DaffRegisterService', ['register']),
        },
        {
          provide: DaffAuthDriver,
          useValue: jasmine.createSpyObj('DaffAuthService', ['check']),
        },
      ],
    });

    effects = TestBed.inject(DaffAuthEffects);

    daffLoginDriver = TestBed.inject(DaffLoginDriver);
    daffRegisterDriver = TestBed.inject(DaffRegisterDriver);
    daffAuthDriver = TestBed.inject(DaffAuthDriver);
    daffAuthStorageService = TestBed.inject(DaffAuthStorageService);

    mockRegistration = registrationFactory.create();
    mockAuth = authFactory.create();
    setAuthTokenSpy = spyOn(daffAuthStorageService, 'setAuthToken');

    token = mockAuth.token;
    firstName = mockRegistration.customer.firstName;
    lastName = mockRegistration.customer.lastName;
    email = mockRegistration.customer.email;
    password = mockRegistration.password;
    mockLoginInfo = { email, password };
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('guardCheck$ | indicating the completion and result of an auth token check operation', () => {
    let expected;
    const mockAuthCheckAction = new DaffAuthGuardCheck();

    describe('and the check is successful', () => {
      beforeEach(() => {
        const mockAuthCheckCompletionAction = new DaffAuthGuardCheckCompletion(true);
        daffAuthDriver.check.and.returnValue(of(undefined));

        actions$ = hot('--a', { a: mockAuthCheckAction });
        expected = cold('--b', { b: mockAuthCheckCompletionAction });
      });

      it('should notify state that the check succeeded', () => {
        expect(effects.guardCheck$).toBeObservable(expected);
      });
    });

    describe('and the check fails', () => {
      beforeEach(() => {
        const error = 'Auth token is not valid';
        const response = cold('#', {}, error);
        const mockAuthCheckCompletionAction = new DaffAuthGuardCheckCompletion(false);
        daffAuthDriver.check.and.returnValue(response);

        actions$ = hot('--a', { a: mockAuthCheckAction });
        expected = cold('--b', { b: mockAuthCheckCompletionAction });
      });

      it('should notify state that the check failed', () => {
        expect(effects.guardCheck$).toBeObservable(expected);
      });
    });
  });

  describe('login$ | when the user logs in', () => {
    let expected;

    const mockAuthLoginAction = new DaffAuthLogin(mockLoginInfo);

    describe('and the login is successful', () => {
      beforeEach(() => {
        daffLoginDriver.login.and.returnValue(of(mockAuth));
        const mockAuthLoginSuccessAction = new DaffAuthLoginSuccess(mockAuth);

        actions$ = hot('--a', { a: mockAuthLoginAction });
        expected = cold('--b', { b: mockAuthLoginSuccessAction });
      });

      it('should notify state that the login was successful', () => {
        expect(effects.login$).toBeObservable(expected);
      });
    });

    describe('and the login fails', () => {
      beforeEach(() => {
        const error = new DaffAuthenticationFailedError('Failed to log in');
        const response = cold('#', {}, error);
        daffLoginDriver.login.and.returnValue(response);
        const mockAuthLoginFailureAction = new DaffAuthLoginFailure(daffTransformErrorToStateError(error));

        actions$ = hot('--a', { a: mockAuthLoginAction });
        expected = cold('--b', { b: mockAuthLoginFailureAction });
      });

      it('should notify state that the login failed', () => {
        expect(effects.login$).toBeObservable(expected);
      });
    });
  });

  describe('storeAuthToken$ | storing the auth token after a successful login', () => {
    let expected;
    let authLoginSuccessAction;

    beforeEach(() => {
      authLoginSuccessAction = new DaffAuthLoginSuccess(mockAuth);
      actions$ = hot('--a', { a: authLoginSuccessAction });
      expected = cold('---');
    });

    it('should set the auth token in storage', () => {
      expect(effects.storeAuthToken$).toBeObservable(expected);
      expect(setAuthTokenSpy).toHaveBeenCalledWith(mockAuth.token);
    });

    describe('and the storage service throws an error', () => {
      beforeEach(() => {
        setAuthTokenSpy.and.callFake(throwStorageError);

        actions$ = hot('--a', { a: authLoginSuccessAction });
        expected = cold('--(b|)', { b: authStorageFailureAction });
      });

      it('should return a DaffAuthStorageFailure', () => {
        expect(effects.storeAuthToken$).toBeObservable(expected);
      });
    });
  });

  describe('check$ | when the user checks if their auth token is valid', () => {
    let expected;

    const mockAuthCheckAction = new DaffAuthCheck();

    describe('and the check is successful', () => {
      beforeEach(() => {
        daffAuthDriver.check.and.returnValue(of(undefined));
        const mockAuthCheckSuccessAction = new DaffAuthCheckSuccess();

        actions$ = hot('--a', { a: mockAuthCheckAction });
        expected = cold('--b', { b: mockAuthCheckSuccessAction });
      });

      it('should notify state that the check succeeded', () => {
        expect(effects.check$).toBeObservable(expected);
      });
    });

    describe('and the check fails', () => {
      beforeEach(() => {
        const error = new DaffAuthenticationFailedError('Auth token is not valid');
        const response = cold('#', {}, error);
        daffAuthDriver.check.and.returnValue(response);
        const mockAuthCheckFailureAction = new DaffAuthCheckFailure(daffTransformErrorToStateError(error));

        actions$ = hot('--a', { a: mockAuthCheckAction });
        expected = cold('--b', { b: mockAuthCheckFailureAction });
      });

      it('should notify state that the check failed', () => {
        expect(effects.check$).toBeObservable(expected);
      });
    });
  });

  describe('logout$ | when the user logs out', () => {
    let expected;

    const mockAuthLogoutAction = new DaffAuthLogout();

    describe('and the logout is successful', () => {
      beforeEach(() => {
        daffLoginDriver.logout.and.returnValue(of(mockAuth));
        const mockAuthLogoutSuccessAction = new DaffAuthLogoutSuccess();

        actions$ = hot('--a', { a: mockAuthLogoutAction });
        expected = cold('--b', { b: mockAuthLogoutSuccessAction });
      });

      it('should notify state that the logout succeeded', () => {
        expect(effects.logout$).toBeObservable(expected);
      });
    });

    describe('and the logout fails', () => {
      beforeEach(() => {
        const error = new DaffAuthInvalidAPIResponseError('Failed to log out');
        const response = cold('#', {}, error);
        daffLoginDriver.logout.and.returnValue(response);
        const mockAuthLogoutFailureAction = new DaffAuthLogoutFailure(daffTransformErrorToStateError(error));

        actions$ = hot('--a', { a: mockAuthLogoutAction });
        expected = cold('--b', { b: mockAuthLogoutFailureAction });
      });

      it('should notify state that the logout failed', () => {
        expect(effects.logout$).toBeObservable(expected);
      });
    });
  });

  describe('register$ | when the user registers an account', () => {
    let expected;

    const mockAuthRegisterAction = new DaffAuthRegister(mockRegistration);

    describe('and the registration is successful', () => {
      beforeEach(() => {
        daffRegisterDriver.register.and.returnValue(of(mockLoginInfo));
        const mockAuthRegisterSuccessAction = new DaffAuthRegisterSuccess(mockLoginInfo);

        actions$ = hot('--a', { a: mockAuthRegisterAction });
        expected = cold('--b', { b: mockAuthRegisterSuccessAction });
      });

      it('should notify state that the registration succeeded', () => {
        expect(effects.register$).toBeObservable(expected);
      });
    });

    describe('and the registration fails', () => {
      beforeEach(() => {
        const error = new DaffAuthInvalidAPIResponseError('Failed to register a new user');
        const response = cold('#', {}, error);
        daffRegisterDriver.register.and.returnValue(response);
        const mockAuthLoginFailureAction = new DaffAuthRegisterFailure(daffTransformErrorToStateError(error));

        actions$ = hot('--a', { a: mockAuthRegisterAction });
        expected = cold('--b', { b: mockAuthLoginFailureAction });
      });

      it('should notify state that the registration failed', () => {
        expect(effects.register$).toBeObservable(expected);
      });
    });
  });

  describe('loginAfterRegister$ | when registration completes successfully', () => {
    let expected;

    const mockAuthLoginAction = new DaffAuthLogin(mockLoginInfo);
    const mockAuthRegisterSuccessAction = new DaffAuthRegisterSuccess(mockLoginInfo);

    beforeEach(() => {
      actions$ = hot('--a', { a: mockAuthRegisterSuccessAction });
      expected = cold('--b', { b: mockAuthLoginAction });
    });

    it('should trigger a login', () => {
      expect(effects.loginAfterRegister$).toBeObservable(expected);
    });
  });
});
