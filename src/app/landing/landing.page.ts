import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile,AccessService } from '../services/access.service';
import { LocalStoreService } from '../services/local-store.service';

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
  constructor(private router: Router, public access: AccessService, 
    public localstore:LocalStoreService) { }

  login(){
     
     
      this.access.login(this.email,this.password).subscribe(
      (data: Profile) => {  this.access.currentUser = { ...data }
                            console.log('authenticiated: '+ JSON.stringify(this.access.currentUser));
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
    
  
    console.log("reconnect ....");
    this.recover();
    }

  /**
   * 
   */
  /**
 * 
 * @returns function to recover from previou login session;
 */
   async recover(){
    let password:string,email:string;
    await this.localstore.get("email")
    .then(data=>{ email= data;});
    console.log("email:" + email);
    await this.localstore.get("password")
    .then(data=>{ password=data});
    console.log("password:" + password);

    this.email = email;
    this.password = password;
    await this.login();
  }
}
