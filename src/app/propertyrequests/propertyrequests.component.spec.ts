import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyrequestsComponent } from './propertyrequests.component';

describe('PropertyrequestsComponent', () => {
  let component: PropertyrequestsComponent;
  let fixture: ComponentFixture<PropertyrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyrequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropertyrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
