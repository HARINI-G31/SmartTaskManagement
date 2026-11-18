import { Routes } from '@angular/router';
import { CreateProjectComponent } from './features/projects/create-project/create-project';
import { ProjectListComponent } from './features/projects/project-list/project-list';
import { ProjectDetailsComponent } from './features/projects/project-details/project-details';
import { EditProjectComponent } from './features/projects/edit-project/edit-project';
export const routes: Routes = [
  {
    path: 'projects/create',
    component: CreateProjectComponent,
  },
  { path: 'projects/edit/:id', component: EditProjectComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  {
    path: 'projects',
    component: ProjectListComponent,
  },
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
];
