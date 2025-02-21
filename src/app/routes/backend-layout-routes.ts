import { Routes } from '@angular/router';

export const BACKEND_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'streambox',
        loadChildren: () => import('../streambox/streambox.module').then(m => m.StreamboxModule)
    },
    {
        path: 'NewArchive',
        loadChildren: () => import('../archive/archive.module').then(m => m.ArchiveModule)
    },
    {
        path: 'ArchiveSettings',
        loadChildren: () => import('../archivesettings/archivesettings.module').then(m => m.ArchivesettingsModule)
    },
    {
        path: 'customerticketing',
        loadChildren: () => import('../customerticketing/customerticketing.module').then(m => m.CustomerticketingModule)
    },
    {
        path: 'Inbox',
        loadChildren: () => import('../communication/communication.module').then(m => m.CommunicationModule)
    },
    {
        path: 'Archive',
        loadChildren: () => import('../gacarchiving/gacarchiving.module').then(m => m.GACArchivingModule)
    },
    {
        path: 'Setting',
        loadChildren: () => import('../setting/setting.module').then(m => m.SettingModule)
    }
    ,
    {
        path: 'masterforms',
        loadChildren: () => import('../master-forms/master-forms.module').then(m => m.MasterFormsModule)
    }
    ,
    {
        path: 'administration',
        loadChildren: () => import('../administration/administration.module').then(m => m.AdministrationModule)
    }
    ,
    {
        path: 'test',
        loadChildren: () => import('../test/test.module').then(m => m.TestModule)
    } 
]