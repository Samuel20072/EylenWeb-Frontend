import { Component } from '@angular/core';
import { Hero } from '../../components/home/hero/hero';
import { VideoComponent } from '../../components/home/video.component/video.component';
import { TestimonialsSection } from '../../components/home/testimonials-section/testimonials-section';
import { ProblemsSection } from '../../components/home/problems-section/problems-section';
import { StorySection } from '../../components/home/story-section/story-section';
import { MissionVisionSection } from '../../components/home/mission-vision-section/mission-vision-section';
import {ExperienciasSection} from '../../components/home/experiencias-section/experiencias-section';
import {PaquetesSection} from '../../components/home/paquetes-section/paquetes-section'
import {ComentariosSection} from '../../components/home/comentarios-section/comentarios-section'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, VideoComponent, TestimonialsSection, ProblemsSection, StorySection, MissionVisionSection,ExperienciasSection,PaquetesSection,ComentariosSection],
  templateUrl: './home.html',
})
export class Home {

}
