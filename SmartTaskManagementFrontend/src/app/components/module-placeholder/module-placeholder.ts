import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-module-placeholder',
  standalone: true,
  templateUrl: './module-placeholder.html',
  styleUrl: './module-placeholder.css'
})
export class ModulePlaceholder {
  private readonly route = inject(ActivatedRoute);

  readonly title = this.route.snapshot.data['title'] as string;
  readonly message = this.route.snapshot.data['message'] as string;
  readonly description = this.route.snapshot.data['description'] as string;
}
