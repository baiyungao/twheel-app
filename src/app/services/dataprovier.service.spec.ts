import { TestBed } from '@angular/core/testing';

import { DataprovierService } from './dataprovier.service';

describe('DataprovierService', () => {
  let service: DataprovierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataprovierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
