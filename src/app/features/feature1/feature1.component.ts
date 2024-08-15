import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCardComponent } from '../../m-framework/m-card/m-card.component';
import { MContainerComponent } from '../../m-framework/m-container/m-container.component';
@Component({
  selector: 'app-feature1',
  standalone: true,
  imports: [CommonModule, FormsModule, MContainerComponent, MCardComponent],
  templateUrl: './feature1.component.html',
  styleUrl: './feature1.component.css'
})
export class Feature1Component {
  selectedCard: string | null = null;

  showCard(card: string) {
    this.selectedCard = this.selectedCard === card ? null : card;
  }

}