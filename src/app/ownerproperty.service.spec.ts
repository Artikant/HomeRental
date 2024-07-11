import { TestBed } from '@angular/core/testing';

import { OwnerpropertyService } from './ownerproperty.service';

describe('OwnerpropertyService', () => {
  let service: OwnerpropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerpropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
