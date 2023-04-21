import { Component, Input, OnInit } from '@angular/core';
import { CoreDataService } from '../../core-data.service';
import { BodyService } from '../../body.service';
import { HttpClient, } from '@angular/common/http';


@Component({
  selector: 'app-chatgpt-chat-bot',
  templateUrl: './chatgpt-chat-bot.component.html',
  styleUrls: ['./chatgpt-chat-bot.component.css']
})
export class ChatgptChatBotComponent implements OnInit {

  isChatPopUpOpen: boolean = false;
  chatText: string = '';
  imageLink: string = '';
  chatList: Array<string> = [];
  isMessageSending: boolean = false;
  @Input() Themecolor = 'Dark';


  constructor(public data: CoreDataService, private http: HttpClient, public main: BodyService) { }

  ngOnInit() {

    /* setting up logged in user's details */
    this.imageLink = (localStorage.getItem('profile_pic') != undefined) ? this.data.WEBSERVICE + '/user/' + localStorage.getItem('user_id') + '/file/' + localStorage.getItem('profile_pic') + '?access_token=' + localStorage.getItem('access_token') : './assets/img/default.png'

    


  }

  /* Method defination for initializing chatgpt message */
  handleIntialMessageOfChatbox = () => {
    this.chatText = '';
    this.chatList = [];
    let obj = {
      message: 'Hi ' + localStorage.getItem('user_name') + ', how can I help you?',
      messageSendByUser: false
    };
    this.handleRenderMessage(obj)
  }

  /* Method defination for opening chat popup*/
  handleOpenChatPopUp = () => {
    this.handleIntialMessageOfChatbox();
    this.isChatPopUpOpen = !this.isChatPopUpOpen
  }

  /* Method defination for sending message and Call api for getting response */
  handleSendMessage = () => {
    if (this.chatText != '') {
      let obj:any = {
        message: this.chatText,
        messageSendByUser: true
      };
      this.handleRenderMessage(obj)
      this.handleApiCallForChat(this.chatText);
    }
  }

  /* Method defination for rendering message from user and bots*/
  handleRenderMessage = (obj) => {
    //console.log(this.chatList)
    this.chatList.push(obj);
    
  }

  /* Method defination for API call chatgpt */
  handleApiCallForChat = (param) => {
    this.isMessageSending = true;
    console.log(param)
    let payload = {
      message: param
    }

    this.http.post<any>('https://accounts.paybito.com/api/user/chatgpt', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json', 'authorization': 'BEARER ' + localStorage.getItem('access_token'),
      }
    })
      .subscribe(response => {
        let chatResponse = JSON.parse(response.body);
        console.log('CHAT RESPONSE ==> ',chatResponse)
        if(chatResponse.statuscode != 1){
          this.data.alert(chatResponse.message, 'danger');
        }else{
          this.isMessageSending = false;
          this.chatText = '';
          let obj:any = {
            message: chatResponse.message,
            messageSendByUser: false
          };
          this.handleRenderMessage(obj)
        }
        

      }, reason => {
        // wip(0);
        console.log('CHATGPT REASON ==> ',reason);
        if(reason.statusText == 'Unknown Error'){
        this.data.alert('It seems your session is timed out for chat gpt. Please login again.', 'danger');

          // this.data.logout();
        }
        else{
        this.data.alert('Internal Server Error', 'danger');
        this.chatText = '';
        this.isMessageSending = false;

        }
        

      });

  }

}
