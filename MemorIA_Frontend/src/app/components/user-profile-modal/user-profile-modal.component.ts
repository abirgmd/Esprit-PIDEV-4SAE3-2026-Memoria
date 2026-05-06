import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PresenceService } from '../../services/presence.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {
  @Input() userId!: number;
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() userEmail: string = '';
  @Input() conversationId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() openLightbox = new EventEmitter<string>();

  isOnline = false;
  lastSeen: string | null = null;
  isLoading = true;
  activeTab: 'info' | 'media' = 'info';

  messages: any[] = [];
  mediaMessages: any[] = [];
  totalMessagesInConv = 0;
  sharedMediaCount = 0;
  firstMessageDate: string | null = null;
  lastMessageDate: string | null = null;

  private apiUrl = environment.communityApiUrl;

  constructor(
    private presenceService: PresenceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.checkPresence();
    this.loadConversationData();
    this.loadMedia();
  }

  loadConversationData() {
    if (!this.conversationId) {
      this.isLoading = false;
      return;
    }
    this.http.get<any[]>(`${this.apiUrl}/messages/conversation/${this.conversationId}`).subscribe({
      next: (msgs) => {
        this.messages = msgs || [];
        this.totalMessagesInConv = this.messages.length;
        if (this.messages.length > 0) {
          const sorted = [...this.messages].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          this.firstMessageDate = this.formatDate(sorted[0].createdAt);
          this.lastMessageDate = this.formatRelative(sorted[sorted.length - 1].createdAt);
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadMedia() {
    if (!this.conversationId) return;
    this.http.get<any[]>(`${this.apiUrl}/messages/conversation/${this.conversationId}/media`).subscribe({
      next: (data) => {
        this.mediaMessages = data || [];
        this.sharedMediaCount = this.mediaMessages.length;
      },
      error: () => {}
    });
  }

  checkPresence() {
    this.presenceService.isUserOnline(this.userId).subscribe((online: boolean) => {
      this.isOnline = online;
    });
    this.presenceService.getLastSeen(this.userId).subscribe((data: any) => {
      if (data?.lastSeen) {
        this.lastSeen = this.formatLastSeen(data.lastSeen);
      }
    });
  }

  get imageMedia(): any[] {
    return this.mediaMessages.filter(m => m.fileType?.startsWith('image/'));
  }

  get fileMedia(): any[] {
    return this.mediaMessages.filter(m => !m.fileType?.startsWith('image/'));
  }

  getFileUrl(fileUrl: string): string {
    return `${this.apiUrl}/messages/files?path=${fileUrl}`;
  }

  getFileName(msg: any): string {
    return msg.content || msg.fileUrl?.split('/').pop() || 'Fichier';
  }

  openImage(url: string) {
    this.openLightbox.emit(url);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatRelative(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return this.formatDate(dateStr);
  }

  formatLastSeen(dateStr: string): string {
    return this.formatRelative(dateStr);
  }

  getRoleLabel(): string {
    if (this.userRole === 'SOIGNANT') return 'Médecin';
    if (this.userRole === 'ACCOMPAGNANT') return 'Accompagnant';
    return this.userRole || 'Utilisateur';
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onClose() {
    this.close.emit();
  }
}
