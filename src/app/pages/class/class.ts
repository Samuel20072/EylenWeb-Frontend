import { Component } from '@angular/core';
import { HeroClass } from '../../components/class/hero-class/hero-class'
import { ModalidadesSection } from '../../components/class/modalidades-section/modalidades-section'
import { ExperienciasSection } from '../../components/class/experiencias-section/experiencias-section'
import { BeneficiosSection } from '../../components/class/beneficios-section/beneficios-section';
import { ImagesSection } from '../../components/class/images-section/images-section';
import { LoquedicenAlumnasSection } from '../../components/class/loquedicen-alumnas-section/loquedicen-alumnas-section';
import { AgendarAhoraSection } from '../../components/class/agendar-ahora-section/agendar-ahora-section';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [HeroClass,ModalidadesSection,ExperienciasSection,BeneficiosSection,ImagesSection,LoquedicenAlumnasSection,AgendarAhoraSection],
  templateUrl: './class.html',
})
export class Class {

}
