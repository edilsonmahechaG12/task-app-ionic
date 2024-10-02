import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { 
  AlertController, 
  AlertOptions, 
  LoadingController, 
  LoadingOptions, 
  ModalController, 
  ModalOptions, 
  ToastController, 
  ToastOptions 
} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  //========== Loading ==========
  //PRESENT
  async presentLoading(opts?: LoadingOptions) {
    const loading = await this.loadingController.create(opts);
    await loading.present();
  }

  //DISMISS
  async dismissLoading() {
    return await this.loadingController.dismiss();
  }

  //========== Local Storage ==========
  //SET
  setElementInLocalstorage(key: string, element: any) {
    return localStorage.setItem(key, JSON.stringify(element));
  }

  //GET
  getElementFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  //========== Toast ==========
  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  //========== Router ==========
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //========== Alert ==========
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }

  //========== Modal ==========
  //PRESENT
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }

  //DISMISS
  dismissModal(data?: any) {
    this.modalController.dismiss(data);
  }

  //========== Percentage ==========
  getPercentage(task: Task) {
    let completedItems = task.items.filter(item => item.completed).length;
    let totalItems = task.items.length;
    let percentage = (100 / totalItems) * completedItems;
    
    return parseInt(percentage.toString());
  }
}

// Definición de la interfaz Task
interface Task {
  items: { completed: boolean }[];
}
