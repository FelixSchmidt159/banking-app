import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {TransactionComponent} from './transaction/transaction.component';
import {UserComponent} from './user/user.component';
import {TransferOrdersComponent} from './transfer-orders/transfer-orders.component';
import {NewTransactionComponent} from './new-transaction/new-transaction.component';
import {ProfileComponent} from './profile/profile.component';
import {TransactionOverviewComponent} from './transaction-overview/transaction-overview.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'transaction',
    component: TransactionComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'transfer_orders',
    component: TransferOrdersComponent
  },
  {
    path: 'transaction/new_transaction',
    component: NewTransactionComponent
  },
  {
    path: 'transaction/overview',
    component: TransactionOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
