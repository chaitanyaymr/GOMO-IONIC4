import { HttpClient,  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GomoEnvironment } from '../Gomo_Common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class GomoService {

  constructor(private http: HttpClient, private gomoenv: GomoEnvironment) { }


  private setHeader(): HttpHeaders {
    const headersConfig = new HttpHeaders();
    headersConfig.append('Content-type', 'application/json');
    headersConfig.append('Accept', 'application/json');
    return headersConfig;
  }

  gomouserlogin(userid, pcode, fcmtoken) {

    const header = this.setHeader();
    header.append('strUserId', `${userid}`);
    header.append('strPasscode', `${pcode}`);

    const obj = {
      strIpAddress: '10.10.10.12',
      strLogType: 'M',
      strDeviceType: '',
      strDeviceToken: fcmtoken,
      strMemberId: 0,
      strLinkedUserId: 0
    };

    const options ={ headers: header };

    return this.http.post(this.gomoenv.API_url + "UserLogin", obj, options);

  }
  MemberUserLogin(userid,pcode,fcmtoken){

    const header={
      strUserId:userid,
      strPasscode:pcode
    }
    
    
   const obj = {
    strIPAddress:'10.10.10.12',
    strLogType: 'M',
    strDeviceType:'M',
    strDeviceOS:'',
    strAPPVersion:'',
    strLatitude:'',
    strLongitude:'',
    strMemberId:1,
    strLinkedUserId: 0
   };
   
   const options ={ headers: header };

      return  this.http.post(this.gomoenv.API_url+"MemberUserLogin",obj,options)
                      
  }
  MemberUserInformation(data){
  
    return  this.http.get(this.gomoenv.API_url+"/MemberUserInformation/"+data)
    
   }
   CreateMemberUserDeviceToken(str:any){
    let body = {"strSearchString" :str }
    //let options = new RequestOptions({headers : this.gomoenv.headers})
    return this.http.post(this.gomoenv.API_url+"CreateMemberUserDeviceToken",body);
  }

  MembersDetails(data){
    
    let body={
         "strSearchString":data
        }
    return  this.http.post(this.gomoenv.API_url+"/MembersDetails",body);
    
   }
   GetNewConversationlist(strstring:any)
   {
    
    let body={
         "strSearchString":strstring
        }
     
        return  this.http.post(this.gomoenv.API_url+"/MessengerContactInfo",body);
  }



}//end for page
