import {ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, Type} from '@angular/core';
import {DialogModule} from './dialog.module';
import {DialogComponent} from './dialog.component';
import {DialogConfig} from './config';
import {DialogInjector} from './dialog-injector';
import {DialogRef} from './dialog-ref';

@Injectable({
  providedIn: DialogModule
})
export class DialogService {

  dialogComponentRef: ComponentRef<DialogComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector) {
  }

  public open(componentType: Type<any>, config: DialogConfig) {
    const dialogRef = this.appendDialogComponentToBody(config);
    this.dialogComponentRef.instance.childComponentType = componentType;
    return dialogRef;
  }

  private appendDialogComponentToBody(config: DialogConfig) {
    // Create a new map with the config
    const map = new WeakMap();
    // Add the config to dependency injection
    map.set(DialogConfig, config);
    // Add the Dialog Ref to dependency injection
    const dialogRef = new DialogRef();
    map.set(DialogRef, dialogRef);
    // Subscribe to the close method
    const sub = dialogRef.afterClosed.subscribe(() => {
      this.removeDialogComponentFromBody();
      sub.unsubscribe();
    });
    // Get the DialogComponent Factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    // Instantiate the component and pass the injector so it can use dependency injection
    const componentRef = componentFactory.create(new DialogInjector(this.injector, map));
    // Attach the component to the component tree
    this.appRef.attachView(componentRef.hostView);
    // Get the DOM of our DialogComponent and attach it to the HTML body
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    this.dialogComponentRef = componentRef;
    this.dialogComponentRef.instance.onClose.subscribe(() => {
      this.removeDialogComponentFromBody();
    });
    return dialogRef;
  }

  /*
  Removes the DialogComponent from the DOM once it's closed
   */
  private removeDialogComponentFromBody() {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
  }
}
