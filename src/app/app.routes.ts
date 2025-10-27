import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Class } from './pages/class/class';
import { SobreMi } from './pages/sobre-mi/sobre-mi';

export const routes: Routes = [

    {
        path: '',
        component: Home
    },
    {
        path: 'clases',
        component: Class
    },
    {
        path: 'sobre-mi',
        component: SobreMi
    }
];
