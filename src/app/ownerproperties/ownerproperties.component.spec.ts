import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerpropertiesComponent } from './ownerproperties.component';

describe('OwnerpropertiesComponent', () => {
  let component: OwnerpropertiesComponent;
  let fixture: ComponentFixture<OwnerpropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerpropertiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerpropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
