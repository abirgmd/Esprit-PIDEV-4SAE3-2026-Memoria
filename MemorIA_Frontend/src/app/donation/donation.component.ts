import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService, Donation } from '../services/donation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation',
  standalone: true, // Assuming this project uses standalone components based on app.config.ts
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent {
  step: number = 1;
  
  donation: Donation = {
    amount: 35,
    currency: 'USD',
    dedicated: false,
    honoreeName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    receiveEmail: true
  };

  amounts: number[] = [35, 60, 120, 250, 500, 1000];
  customAmount: number | null = null;
  showCustomInput: boolean = false;
  isCustomFocused: boolean = false;

  constructor(private donationService: DonationService, private router: Router) {}

  setAmount(amount: number) {
    this.donation.amount = amount;
    this.customAmount = null;
  }

  toggleCustomInput() {
    this.showCustomInput = !this.showCustomInput;
    if (this.showCustomInput) {
      this.donation.amount = 0;
    }
  }

  nextStep() {
    if (this.customAmount) {
      this.donation.amount = this.customAmount;
    }
    this.step = 2;
  }

  prevStep() {
    this.step = 1;
  }

  submitDonation() {
    this.donationService.createDonation(this.donation).subscribe({
      next: (res) => {
        alert('Thank you for your donation!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert('An error occurred. Please try again.');
      }
    });
  }
}
