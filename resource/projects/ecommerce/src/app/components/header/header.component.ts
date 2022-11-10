import { Component, OnInit, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs';
import { Storefront, StorefrontService, UserService, User } from '@congacommerce/ecommerce';
import { MiniProfileComponent } from '@congacommerce/elements';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @ViewChild('profile', { static: false }) profile: MiniProfileComponent;

  pageTop: boolean = true;
  modalRef: BsModalRef;

  storefront$: Observable<Storefront>;
  user$: Observable<User>;

  constructor(private storefrontService: StorefrontService,
    private userService: UserService,
    private router: Router,
    private authService: MsalService
    
    ) {}

  ngOnInit() {
    this.storefront$ = this.storefrontService.getStorefront();
    this.user$ = this.userService.me();
    
  }

  doLogout() {
        // TO DO: revoke token api
    // const logoutRequest: EndSessionRequest = {
    //     postLogoutRedirectUri: window.location.origin,
    //     authority: 'http://localhost:3000'
    //   //  onRedirectNavigate: false
    //   }
    // this.authService.logoutRedirect(logoutRequest).subscribe(
    //   res=>{
    //   console.log(res);
    // },
    // error => {
    //   console.log(error)
    // }
    // );
    localStorage.clear();
    window.location.reload();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.pageTop = window.pageYOffset <= 0;
  }
}
