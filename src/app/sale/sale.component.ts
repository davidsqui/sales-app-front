import { UserService } from './../services/user.service';
import { User } from './../models/user.model';
import { SaleService } from './../services/sale.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Sale } from './../models/sale.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  dataSource: MatTableDataSource<Sale>;
  displayedColumns = ['id', 'total', 'saleDate', 'modifiedBy'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userSelectedId: number;
  users: User[];

  constructor(
    private saleService: SaleService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.saleService.findAll().subscribe(res => {
      this.dataSource = new MatTableDataSource(res.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.userService.findAll().subscribe(users => {
      this.users = users;
    });

  }

  search(){
    const query = `userId=${this.userSelectedId}`;
    this.saleService.findAll(query).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.content);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
