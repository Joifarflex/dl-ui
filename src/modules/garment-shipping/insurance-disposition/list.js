import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {

    context = ["detail","Cetak PDF"]

    columns = [
        { field: "dispositionNo", title: "No Lampiran Disposisi" },
        { field: "policyType", title: "Jenis Polis Asuransi" },
        {
            field: "paymentDate", title: "Tgl Pembayaran", formatter: function (value) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "insuranceName", title: "Dibayar Kepada" },
        { field: "bankName", title: "Bank" },
    ];

    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                for (const data of result.data) {
                    data.insurance = data.insurance || {};
                    data.insuranceName = `${data.insurance.name}`;
                }

                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }


    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "detail":
                this.router.navigateToRoute('view', { id: data.id });
                break;
            case "Cetak PDF": 
                this.service.getPdfById(data.id); 
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}
