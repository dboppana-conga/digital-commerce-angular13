import { Component, OnInit, ViewChild, ElementRef, NgZone, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { get, last } from 'lodash';
import { User, UserService } from '@congacommerce/ecommerce';

/**
 *  Mini profile displays the First and the Last Name's Initials of the Current User.
 * <h3>Preview</h3>
 * <div>
 *    <h4>Mini profile on the dashboard view</h4>
 *    <img src="https://raw.githubusercontent.com/Apttus-Ecom/Summer19/master/res/mini-profile-rlp.png" style="max-width: 100%">
 * </div>
 * <h3>Usage</h3>
 *
 ```typescript
import { MiniProfileModule } from '@congacommerce/elements';

@NgModule({
  imports: [MiniProfileModule, ...]
})
export class AppModule {}
 ```
*
* @example
```typescript
* <apt-mini-profile
*              (onRegister)="handleOnRegister($event)"
*              (onLogin)="handleOnLogin($event)"
* ></apt-mini-profile>
```
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'apt-mini-profile',
  templateUrl: './mini-profile.component.html',
  styleUrls: ['./mini-profile.component.scss']
})
export class MiniProfileComponent implements OnInit {
  /** @ignore */
  @ViewChild('authModal') authModal: ElementRef;
  /** @ignore */
  @ViewChild('template') template: TemplateRef<any>;
  /**
   * Event emitter for when user registers.
   */
  @Output() onRegister: EventEmitter<User> = new EventEmitter<User>();
  /**
   * Event emitter for when user logs in.
   */
  @Output() onLogin: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Reference for the modal dialog
   * @ignore
   */
  modalRef: BsModalRef;
  /**
   * login state of the user
   * @ignore
   */
  loginState: 'LOGIN' | 'REGISTER' | 'RESET-PASSWORD' | 'REGISTER-CONFIRM' | 'RESET-CONFIRM' = 'LOGIN';
  /** @ignore */
  resetUsername: string;
  /** @ignore */
  user: User = new User();
  /** @ignore */
  username: string;
  /** @ignore */
  password: string;
  /** @ignore */
  loading: boolean = false;
  /** @ignore */
  me$: Observable<User>;
  /** @ignore */
  registerMessage: string;
  /** @ignore */
  loginMessage: string;
  /** @ignore */
  resetMessage: string;

  constructor(private userService: UserService,
    private ngZone: NgZone,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userService.initializeGuestUser().subscribe(res => this.user = res);
    this.me$ = this.userService.me();
  }

  /**
   * Allows user to register to the site using user email.
   * @ignore
   */
  doRegister() {
    this.loading = true;
    this.user.UserName = this.user.Email;
    this.userService.register(this.user).subscribe(
      res => {
        this.onRegister.emit(res);
        this.loading = false;
        this.modalRef.hide();
      },
      err => {
        this.loading = false;
        this.translateService.stream('LOGIN').subscribe((val: string) => {
          this.registerMessage = val['COULD_NOT_REGISTER'];
        });
      }
    );
  }
  /**
   * Allows user to login to the site using user credentials like username and password for the registered user otherwise it shows the error message.
   * @ignore
   */
  doLogin() {
    this.loading = true;
    combineLatest([this.userService.login(this.username, this.password), this.activatedRoute.queryParams])
      .pipe(take(1))
      .subscribe(
        res => {
          if (get(last(res), 'redirectUrl')) {
            window.location.href = get(last(res), 'redirectUrl');
            if ((!!window.location.hash)) window.location.reload(true);
          } else
            window.location.reload(true)
        },
        err => this.ngZone.run(() => {
          this.loading = false;
          this.translateService.stream('LOGIN').subscribe((val: string) => {
            this.loginMessage = val['WRONG_CREDENTIALS'];
          });
        })
      );
  }

  /**
   * Allows user to logout form the site
   * @ignore
  */
  doLogout() {
    this.userService.logout().subscribe(
      res => window.location.reload(),
      err => window.location.reload()
    );
  }
  /**
   * Allows user to reset the password for the exisiting user.
   * @ignore
   */
  doResetPassword() {
    this.loading = true;
    this.userService.sendPasswordResetEmail(this.resetUsername)
      .subscribe(
        res => this.ngZone.run(() => {
          this.loginState = 'RESET-CONFIRM';
          this.loading = false;
        }),
        err => this.ngZone.run(() => {
          console.log(err);
          this.resetMessage = 'An error occurred resseting your password. Please contact your administrator.';
          this.loading = false;
        })
      );
  }

  /**
   * opens modal dialog for the tempalate.
   * @ignore
   */
  openModal(strClass: string = null) {
    this.modalRef = this.modalService.show(this.template, (strClass) ? { 'class': strClass } : null);
  }

}
