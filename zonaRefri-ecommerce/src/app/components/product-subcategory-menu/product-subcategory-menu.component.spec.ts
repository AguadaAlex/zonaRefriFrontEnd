import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSubcategoryMenuComponent } from './product-subcategory-menu.component';

describe('ProductSubcategoryMenuComponent', () => {
  let component: ProductSubcategoryMenuComponent;
  let fixture: ComponentFixture<ProductSubcategoryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSubcategoryMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSubcategoryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
