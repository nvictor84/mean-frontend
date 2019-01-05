import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {LoginComponent} from './ui/login/login.component';
import {AuthGuard} from './core/auth/auth.guard';

const routes: Routes = [
  { path: '',  component: PostListComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: LoginComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {
}
