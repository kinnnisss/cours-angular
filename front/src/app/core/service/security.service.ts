import { Injectable } from "@angular/core";
import { UserResponse,UserRequest } from "@core/model/user.model";
import { USERS_MOCK } from "@mock";
@Injectable({
    providedIn: 'root'
})
export class SecurityService {
  constructor() { }
  login(user:UserRequest):UserResponse | undefined {
    const users = [...USERS_MOCK];
    const u = users.find(u => u.email === user.email && u.password === user.password);
    if (u) {
      return {
        token: 'fake-jwt-token',
        user: u
      };
    }

    return undefined;
  }
}