import { Component, Input, OnInit } from '@angular/core'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Item, Task } from 'src/app/models/task.model'; 
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent implements OnInit {

  @Input() task: Task;
  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl([], [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    
    this.user = this.utilsSvc.getElementFromLocalStorage('user')
    if (this.task) {
      this.form.setValue(this.task);
      this.form.updateValueAndValidity()
    }
  }
  
  createTask() {
    let path = `users/${this.user.uid}`;
    this.utilsSvc.presentLoading();
    delete this.form.value.id;
    this.firebaseSvc.addToSubcollection(path, 'tasks', this.form.value).then(res => {
        this.utilsSvc.dismissModal({ success: true });
        this.utilsSvc.presentToast({
            message: 'Tarea creada exitosamente',
            color: 'success',
            icon: 'checkmark-circle-outline',
            duration: 1500
        });
        this.utilsSvc.dismissLoading()
    }, error => {
      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
    });
    this.utilsSvc.dismissLoading()
    });
}

submit(){
  if(this.form.valid){
    if(this.task){
      this.updateTask()
    }else{
      this.createTask();
    }
  }
}



updateTask() {
  let path = `users/${this.user.uid}/tasks/$(this.task.id)`;
  this.utilsSvc.presentLoading();
  delete this.form.value.id;
  this.firebaseSvc.updateDocument(path, this.form.value).then(res => {
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
          message: 'Tarea actualizada exitosamente',
          color: 'success',
          icon: 'checkmark-circle-outline',
          duration: 1500
      });
      this.utilsSvc.dismissLoading()
  }, error => {
    this.utilsSvc.presentToast({
      message: error,
      color: 'warning',
      icon: 'alert-circle-outline',
      duration: 5000
  });
  this.utilsSvc.dismissLoading()
  });
}


  
  
  getPercentage() {
    return this.utilsSvc.getPercentage(this.form.value as Task);
  }

  
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.form.value.items =ev.detail.complete(this.form.value.items);
    this.form.updateValueAndValidity();
  }

  removeItem(index: number){
    this.form.value.items.splice(index, 1 );
    this.form.controls.items.updateValueAndValidity( );
          
  }

  createItem(){
    this.utilsSvc.presentAlert({
      header: 'Nueva Activdad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'hacer algo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (res) => {
           

           let item: Item = {name: res.name, completed: false }
           this.form.value.items.push(item);
           this.form.controls.items.updateValueAndValidity( );
          }
        }
      ]
    })
  }
}


