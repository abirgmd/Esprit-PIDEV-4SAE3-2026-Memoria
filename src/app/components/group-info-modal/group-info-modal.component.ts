import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PresenceService } from '../../services/presence.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-group-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-info-modal.component.html',
  styleUrls: ['./group-info-modal.component.css']
})
export class GroupInfoModalComponent implements OnInit {
  @Input() conversation: any;
  @Output() close = new EventEmitter<void>();
  @Output() openMemberProfile = new EventEmitter<any>();
  @Output() openLightbox = new EventEmitter<string>();

  onlineUserIds: Set<number> = new Set();
  mediaMessages: any[] = [];
  activeTab: 'members' | 'media' = 'members';

  private apiUrl = environment.communityApiUrl;

  constructor(
    private presenceService: PresenceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.presenceService.getOnlineUsers().subscribe(users => {
      this.onlineUserIds = users;
    });
    this.loadMedia();
  }

  loadMedia() {
    if (this.conversation?.id) {
      this.http.get<any[]>(`${this.apiUrl}/messages/conversation/${this.conversation.id}/media`).subscribe({
        next: (data) => this.mediaMessages = data,
        error: () => {}
      });
    }
  }

  get members(): any[] {
    return this.conversation?.community?.members || this.conversation?.participants || [];
  }

  get groupName(): string {
    return this.conversation?.community?.name || 'Groupe';
  }

  get groupDescription(): string {
    return this.conversation?.community?.description || '';
  }

  get groupTags(): string {
    return this.conversation?.community?.tags || '';
  }

  get createdBy(): string {
    const creator = this.conversation?.community?.createdBy;
    if (!creator) return '';
    return (creator.firstName || '') + ' ' + (creator.lastName || '');
  }

  get createdAt(): string {
    const d = this.conversation?.community?.createdAt;
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  get imageMedia(): any[] {
    return this.mediaMessages.filter(m => m.fileType?.startsWith('image/'));
  }

  get fileMedia(): any[] {
    return this.mediaMessages.filter(m => !m.fileType?.startsWith('image/'));
  }

  isMemberOnline(memberId: number): boolean {
    return this.onlineUserIds.has(memberId);
  }

  getMemberName(member: any): string {
    return (member.firstName || member.prenom || '') + ' ' + (member.lastName || member.nom || '');
  }

  getRoleLabel(role: string): string {
    if (role === 'SOIGNANT') return 'Médecin';
    if (role === 'ACCOMPAGNANT') return 'Accompagnant';
    return role || '';
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

  onMemberClick(member: any) {
    this.openMemberProfile.emit(member);
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
