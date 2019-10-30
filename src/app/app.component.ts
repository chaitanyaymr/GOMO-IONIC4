import { Component } from '@angular/core';

import { Platform, IonApp, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GomodbService } from './Providers/gomodb.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { GomoEnvironment } from './Gomo_Common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user:any=[];
  pages:Array<{title:string,component:any,name:string}>
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public gomodb:GomodbService,
    private gomoenv:GomoEnvironment,
    private fcm:FCM,
    private navctrl:NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.fcm.subscribeToTopic('all');
    
      this.fcm.getToken().then((token)=>{
        console.log('get token '+token)
      this.gomoenv.fcmtoken=token;
     })
  
     this.fcm.onNotification().subscribe((data)=>{
      if(data.wasTapped)
      {
        console.log("received Notification",data);
       
          }
      else
      {
       
       console.log("received Notification foreground");
      }
    });
     this.fcm.onTokenRefresh().subscribe((token)=>{
     this.gomoenv.fcmtoken=token;
      console.log(token);
  });

   
        this.gomodb.getDatabaseState().subscribe((result)=>{
          console.log("Database State",result);
             if(result)
              {
                this.gomodb.getAllUsers().then((data:any)=>{
                  this.user=data;
                  console.log("userData",this.user);
                  if(this.user.length>0)
                  {
                    if(this.user[0].Rem=="Y")
                    {
                      this.navctrl.navigateRoot('/home');
                    }
                    else
                    this.navctrl.navigateRoot('/login');
                  }
                else
                {
                  this.navctrl.navigateRoot('/login');
                }
                
                 
                })
                }
      
               });
      
    
    });
  }
}
