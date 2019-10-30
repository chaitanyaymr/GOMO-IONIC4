import{Injectable,OnInit } from '@angular/core'
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
declare var navigator:any;
@Injectable()
export class GomoEnvironment implements OnInit{
    public loadingPopup: any;
    public API_url :any;
    public imgurl:any;
    public n_errorcount :any=0;
    public v_message :any='';
    public headers:any;
    public ApiUrl:any;
    fcmtoken:any="";
    public Chat_count:Number=0;
    public pageid : any=0;
    public signalrConnectionId:any="";
    public username:any="";
    public profileimg:any="";
    public globleconvid:any="";
    public ismsgsend:boolean=false;
    public isdeleteorclear:any="";
    public isall_convlist:boolean=false;
    public isTyping:boolean=false;
    public isMute_global:boolean=false;
    constructor
        ( public alertController: AlertController,
        public loadingCtrl: LoadingController,
        public toastController: ToastController,
        public alertCtrl: AlertController
        )
    {
        //this.API_url='https://devapi.usegomo.com/api/'
        //this.imgurl='https://devapi.usegomo.com/Images/'
        this.API_url='https://gomoportalapi.usegomo.com/api/';
        this.imgurl='https://gomoportalimages.usegomo.com/';
    }
    ngOnInit(){
 
    }
   
addErrorMessage(msg) {
    this.n_errorcount = this.n_errorcount + 1;
    this.v_message =
      this.v_message + "(" + this.n_errorcount + ") " + msg + "<br/>";
  }

  async displayErrors() {
    if (this.n_errorcount == 0) {
      return true;
    } else {
      const alert = await this.alertController.create({
          message:"Please check the following: <p>" + this.v_message+"</p>",
          buttons:['OK']
      });
     
     await alert.present();
      this.v_message = "";
      this.n_errorcount = 0;
      return false;
    }
  }

  async showCredentialsAlert() {
    const alert = await this.alertController.create({
      
        message: "Invalid User Name or Password",
      buttons: ["OK"],
    
    });
    await alert.present();
  }
  
   startLoading()
   {
     this.loadingPopup=true;
     return this.loadingCtrl.create({
         duration:5000,
     }).then(a=>{
         a.present().then(()=>{
            `<div class="loading-Header" ></div>
            <div class="custom-spinner-container">
            <div class="custom-spinner-box">
            <div class="loading-body"> Loading ... </div>
            </div>
          </div>`;
          if(!this.loadingPopup)
          a.dismiss().then(()=>console.log('abort presenting'))
         })
     })
  }
  async dismiss()
  {
      this.loadingPopup=false;
     return await this.loadingCtrl.dismiss().then(()=>console.log('dismissed'))
  }
  
  
 
   stopLoading()
   {
      setTimeout(()=>{
        this.loadingPopup.dismiss();
        return false;
      },500);
   }

 async ShowAlert(message){
    let alert = await this.alertController.create({
        subHeader:message,
        buttons:["OK"]
    });
   
     await alert.present();
      this.v_message = "";
      this.n_errorcount = 0;
  }

  

}

