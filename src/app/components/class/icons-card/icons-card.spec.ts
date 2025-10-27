import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsCard } from './icons-card';

describe('IconsCard', () => {
  let component: IconsCard;
  let fixture: ComponentFixture<IconsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
