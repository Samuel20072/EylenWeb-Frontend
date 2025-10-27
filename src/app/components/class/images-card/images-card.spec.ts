import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCard } from './images-card';

describe('ImagesCard', () => {
  let component: ImagesCard;
  let fixture: ComponentFixture<ImagesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
