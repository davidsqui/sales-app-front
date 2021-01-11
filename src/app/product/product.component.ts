import { User } from './../models/user.model';
import { SaleService } from './../services/sale.service';
import { SaleDetail } from './../models/saleDetail.model';
import { Sale } from './../models/sale.model';
import { Product } from './../models/product.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { switchMap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  dataSource: MatTableDataSource<Product>;
  displayedColumns = ['select', 'id', 'name', 'price', 'status', 'acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  selection = new SelectionModel<Product>(true, []);
  details: SaleDetail[] = [];

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.productService.findAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.productService.productSubject.subscribe(products => {
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.saleService.saleMessage.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  delete(id: number): void {
    this.productService.delete(id).pipe(switchMap(() => {
      return this.productService.findAll();
    })).
      subscribe(res => {
        this.productService.productSubject.next(res.content);
      });
  }

  openDialog(product?: Product): void {
    const prod = product != null ? product : new Product();
    this.dialog.open(ProductDialogComponent, {
      width: '250px',
      data: prod
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  toSale() {
    const userLogged = JSON.parse(sessionStorage.getItem('user') || '');
    let products = this.selection.selected;

    products = products.map(product => {
      product.modifiedBy = userLogged.id;
      return product;
    });

    const sale = new Sale();
    const user = new User();
    user.id = userLogged.id;

    products.forEach(product => {
      const detail = new SaleDetail();
      detail.product = product;
      detail.amount = 1;

      this.details.push(detail);
    });

    sale.modifiedBy = user;
    sale.details = this.details;

    this.saleService.save(sale).pipe(switchMap(() => {
      return this.productService.findAll();
    })).subscribe(res => {
      this.productService.productSubject.next(res.content);
      this.saleService.saleMessage.next('La venta se realizó con éxito');
    });

  }

}
