import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerprofileComponent } from './ownerprofile.component';

describe('OwnerprofileComponent', () => {
  let component: OwnerprofileComponent;
  let fixture: ComponentFixture<OwnerprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
