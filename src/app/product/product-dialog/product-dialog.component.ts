import { Product } from './../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductStatus } from 'src/app/models/productStatus.model';
import { ProductService } from 'src/app/services/product.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {

  form: FormGroup;
  statusSelectedId: number;
  status: ProductStatus[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productService: ProductService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadProductStatus();
    this.loadForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      status: [null, [Validators.required]],
    });
  }

  loadForm(): void {
    if (this.data.id) {
      this.form.patchValue({
        name: this.data.name,
        price: this.data.price,
        status: this.data.status.id,
      });
      this.statusSelectedId = this.data.status.id;
    }
  }

  loadProductStatus(): void {
    this.productService.findAllStatus().subscribe(status => {
      this.status = status;
    });
  }

  save(event: Event): void {
    event.preventDefault();

    let productToSave = new Product();
    const status = new ProductStatus();
    const userLogged = JSON.parse(sessionStorage.getItem('user') || '');

    status.id = this.statusSelectedId;
    productToSave = this.form.value;
    productToSave.status = status;
    productToSave.modifiedBy = userLogged.id;

    if (this.data.id) {
      productToSave.id = this.data.id;
      this.productService.update(productToSave).pipe(switchMap(() => {
        return this.productService.findAll();
      })).subscribe(res => {
        this.productService.productSubject.next(res.content);
      });
    } else {
      this.productService.save(productToSave).pipe(switchMap(() => {
        return this.productService.findAll();
      })).subscribe(res => {
        return this.productService.productSubject.next(res.content);
      });
    }
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
