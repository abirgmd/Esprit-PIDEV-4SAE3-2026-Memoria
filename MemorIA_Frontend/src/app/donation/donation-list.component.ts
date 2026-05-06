import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService, Donation } from '../services/donation.service';

@Component({
  selector: 'app-donation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent implements OnInit {
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  lastUpdated: Date = new Date();

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations() {
    this.loading = true;
    this.donationService.getAllDonations().subscribe({
      next: (data) => {
        this.donations = data;
        this.applyFilter();
        this.loading = false;
        this.lastUpdated = new Date();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredDonations = [...this.donations];
      return;
    }
    const search = this.searchTerm.toLowerCase();
    this.filteredDonations = this.donations.filter(d => 
      d.firstName.toLowerCase().includes(search) || 
      d.lastName.toLowerCase().includes(search) || 
      d.email.toLowerCase().includes(search) ||
      (d.honoreeName && d.honoreeName.toLowerCase().includes(search))
    );
  }

  onRefresh() {
    this.loadDonations();
  }

  getTotalAmount(): number {
    return this.donations.reduce((sum, d) => sum + d.amount, 0);
  }
}
