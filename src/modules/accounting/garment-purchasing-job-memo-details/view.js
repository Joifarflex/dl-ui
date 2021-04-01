import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Dialog } from '../../../au-components/dialog/dialog';

@inject(Router, Service, Dialog)
export class View {
    hasCancel = true;
    hasEdit = true;
    hasDelete = true;

    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
    }


    bind() {
        this.data = { items: [] };
        this.error = {};
    }

    async activate(params) {
        let id = params.id;
        // this.data = await this.service.getById(id);

        // if (this.data.Status == "POSTED") {
        //     this.hasPosting = false;
        //     this.editCallback = false;
        //     this.deleteCallback = false;
        // } else {
        //     this.hasPosting = true;
        // }

    }

    list() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.list();
    }

    editCallback(event) {
        this.router.navigateToRoute('edit', { id: 1 }); // Will be changed soon to this.data.Id
    }

    postingCallback(event) {
        this.dialog.prompt('Transaksi yang sudah di POSTING tidak dapat diubah dan dihapus. Apakah anda yakin?', 'Posting Jurnal Transaksi')
            .then(response => {
                if (response.ok) {
                    this.service.posting(this.data)
                        .then(result => {
                            this.list();
                        });
                }
            });
    }

    deleteCallback(event) {
        this.dialog.prompt('Apakah anda yakin akan menghapus data ini?', 'Hapus Data Jurnal Transaksi')
            .then(response => {
                if (response.ok) {
                    this.service.delete(this.data)
                        .then(result => {
                            this.list();
                        });
                }
            });
    }
}