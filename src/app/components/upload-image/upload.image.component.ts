import {Component, EventEmitter, Output} from '@angular/core';
import {MakerImageModel} from "../../models/makers.models";
import {StoreHistoryService} from "../../_service/store.history.service";
import {TypeHistoryAction} from "../../models/history.models";
import {ActionControllerService} from "../../_service/action.controller.service";

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload.image.component.html',
    styleUrls: ['./upload.image.component.scss']
})
export class UploadImageComponent {
    @Output('loadedPhoto') loadedPhotoEmit: EventEmitter<MakerImageModel[]> = new EventEmitter<MakerImageModel[]>();

    loadedPhoto: MakerImageModel[] = [];

    constructor(
        private storeHistoryService: StoreHistoryService,
        private actionControllerService: ActionControllerService
    ) {
    }

    isValidImage(value: string): boolean {
        return (
            value.includes('jpeg') || value.includes('jpg') || value.includes('png')
        );
    }

    previewFile(files: any): void {
        const arr = files ? Array.from(files) : [];

        arr.forEach((file: any) => {
            if (!file || (file && !this.isValidImage(file.name))) {
                this.actionControllerService.errorAction(`Invalid image format: ${file.name}`);
                return;
            }

            const reader: FileReader = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = () => {
                const image = new MakerImageModel({
                    isMain: !this.loadedPhoto.length,
                    path: reader.result as string,
                });
                this.loadedPhoto.push(image);
                this.actionControllerService.successAction(`Upload Image`);
            };
        });

        this.loadedPhotoEmit.emit(this.loadedPhoto);
    }

    setAsMain(
        {id: idSelectElement}: MakerImageModel
    ): void {
        this.loadedPhoto = this.loadedPhoto.map((item: MakerImageModel): MakerImageModel => {
            return {
                ...item,
                isMain: false
            };
        });
        const find = this.loadedPhoto.find(({id: idFindElement}: MakerImageModel): boolean => {
            return idSelectElement === idFindElement;
        });

        const firstElement: MakerImageModel | undefined = this.loadedPhoto[0];
        if (find) {
            this.actionControllerService.successAction(`${find.id} set us main`);
            find.isMain = true;
        } else if (firstElement) {
            this.loadedPhoto[0].isMain = true;
            this.actionControllerService.successAction(`${firstElement.id} set us main`);
        }
        this.loadedPhotoEmit.emit(this.loadedPhoto);
    }

    deleteImage(
        {id: idDeletedElement}: MakerImageModel
    ): void {
        this.loadedPhoto = this.loadedPhoto.filter(({id: idFindElement}: MakerImageModel): boolean => {
            return idDeletedElement !== idFindElement;
        });
        this.actionControllerService.successAction(`Delete image by id ${idDeletedElement}`);
        this.loadedPhotoEmit.emit(this.loadedPhoto);
    }
}
