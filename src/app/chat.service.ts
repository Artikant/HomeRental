import { Injectable } from '@angular/core';
import { Property } from './api.service';
import { Owners, Users } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Message{
  messageId:number;
  propertyId:number;
  senderId:number;
  receiverId: number;
  messageText: string;
  timestamp: Date;
  property: Property|null,
  sender: Users|null;
  receiver: Users|null;
}
// export interface Message {
//   messageId: number;
//   propertyId: number;
//   senderId: number;
//   receiverId: number;
//   messageText: string;
//   timestamp: Date;
//   sender: Users;
//   receiver: Users;
// }

// export interface User {
//   userId: number;
//   name: string;
//   email: string;
// }
export interface LastMessage{
messageId:number;
messageText:string;
timestamp:Date;
}
export interface AllMessage{
user:Users;
messageCount:number;
lastMessage:LastMessage;
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatUrl = 'api/Chat'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getMessages(propertyId: number, userId: number, ownerId: number): Observable<Message[]> {
    console.log(propertyId);
    return this.http.get<Message[]>(`${this.chatUrl}/receive?propertyId=${propertyId}&userId=${userId}&ownerId=${ownerId}`);
  }

  sendMessage(message: Message): Observable<any> {
    return this.http.post<any>(`${this.chatUrl}/send`, message);
  }
  getAllUserMessage(propertyId:number,ownerId:number):Observable<Message[]>{
    return this.http.get<Message[]>(`${this.chatUrl}/receiveAll?propertyId=${propertyId}&ownerId=${ownerId}`);
  }
}
