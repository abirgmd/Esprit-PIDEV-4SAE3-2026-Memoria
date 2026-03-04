import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../services/stats.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-caregiver-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './caregiver-stats.component.html',
  styleUrls: ['./caregiver-stats.component.css']
})
export class CaregiverStatsComponent implements OnInit {
  stats: any = {};
  activityData: any[] = [];
  isLoading = true;
  maxActivityCount = 1;
  currentUser: any;

  constructor(
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.id) {
      this.loadMyStats();
      this.loadActivity();
    }
  }

  loadMyStats() {
    this.statsService.getUserStats(this.currentUser.id).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadActivity() {
    this.statsService.getActivityChart().subscribe({
      next: (data) => {
        this.activityData = data;
        this.maxActivityCount = Math.max(...data.map((d: any) => d.count), 1);
      }
    });
  }

  getBarHeight(count: number): number {
    return Math.max((count / this.maxActivityCount) * 160, 4);
  }

  getDayLabel(dateStr: string): string {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  }
}
