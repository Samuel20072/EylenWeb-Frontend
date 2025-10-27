import { Component } from '@angular/core';
import { Hero } from '../../components/sobreMi/hero/hero'
import { HistoriaPropositoSection } from '../../components/sobreMi/historia-proposito-section/historia-proposito-section'

@Component({
  selector: 'app-sobre-mi',
  imports: [Hero,HistoriaPropositoSection],
  templateUrl: './sobre-mi.html',
})
export class SobreMi {

}
