import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorship-pairs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentorship-pairs.component.html',
  styleUrls: []
})
export class MentorshipPairsComponent {
  pairs = [
    { id: '1', mentor: 'Іванов Іван', mentee: 'Петров Петро', status: 'Активна', isVeteranGroup: false },
    { id: '2', mentor: 'Сидоров Сидір', mentee: 'Коваленко Анна', status: 'Планується', isVeteranGroup: false }
  ];

  createVeteranGroup() {
    // Basic logic to demonstrate creating a veteran group
    this.pairs.push({
      id: Date.now().toString(),
      mentor: 'Не призначено',
      mentee: 'Група ветеранів (автозбір)',
      status: 'Планується',
      isVeteranGroup: true
    });
    alert('Створено цільову групу взаємної підтримки для ветеранів та членів їх сімей.');
  }
}
