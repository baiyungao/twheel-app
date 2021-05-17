import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile,AccessService } from '../services/access.service';
import { DebugService } from '../services/debug.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  email: string;
  password: string;

  /**fiels for signup */
  firstName: string;
  lastName: string;
  phone: string;
  state: string;
  address: string;

  /**
   * 
   */
  debugMsg: string;

  isSignup: boolean = false;
  user: Profile;
  constructor(private router: Router, public access: AccessService, public debug: DebugService) { }

  login(){
     
      this.debug.debug("enter login ....");
      this.access.login(this.email,this.password).subscribe(
      (data: Profile) => {  this.access.currentUser = { ...data }
                            this.debug.debug('authenticiated: '+ JSON.stringify(this.access.currentUser));
                            this.router.navigate(['authenticated']);
                          }
    )
  }


  signup(){

    let userProfile:Profile;
     userProfile = {
        email:this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        password: this.password,
        state: this.state,
        address: this.address
    }

    console.log(userProfile);

    this.access.signup(userProfile).subscribe((data)=>{
      this.login();
    })
    
  }


  enterLogin(){
    this.isSignup=false;
   }
  enterSignup(){
    this.isSignup = true;
  }

  ngOnInit() {
  }

}
