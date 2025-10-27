import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemItem } from '../problem-item/problem-item';

@Component({
  selector: 'app-problems-section',
  standalone: true,
  imports: [CommonModule, ProblemItem],
  templateUrl: './problems-section.html'
})
export class ProblemsSection {
  problems = [
    {
      number: 'PROBLEMA 1',
      title: 'Tengo mucho estres por el trabajo',
      description: 'No logro desconectar mi mente y mi cuerpo termina cargado de tensión.',
      imageSrc: '../../assets/images/problems/problem1.png',
      isLeft: false,
      rotation: 8,
      offsetY: 40,
      offsetX: 70  
      
    },
    {
      number: 'PROBLEMA 2',
      title: 'Me siento desconectada de mi feminidad',
      description: 'La rutina diaria nos aleja de nuestra esencia femenina y perdemos la conexión con nosotras mismas.',
      imageSrc: '../../assets/images/problems/problem2.png',
      isLeft: true,
      rotation: -12,
      offsetY: 40,
      offsetX: -60  
    },
    {
      number: 'PROBLEMA 3',
      title: 'La ansiedad no me deja tranquila',
      description: 'Mi cabeza no para, me cuesta respirar en calma y estar presente.',
      imageSrc: '../../assets/images/problems/problem3.png',
      isLeft: false,
      rotation: -7,
      offsetY: 40,
      offsetX: 60   
    },
    {
      number: 'PROBLEMA 4',
      title: 'Tengo bloqueos emocionales',
      description: 'Las experiencias pasadas crean barreras que nos impiden expresar nuestras emociones libremente.',
      imageSrc: '../../assets/images/problems/problem4.png',
      isLeft: true,
      rotation: -8,
      offsetY: 40,
      offsetX: -60   
    },
    {
      number: 'PROBLEMA 5',
      title: 'Me falta confianza en mí misma',
      description: 'La inseguridad nos limita y nos impide alcanzar nuestro potencial y vivir con autenticidad.',
      imageSrc: '../../assets/images/problems/problem5.png',
      isLeft: false,
      rotation: -8,
      offsetY: 45,
      offsetX: 60   
    },
    {
      number: 'PROBLEMA 6',
      title: 'No encuentro tiempo para mí',
      description: 'Las responsabilidades nos consumen y nos olvidamos de cuidar nuestra propia bienestar.',
      imageSrc: '../../assets/images/problems/problem6.png',
      isLeft: true,
      rotation: -8,
      offsetY: 45,
      offsetX: -50   
    },
    {
      number: 'PROBLEMA 7',
      title: 'Estoy agotada física y mentalmente',
      description: 'El cansancio constante nos impide disfrutar de la vida y mantener relaciones saludables.',
      imageSrc: '../../assets/images/problems/problem7.png',
      isLeft: false,
      rotation: -8,
      offsetY: 30,
      offsetX: 60   
    },
    {
      number: 'PROBLEMA 8',
      title: 'Me cuesta relacionarme con otras mujeres',
      description: 'La competencia y los juicios nos alejan de crear conexiones auténticas con otras mujeres.',
      imageSrc: '../../assets/images/problems/problem8.png',
      isLeft: true,
      rotation: -8,
      offsetY: 40,
      offsetX: -65   
    }
  ];
}
