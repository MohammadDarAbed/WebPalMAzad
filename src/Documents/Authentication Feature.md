# PalMazad - Authentication Feature: Full Process & Logic Documentation

This document provides a complete explanation of how **authentication** is implemented in the **PalMazad Angular App**, including:
- Step-by-step implementation    
- Reasoning and logic behind each decision    
- Code snippets with detailed comments    
- Practical examples using PalMazad    
- Manual and automated testing guidance    

This guide is written to help **any developer** understand **how authentication works in Angular** and how to implement it correctly using **JWT**, **refresh tokens**, **guards**, **interceptors**, and **token storage**.

---

## 🔐 Overview: Authentication Flow

Before diving into code, here is the **authentication flow** we implement:

1. ✅ User logs in with email/username + password    
2. ✅ Backend returns:    
    - `accessToken` (short-lived, used in headers)        
    - `refreshToken` (long-lived, used to refresh access token)        
3. ✅ App stores tokens in `localStorage`    
4. ✅ All secure HTTP requests use the access token (via an interceptor)    
5. ❌ If access token expires:    
    - Interceptor auto-requests a new one using the refresh token        
    - Stores the new tokens        
    - Repeats original request        
6. ❌ If refresh token also fails (expired or revoked):    
    - App logs the user out        

---

## ✅ Step 1: AuthService – Central Auth Logic

This service handles **login, logout, refresh, and token access**.

```
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'https://localhost:5000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  /**
   * Logs in user by sending credentials to backend
   * Stores returned tokens in localStorage
   */
  login(credentials: { userNameOrEmail: string; password: string }) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        this.tokenService.setTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  /**
   * Logs out user by clearing tokens and notifying server
   */
  logout() {
    const refreshToken = this.tokenService.refreshToken;
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    }
    this.tokenService.clear();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refreshes token when accessToken expires
   */
  refreshToken() {
    const refreshToken = this.tokenService.refreshToken;
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.apiUrl}/refresh-token`,
      { refreshToken }
    );
  }

  getAccessToken(): string | null {
    return this.tokenService.accessToken;
  }

  getRefreshToken(): string | null {
    return this.tokenService.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
```

---

## ✅ Step 2: TokenService – Manage Local Storage

This is a dedicated service to manage access and refresh tokens.

```
@Injectable({ providedIn: 'root' })
export class TokenService {
  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clear() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
```

**🔎 Why use a separate TokenService?**

- Keeps responsibilities clean (single responsibility principle)    
- Makes it reusable in interceptors and other services    

---

## ✅ Step 3: AuthInterceptor – Attach Token + Auto Refresh

This automatically adds the `Authorization` header to each request, and refreshes the token on 401 errors.

```
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.accessToken;
    let authReq = req;

    // 🔐 Attach access token to header if available
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.authService.refreshToken().pipe(
            switchMap((response: any) => {
              // 🔁 Update stored tokens
              this.tokenService.setTokens(response.accessToken, response.refreshToken);
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${response.accessToken}` }
              });
              this.isRefreshing = false;
              return next.handle(newReq);
            }),
            catchError(refreshError => {
              // ❌ Refresh failed, force logout
              this.tokenService.clear();
              this.authService.logout();
              this.isRefreshing = false;
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
```

📌 Register in `AppModule`:

```
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

 🛡️ Why you need it:

Without `AuthInterceptor`, every service (e.g., `ProductsService`) would need to manually attach the token:
```
// Without interceptor (not recommended)
this.http.get('/api/products', {
  headers: { Authorization: `Bearer ${accessToken}` }
});
```

This leads to:

- ❌ Code duplication    
- ❌ Risk of forgetting to attach token    
- ❌ No automatic token refresh when 401 happens    

✅ If you remove it:
- The app may still work if your backend **doesn't validate tokens** or your requests **don't hit protected endpoints**.    
- But once you secure APIs, every unauthenticated request will fail.
---

## ✅ Step 4: AuthGuard – Protect Routes

Blocks unauthorized users from accessing protected routes like `/home` or `/products`.

```
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
```

Use it in your routes:

```
{
  path: 'products',
  component: ProductListComponent,
  canActivate: [AuthGuard]
}
```
> canActivate: \[AuthGuard]: this line to protect the lazy loading, for example if the user try to go to this   http://localhost:4200/products without login the app will block him.

🛡️ Why you need it:

Without `AuthGuard`, anyone can type `/home` in the browser and see the page — even if they’re not logged in or tokens are expired.

✅ If you remove it:
- Your UI will allow navigating to `/home` or `/products` without any auth check.    
- The backend may still reject API calls, but the **UI will show broken or partial views**.
---

## 🧪 Manual Testing Steps

|Feature|How to Test|
|---|---|
|✅ Login|Enter valid credentials → tokens stored → navigate to /home|
|✅ Logout|Click logout → clear storage → redirect to login|
|✅ Refresh token flow|Wait until access token expires → navigate → token refreshed|
|❌ Refresh fails|Manually delete refresh_token → navigate → redirected to login|

---

## 🧠 Why Use Refresh Token Logic?

- Access tokens are short-lived for **security**.    
- Refresh tokens stay longer and allow re-authentication **without interrupting UX**.    
- Refreshing keeps the session alive silently.    
- If refresh fails, app forces logout = safety.    

---

## ✅ Summary: Full Flow in One Sentence

> "User logs in → access/refresh tokens are saved → every request gets token → if expired, we auto-refresh → else logout."

## 📦 Token Storage in Angular Authentication
in **PalMazad** Angular app so far, we used **`localStorage`** to store:

- `access_token` (JWT)    
- `refresh_token`    

This is managed by your `TokenService`:

```
localStorage.setItem('access_token', accessToken); localStorage.setItem('refresh_token', refreshToken);
```

---

### 🔒 Why use `localStorage`?

|Pros|Cons|
|---|---|
|✅ Simple and persistent (survives page refresh)|❌ Vulnerable to **XSS attacks** (JavaScript can access it)|
|✅ Easy to use with interceptors and guards|❌ Cannot set **httpOnly** flag like cookies|
|✅ Works well for SPAs|❌ Sensitive if your app is vulnerable to injected scripts|

---

### ❓Should you use `localStorage` or `cookies`?

|Use Case|Recommendation|
|---|---|
|SPA with JWT + refresh tokens|`localStorage` is fine **if app is XSS-safe**|
|Server-side session management|Use `httpOnly` **cookies**|
|High-security, bank-style apps|Use cookies with **same-site + httpOnly + secure** flags|
### 🧠 Why Do We Need Token Storage?

When a user logs in successfully, the backend returns two tokens:
- **Access Token**: Short-lived, used to authenticate each request    
- **Refresh Token**: Longer-lived, used to get a new access token without logging in again    

To persist user sessions across page reloads or browser tabs, we need to store these tokens **somewhere** on the client side.

---

### ✅ Options for Token Storage

#### 1. **localStorage**

- ✅ Persists across tabs and refreshes    
- ❌ Vulnerable to **XSS** attacks (any JavaScript can access it)    

```
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);
```

##### Use When:

- You have good XSS protections (e.g., Content Security Policy)    
- You want persistence even after closing the browser    

---

#### 2. **sessionStorage**

- ✅ Only lives in one tab    
- ✅ Less risk of token leakage across tabs    
- ❌ Lost when page is refreshed or tab is closed    

```
sessionStorage.setItem('access_token', accessToken);
```

##### Use When:

- You only need session-level login (e.g., admin panels)    
- You want extra security and don't need persistence    

---

#### 3. **Cookies (with HttpOnly flag)**

- ✅ Immune to XSS (JavaScript can't access it)    
- ✅ Can use `SameSite`, `Secure`, and `HttpOnly`    
- ❌ Needs server-side control    
- ❌ Complex in SPAs (CORS, CSRF)    

##### Use When:

- You have access to modify the backend to support secure cookies    
- You want to maximize security over convenience
# 🔐 Full Angular Authentication Flow – PalMazad Project

This document explains the full **Authentication Flow** in an Angular application, using your **PalMazad** project as a real-world example. We'll break down each step, explain the logic, and show how components interact to achieve secure authentication using **JWT** and **refresh tokens**.

---

## 📦 Overview of the Auth Feature

The authentication system handles:

- ✅ Login
    
- ✅ Logout
    
- ✅ Storing and retrieving JWT and refresh tokens
    
- ✅ Automatically refreshing access tokens
    
- ✅ Route guarding
    

We use:

- **localStorage** to store tokens
    
- **HTTP Interceptor** to attach tokens and handle refresh
    
- **AuthService**, **TokenService**, **AuthGuard**, and **AuthInterceptor** to manage logic
    

---

## 🔁 1. Login Flow

### 🔹 Step 1: User submits credentials

```
const credentials = { userNameOrEmail: 'user', password: 'pass' };
this.authService.login(credentials).subscribe(...);
```

### 🔹 Step 2: `AuthService` sends request

```
login(credentials: LoginRequest) {
  return this.http.post<AuthResponse>(
    `${this.apiUrl}/auth/login`,
    credentials
  ).pipe(
    tap(response => {
      this.tokenService.setTokens(response.token, response.refreshToken);
    })
  );
}
```

### 🔹 Step 3: Tokens are stored in `localStorage`

```
// token.service.ts
setTokens(token: string, refreshToken: string) {
  localStorage.setItem('access_token', token);
  localStorage.setItem('refresh_token', refreshToken);
}
```

### 🔹 Step 4: User is redirected to `/home`

```
this.router.navigate(['/home']);
```

---

## 🚀 2. Using Access Token (Attach to Requests)

### 🔹 AuthInterceptor adds token to headers

```
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.tokenService.accessToken;
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next.handle(req);
}
```

---

## 🔄 3. Refreshing Token

### 🔹 When does it happen?

When a request fails with a 401 (Unauthorized), and the token is expired.

### 🔹 Interceptor logic

```
catchError(err => {
  if (err.status === 401 && !this.isRefreshing) {
    this.isRefreshing = true;
    return this.authService.refreshToken().pipe(
      switchMap(newTokens => {
        this.tokenService.setTokens(newTokens.token, newTokens.refreshToken);
        const newReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newTokens.token}` }
        });
        return next.handle(newReq);
      }),
      catchError(err => {
        this.tokenService.clear();
        this.router.navigate(['/auth/login']);
        return throwError(() => err);
      })
    );
  }
  return throwError(() => err);
})
```

---

## 🚪 4. Logout

### 🔹 `logout()` method

```
logout() {
  const refreshToken = this.tokenService.refreshToken;
  this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe();
  this.tokenService.clear();
  this.router.navigate(['/auth/login']);
}
```

---

## 🧱 5. Route Guard – Protecting Routes

### 🔹 `AuthGuard`

```
canActivate(): boolean {
  if (!this.authService.isAuthenticated()) {
    this.router.navigate(['/auth/login']);
    return false;
  }
  return true;
}
```

### 🔹 Usage in routing

```
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
```

---

## 🧪 6. How to Test the Flow

### ✅ Login Test

- Enter valid credentials → tokens stored?
    
- Navigate → access home page?
    

### 🔁 Refresh Token Test

- Set token expiry short (e.g. 1 min)
    
- Wait 1 min → trigger API → check if interceptor refreshes token
    

### 🚪 Logout Test

- Call logout → tokens cleared?
    
- Try to access /home → redirected to /auth/login?
    

### ❌ Expired/Invalid Refresh Token Test

- Tamper with `refresh_token` in localStorage
    
- Trigger refresh → should redirect to login