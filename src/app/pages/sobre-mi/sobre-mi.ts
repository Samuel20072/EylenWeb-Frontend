import { Component } from '@angular/core';
import { Hero } from '../../components/sobreMi/hero/hero'
import { HistoriaPropositoSection } from '../../components/sobreMi/historia-proposito-section/historia-proposito-section'
import { FisolofiaSection } from '../../components/sobreMi/fisolofia-section/fisolofia-section'
import { FormacionSection } from '../../components/sobreMi/formacion-section/formacion-section';
import { TestimoniosSection } from '../../components/sobreMi/testimonios-section/testimonios-section';
import { MomentosSection } from '../../components/sobreMi/momentos-section/momentos-section';
import { AgendarAhoraSection } from '../../components/class/agendar-ahora-section/agendar-ahora-section';

@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  imports: [Hero, HistoriaPropositoSection, FisolofiaSection, FormacionSection,TestimoniosSection,MomentosSection,AgendarAhoraSection],
  templateUrl: './sobre-mi.html',
})
export class SobreMi {}
