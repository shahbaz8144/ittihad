import { Routes } from '@angular/router';

export const DEFAULT_ROUTES: Routes = [
    
    {
        path: '',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
    },{
        path: 'userpolicy',
        loadChildren: () => import('../policy/policy.module').then(m => m.PolicyModule)
    }
    ,
    {
        path: 'login',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
    }
    ,
    {
        path: 'Memo',
        loadChildren: () => import('../memo-details/memo-details.module').then(m => m.MemoDetailsModule)
    } 
    ,
    {
        path: 'Annoucement',
        loadChildren: () => import('../memo-details/memo-details.module').then(m => m.MemoDetailsModule)
    }
    ,
    {
        path: 'User',
        loadChildren: () => import('../user-details/user-details.module').then(m => m.UserDetailsModule)
    }
    ,
    {
        path: 'Gac',
        loadChildren: () => import('../memo-details/memo-details.module').then(m => m.MemoDetailsModule)
    } 
]