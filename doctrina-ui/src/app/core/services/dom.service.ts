import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  ApplicationRef
} from '@angular/core';

export interface Offset {
  left: number;
  top: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}


@Injectable({
  providedIn: 'root'
})

export class DomService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  public getOffset(el: HTMLElement): Offset {
    let rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
      bottom: (rect.top + window.scrollY) + (rect.bottom - rect.top),
      right: (rect.left + window.scrollX) + (rect.right - rect.left)
    }
  }

  public downloadFile(fileName: string, fileContent: string, contentType: string) {

    let downloadLink = document.createElement('a');

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      const blob = new Blob(['\ufeff', fileContent], {
        type: contentType
      });
      navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      downloadLink.href = 'data:' + contentType + ',' + fileContent;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    document.body.removeChild(downloadLink);
  }
}



