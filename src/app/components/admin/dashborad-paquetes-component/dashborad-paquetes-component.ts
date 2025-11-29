import { Component } from '@angular/core';
import {PackagesListComponent} from '../packages-list-component/packages-list-component';
import {CreatePackageComponent} from '../create-package-component/create-package-component';
import {TopPackagesComponent} from '../top-packages-component/top-packages-component';

@Component({
  standalone: true,
  selector: 'app-dashborad-paquetes-component',
  imports: [TopPackagesComponent,CreatePackageComponent,PackagesListComponent],
  templateUrl: './dashborad-paquetes-component.html',
})
export class DashboradPaquetesComponent {

}
