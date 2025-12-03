import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HereSectionComponent } from './here-section.component';

describe('HereSectionComponent', () => {
  let component: HereSectionComponent;
  let fixture: ComponentFixture<HereSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HereSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HereSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
