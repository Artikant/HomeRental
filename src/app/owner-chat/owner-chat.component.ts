import { Component, OnInit } from '@angular/core';
import { AllMessage, ChatService, Message } from '../chat.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-owner-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-chat.component.html',
  styleUrl: './owner-chat.component.css'
})
export class OwnerChatComponent implements OnInit {
  propertyIdState: string = '';
  ownerIdState: string = '';
  propertyId: number = 0;
  ownerId: number = 0;
  messages: Message[]=[];
  selectedChat:Message[]|null=null;
  userId:number=0;
  currtenant:number=0;
  ownerUserId:number|null=null;
  newMessage: string = '';

  constructor(private chatService: ChatService, private location: Location,private authService:AuthService) { }
  ngOnInit(): void {
    this.ownerUserId=this.authService.getCurrentUserId();
    const state = this.location.getState() as { propertyId: string, ownerId: string };
    console.log(state);
    if (state) {
      this.propertyIdState = state.propertyId;
      this.ownerIdState = state.ownerId;
      this.propertyId = parseInt(this.propertyIdState);
      this.ownerId = parseInt(this.ownerIdState);
      this.chatService.getAllUserMessage(this.propertyId, this.ownerId).subscribe({
        next: data => {
          console.log(data);
          this.messages=data;
          console.log(this.messages);
          console.log(this.messages[0].messageText);

          // console.log(this.messages[0].user);
          // this.messages = data;
          // console.log("messages" + this.messages);
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }
  selectChat(chat:Message){
    if(this.ownerId!=chat.receiverId){
    this.userId=chat.receiverId;
    }else{
      this.userId=chat.senderId;
    }
    console.log(this.userId);
    this.chatService.getMessages(this.propertyId,this.userId,this.ownerId).subscribe({
      next:data=>{
        console.log(data);
        this.selectedChat=data;
        console.log(this.ownerId);
      },
      error:error=>{
        console.log(error);
      }
    })
console.log(chat);
  }
  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return; 
    }
    if(this.ownerUserId){
    const message: Message = {
      propertyId: this.propertyId,
      senderId:this.ownerUserId,
      receiverId: this.userId,
      messageText: this.newMessage,
      timestamp: new Date(),
      messageId: 0,
      property: null,
      sender: null,
      receiver: null
    };
  
    console.log(message);
    debugger;
    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
        if(message && this.selectedChat){
        this.selectedChat.push(message);
        }
        this.selectedChat=[];
        this.newMessage = '';
      },
      error: error => {
        console.error('Error sending message:', error);
      }
    });
  }
  }
  // selectChat(chat: any) {
  //   this.selectedChat = chat;
  // }

  deselectChat() {
  //   this.selectedChat = null;
  }

  // sendMessage() {
  //   if (this.newMessage.trim()) {
  //     const newMsg = {
  //       senderId: this.ownerId,
  //       sender: 'Owner', // Change as needed
  //       messageText: this.newMessage,
  //       timestamp: new Date()
  //     };
  //     this.selectedChat.messages.push(newMsg);
  //     this.newMessage = '';
  //   }
  // }
}
