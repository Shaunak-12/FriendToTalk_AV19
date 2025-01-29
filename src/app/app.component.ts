import { Component,CUSTOM_ELEMENTS_SCHEMA,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common'; 
import { inject } from '@angular/core';

import { SignalService } from '../../src/app/services/signal.service';
// import { ToastrService, ToastrModule } from 'ngx-toastr';
// import * as alertify from 'alertifyjs';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,MatButtonModule
  ],
  // standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppComponent implements OnInit{
  signalR = inject(SignalService);
  constructor(){}
  audio=new Audio();
  ngOnInit(): void {
    // if(localStorage.getItem('userSites')){
    //   let userSites = JSON.parse(localStorage.getItem('userSites') || '{}');
    //   if(!sessionStorage.getItem('selectedSite')){
    //     sessionStorage.setItem('selectedSite',userSites[0].Code);
    //     sessionStorage.setItem('chosenSite',userSites[0].Name);
    //     sessionStorage.setItem('WalChosen',userSites[0].Wallets[0].Id);
    //     sessionStorage.setItem('WalList',JSON.stringify(userSites[0].Wallets));
    //     sessionStorage.setItem('WalName',userSites[0].Wallets[0].Name+' - '+userSites.Wallets[0].Code);
    //   }
    // }

    if (localStorage.getItem('userSites')) {
      const userSites = JSON.parse(localStorage.getItem('userSites') || '{}');
      
      if (Array.isArray(userSites) && userSites.length > 0 && userSites[0].Wallets && userSites[0].Wallets.length > 0) {
        if (!sessionStorage.getItem('selectedSite')) {
          sessionStorage.setItem('selectedSite', userSites[0].Code);
          sessionStorage.setItem('chosenSite', userSites[0].Name);
          sessionStorage.setItem('WalChosen', userSites[0].Wallets[0].Id);
          sessionStorage.setItem('WalList', JSON.stringify(userSites[0].Wallets));
          sessionStorage.setItem('WalName', `${userSites[0].Wallets[0].Name} - ${userSites[0].Wallets[0].Code}`);
        }
      } else {
        console.error('Invalid userSites structure or missing Wallets.');
      }
    } else {
      console.error('No userSites found in localStorage.');
    }
    
    this.recivedMsg();
  }
  dismissThisNotification(button: { parentElement: any; }) {
    let notification = button.parentElement;
    // alertify.dismiss(notification);
}

  recivedMsg(){
    this.signalR.messageReceived$.subscribe((data)=>{
      // alertify.set('notifier','delay', 10);
      // alertify.success('<span class="alertTitle"> <button (click)="dismissThisNotification(this)" style="float:right; background:none;border:none; color:white;">x</button>'+data.NotificationType+'</span>'+'<div style="line-height:1.4 !important"><span class="alertText">'+data.message+'</span></div>',
      // 'success', 5, function(){  console.log('dismissed'); });
      this.audio.src = '/assets/music/notimu.mp3';
      this.audio.load();
      this.audio.play();
    });
  }
}