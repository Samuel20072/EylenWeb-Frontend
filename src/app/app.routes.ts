import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Class } from './pages/class/class';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },
    {
        path: 'clases',
        component: Class
    }
];
