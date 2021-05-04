import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() selected = 'empty';
  @Input() id = 0;
  deleteID: string;
  idString: string;
  hasWidget: boolean;
  title;

  updateSelected(name): void {
    this.selected = name;
    this.updateTitle(name);
  }

  deleteWidget(event): void {
    const node = document.getElementById(this.deleteID);
    node.parentElement.parentElement.setAttribute('style', 'flex-basis: calc(33.3% - 32px);');
    node.parentElement.parentElement.setAttribute('class', 'card text-center shadow mt-3 mr-4');
    node.parentElement.parentElement.parentElement.removeChild(node.parentNode.parentNode);
  }

  changeWidgetSize(): void {
    // const node = document.getElementById(this.deleteID);
    // node.parentElement.parentElement.setAttribute('style', 'flex-basis: calc(66.6% - 32px);');
    // node.parentElement.parentElement.setAttribute('class', 'card text-center shadow mt-3 mr-4');
  }

  constructor() {
  }

  ngOnInit(): void {
    this.idString = this.id.toString();
    this.deleteID = this.idString + 'delete';
    if (this.selected !== 'empty') {
      this.hasWidget = true;
    }
  }

  updateTitle(name): void {
    if (name === 'chart') {
      this.title = 'Kontoverlaufsübersicht';
    } else if (name === 'acc-transactions') {
      this.title = 'Einnahmen und Ausgaben';
    } else if (name === 'acc-list') {
      this.title = 'Konten';
    }
  }
}
