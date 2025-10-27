import { Component } from '@angular/core';
import { Hero } from '../../components/sobreMi/hero/hero'
import { HistoriaPropositoSection } from '../../components/sobreMi/historia-proposito-section/historia-proposito-section'
import { FisolofiaSection } from '../../components/sobreMi/fisolofia-section/fisolofia-section'
import { FormacionSection } from '../../components/sobreMi/formacion-section/formacion-section';

@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  imports: [Hero, HistoriaPropositoSection, FisolofiaSection, FormacionSection],
  templateUrl: './sobre-mi.html',
})
export class SobreMi {}
