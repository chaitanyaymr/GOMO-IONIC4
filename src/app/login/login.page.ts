import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController, MenuController, NavController } from '@ionic/angular';
import { GomodbService } from '../Providers/gomodb.service';
import { GomoService } from '../Service/gomo.service';
import { GomoEnvironment } from '../Gomo_Common';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  signupForm: FormGroup;
  keepmeloggedin: any = {};
  isenabled: boolean = false;
  membersUsersImgs:any;
  groupUsersImgs:any;
  constructor(public navCtrl: NavController
    , public gomoenv: GomoEnvironment,
    public gomoservice: GomoService,
    private menu: MenuController,
    public gomodb: GomodbService,
    private toastCtrl: ToastController,
    private storage: NativeStorage, 
    private transfer: FileTransfer,
   private file: File,) {
    this.keepmeloggedin.selected = true;
    this.menu.enable(false);
  }

  ngOnInit() {

    this.signupForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),

    });
    this.membersUsersImgs="https://gomoportalimages.usegomo.com/Membersusers/";
   this.groupUsersImgs = "https://gomoportalimages.usegomo.com/GroupIcons/";
  }
  checklogin() {

    this.isenabled = true;
    let remcheck = this.keepmeloggedin.selected == true ? 'Y' : 'N';
    if (!this.signupForm.controls["username"].valid)
      this.gomoenv.addErrorMessage("Enter User Name");
    if (!this.signupForm.controls["password"].valid)
      this.gomoenv.addErrorMessage("Enter Password");
    this.gomoenv.displayErrors().then(data => {
      this.userlogin(this.signupForm.controls["username"].value,
        this.signupForm.controls["password"].value, remcheck);
    }).catch(() => {
      this.isenabled = false;
      return false;
    })


  }

  userlogin(uname, pwd, rem) {

    this.gomoenv.startLoading();
    this.gomoservice.MemberUserLogin(uname, pwd, this.gomoenv.fcmtoken).subscribe
      ((data: any) => {
        console.log(data);
        let loginuserinfo: any = data[0];
        if (data.length > 0) {
          if (data[0].userErrorId < 0) {
            alert(data[0].userErrorMessage);
            this.navCtrl.navigateRoot("/login");
          }
          else {
            let str = "";
            str += "<deviceTokenInfo>"
            str += "<userId>" + data[0].userErrorId + "</userId>"
            str += "<deviceToken>" + this.gomoenv.fcmtoken + "</deviceToken>"
            str += "<deviceType>M</deviceType>"
            str += "</deviceTokenInfo>";
            this.gomoservice.MemberUserInformation(loginuserinfo.userErrorId).subscribe(resdata => {
              let userinfo = resdata[0];
              this.gomoservice.CreateMemberUserDeviceToken(str).subscribe(res => {
                console.log("Error_ID" + res[0].errId);
                console.log("Token FCM" + res[0].tokenKey);

                this.gomoservice.MembersDetails(loginuserinfo.userloggedInMember).subscribe(reslt => {

                  this.gomodb.createUser(loginuserinfo.userErrorId, userinfo.memberUserImage, userinfo.memberUserFirstName, userinfo.memberUserLastName, uname, pwd, userinfo.memberGroupId, userinfo.memberRole,
                    userinfo.memberGuId, rem, userinfo.memberId, userinfo.memberTitle, userinfo.memberCode, userinfo.userEmail, loginuserinfo.userloggedInMember, reslt[0].logo).then((res) => {
                      console.log("response from db", res);

                      let convnewlist = [];
                      let userGroupList = [];
                      let newstr: any = "";
                      newstr += "<getConvoInfo>"
                      newstr += "<loggedInUserId>" + loginuserinfo.userErrorId + "</loggedInUserId>"
                      newstr += "<projectId>0</projectId>"
                      newstr += "<tagFormType></tagFormType>"
                      newstr += "<tagTitle></tagTitle>"
                      newstr += "<loadOnlyUNR>N</loadOnlyUNR>"
                      newstr += "<loadByFormBased>N</loadByFormBased>"
                      newstr += "</getConvoInfo>"

                      this.gomoservice.GetNewConversationlist(newstr).subscribe(data => {
                        console.log(data);       
                       let dt:any=[];
                       dt=data;
                        var ulist = [];
                        var ugrouplist = [];
                        dt.filter(function(e){ 
                          if(e.groupType.replace(/\s+/g, '') == 'I'){
                            ulist.push(e);    
                          }else if(e.groupType.replace(/\s+/g, '') == '' || e.groupType.replace(/\s+/g, '') == null){
                            ulist.push(e); 
                          }else if(e.groupType.replace(/\s+/g, '') == 'G'){
                            ugrouplist.push(e);
                          }
                        });
                       
                        ulist.sort(function(a, b){
                         var nameA=a.converationName.toLowerCase().replace(/ /g,'');
                         var nameB=b.converationName.toLowerCase().replace(/ /g,'');  
                               
                         if (nameA < nameB) //sort string ascending
                          return -1;
                         if (nameA > nameB)
                          return 1;
                         return 0; //default return value (no sorting)
                        });
                      
                       
                      
                        
                      
                         userGroupList.sort(function(a, b){
                           var nameA=a.converationName.toLowerCase().replace(/ /g,'');
                           var nameB=b.converationName.toLowerCase().replace(/ /g,'');  
                                 
                           if (nameA < nameB) //sort string ascending
                            return -1;
                           if (nameA > nameB)
                            return 1;
                           return 0; //default return value (no sorting)
                   });
                         //console.log(convnewlist);
                       //  console.log(userGroupList);
                       convnewlist = ulist;
                       userGroupList = ugrouplist;
                 
                         this.storage.setItem('groplist',userGroupList).then(()=>{
                           console.log("stored list");
                         });
                 
                         this.storage.setItem('userlist',convnewlist).then(()=>{
                           console.log("stored list"+convnewlist);
                       });

                       this.downloadFile(convnewlist);
                       console.log(convnewlist);
             
                       this.isenabled=false;
                       this.navCtrl.navigateRoot('/home');

                      });//end for GetNewConversationList
                

                    });//end for createUser

                });//end for MembersDetails

              });//end for CreateMemberUserDeviceToken
            });//end for MemberUserInformation


          }

        }


      });
  }



  downloadFile(convdata:any=[]) {
 
    convdata.forEach((element) => {

      if(element.converationImage != ""){
        let url="";
   
          url=this.membersUsersImgs+element.converationImage;
           console.log(url);
           let filename=element.converationImage;
       
        const fileTransfer= this.transfer.create();
         fileTransfer.download(url,this.file.externalDataDirectory+filename,true).then((entry)=>{
       
          console.log("File Uploaded Success: "+this.file.externalDataDirectory+filename);
        //  element.converationImage=this.file.externalDataDirectory+filename;
          //this.imgprovider.addUserInfo(convdata,this.file.externalDataDirectory+filename);
         // console.log(element);
    
        },(error)=>{                  
          console.log("error at download",error);
          //element.converationImage="assets/icon/DeafaultUserImg2.jpg";
        })
     
      }
         
       
    });
 
    
  }




  noSpacePlz(instr) {
    if (instr == 'uname') {
      var uname = this.signupForm.controls["username"].value;
      var index = uname.indexOf(' ');

      if (index > -1) {
        this.presentToast();
        this.signupForm.controls["username"].patchValue(uname.trim());
      }

    } else if (instr == 'pwd') {
      var pwd = this.signupForm.controls["password"].value;
      var index = pwd.indexOf(' ');

      if (index > -1) {
        this.presentToast();
        this.signupForm.controls["password"].patchValue(pwd.trim());
      }
    }
  }


  presentToast() {

    this.gomoenv.showCredentialsAlert();
  }

}
