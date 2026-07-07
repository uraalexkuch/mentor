import { Routes } from '@angular/router';
import { MentorshipProgramComponent } from './pages/profnavch/dcz-mentorship/forms/mentorship-program/mentorship-program.component';
import { MentorshipRegistrationComponent } from './pages/profnavch/dcz-mentorship/mentorship-registration/mentorship-registration.component';
import { DczMentorshipConsultregionMainComponent } from './pages/profnavch/dcz-mentorship/dcz-mentorship-consultregion-main/dcz-mentorship-consultregion-main.component';
import { DczMentorshipConsultregionInfoComponent } from './pages/profnavch/dcz-mentorship/dcz-mentorship-consultregion-info/dcz-mentorship-consultregion-info.component';

export const routes: Routes = [
  // Головна сторінка програми з реєстрами
  { 
    path: 'profnavch/mentorship', 
    component: MentorshipProgramComponent 
  },
  // Єдина варіативна форма реєстрації
  { 
    path: 'profnavch/mentorship/register', 
    component: MentorshipRegistrationComponent 
  },
  // Сторінка консультантів (головна з сайдбаром та контентом)
  {
    path: 'profnavch/mentorship/consultants',
    component: DczMentorshipConsultregionMainComponent
  },
  { path: '**', redirectTo: 'profnavch/mentorship' }
];
