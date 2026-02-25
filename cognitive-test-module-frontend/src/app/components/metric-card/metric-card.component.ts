import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-metric-card',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './metric-card.component.html',
    styleUrl: './metric-card.component.css'
})
export class MetricCardComponent {
    title = input.required<string>();
    value = input.required<string | number>();
    subtitle = input.required<string>();
    trend = input<string>();
    icon = input.required<any>();
    color = input.required<'blue' | 'green' | 'orange' | 'red'>();
}
