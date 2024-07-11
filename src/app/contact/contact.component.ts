import { Component,OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;
      console.log('Form Data:', formData);
      // You can add logic to send form data to your backend or display a success message
    }
  }

}