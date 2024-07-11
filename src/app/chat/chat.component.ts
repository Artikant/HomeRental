import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ChatService, Message } from '../chat.service';
import { error } from 'console';
import { FormsModule } from '@angular/forms';
import { AuthService, Users } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  propertyIdState: string = '';
  userIdState: string = '';
  ownerIdState: string = '';
  propertyId: number = 0;
  userId: number = 0;
  ownerId: number = 0;
  messages: Message[] = [];
  user: Users | null = null;
  newMessage: string = '';
  constructor(private router: Router, private location: Location, private chatService: ChatService, private authService: AuthService, private apiService: ApiService) { }

  ngOnInit(): void {
    const state = this.location.getState() as { propertyId: string, userid: string, ownerId: string };
    console.log(state);
    if (state) {
      this.propertyIdState = state.propertyId;
      this.userIdState = state.userid;
      this.ownerIdState = state.ownerId;
      this.propertyId = parseInt(this.propertyIdState);
      this.userId = parseInt(this.userIdState);
      this.ownerId = parseInt(this.ownerIdState);
      this.authService.getCurrentUser(this.ownerId).subscribe({
        next: (data:Users) => {
          this.user = data;
          console.log(this.user);
        },
        error: error => {
          console.log(error);
        }
      })
      this.chatService.getMessages(this.propertyId, this.userId, this.ownerId).subscribe({
        next: data => {
          console.log(data);
          this.messages = data;

        },
        error: error => {
          console.log(error);
        }
      });
    } else {
      console.error('No state found in navigation');
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return; // Do not send empty messages
    }
    const message: Message = {
      propertyId: this.propertyId,
      senderId: this.userId,
      receiverId: this.ownerId,
      messageText: this.newMessage,
      timestamp: new Date(),
      messageId: 0,
      property: null,
      sender: null,
      receiver: null
    };
console.log(message);
    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
        this.messages.push(message);
        this.newMessage = '';
        console.log("yes");
      },
      error: error => {
        console.error('Error sending message:', error);
      }
    });
  }
}
