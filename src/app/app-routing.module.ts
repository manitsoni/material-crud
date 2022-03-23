import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetDataComponent } from './crud/get-data/get-data.component';

const routes: Routes = [{
  path: 'getData', component: GetDataComponent
},{
  path:'**',pathMatch:'full',redirectTo:'getData'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
